#!/bin/bash
# One-Button Scripts for InfinityXAI
# Provides simple commands for common operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================================
# HYDRATE - Set up environment and dependencies
# ============================================================================
hydrate() {
    log_info "Hydrating InfinityXAI system..."
    
    cd "$PROJECT_ROOT"
    
    # Install backend dependencies
    if [ -f "backend/requirements.txt" ]; then
        log_info "Installing backend dependencies..."
        pip install -r backend/requirements.txt
    fi
    
    # Install frontend dependencies
    if [ -f "frontend/package.json" ]; then
        log_info "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
    
    # Install magic pack dependencies
    if [ -f "magic_pack/requirements.txt" ]; then
        log_info "Installing magic pack dependencies..."
        pip install -r magic_pack/requirements.txt
    fi
    
    log_info "Hydration complete!"
}

# ============================================================================
# PREFLIGHT - Run pre-deployment checks
# ============================================================================
preflight() {
    log_info "Running preflight checks..."
    
    local failed=0
    
    # Check environment variables
    log_info "Checking environment variables..."
    required_vars=("GCP_PROJECT_ID" "MCP_API_KEY")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required environment variable: $var"
            failed=1
        fi
    done
    
    # Check GCP authentication
    log_info "Checking GCP authentication..."
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        log_error "No active GCP authentication found"
        failed=1
    fi
    
    # Check backend health (if running)
    log_info "Checking backend health..."
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        log_info "Backend is healthy"
    else
        log_warn "Backend is not running locally"
    fi
    
    # Check MCP gateway health (if running)
    log_info "Checking MCP gateway health..."
    if curl -sf http://localhost:8001/mcp/health > /dev/null 2>&1; then
        log_info "MCP gateway is healthy"
    else
        log_warn "MCP gateway is not running locally"
    fi
    
    # Run tests
    log_info "Running tests..."
    if [ -f "$PROJECT_ROOT/backend/pytest.ini" ]; then
        cd "$PROJECT_ROOT/backend" && pytest -v || failed=1
    fi
    
    if [ $failed -eq 0 ]; then
        log_info "✅ Preflight checks PASSED"
        return 0
    else
        log_error "❌ Preflight checks FAILED"
        return 1
    fi
}

# ============================================================================
# DEPLOY - Deploy to Cloud Run
# ============================================================================
deploy() {
    local env="${1:-staging}"
    log_info "Deploying to $env..."
    
    # Run preflight first
    if ! preflight; then
        log_error "Preflight checks failed. Aborting deployment."
        return 1
    fi
    
    cd "$PROJECT_ROOT"
    
    # Deploy MCP Gateway
    log_info "Deploying MCP Gateway..."
    gcloud run deploy infinity-mcp-gateway-$env \
        --source magic_pack/mcp_gateway \
        --region us-east1 \
        --allow-unauthenticated \
        --set-env-vars MCP_API_KEY="$MCP_API_KEY"
    
    # Deploy Backend API
    log_info "Deploying Backend API..."
    gcloud run deploy infinity-api-$env \
        --source backend \
        --region us-east1 \
        --allow-unauthenticated
    
    # Deploy Frontend
    log_info "Deploying Frontend..."
    gcloud run deploy infinity-web-$env \
        --source frontend \
        --region us-east1 \
        --allow-unauthenticated
    
    log_info "✅ Deployment to $env complete!"
}

# ============================================================================
# ROLLBACK - Rollback to previous version
# ============================================================================
rollback() {
    local env="${1:-staging}"
    local service="${2:-all}"
    
    log_warn "Rolling back $service in $env..."
    
    if [ "$service" = "all" ]; then
        services=("infinity-mcp-gateway-$env" "infinity-api-$env" "infinity-web-$env")
    else
        services=("$service-$env")
    fi
    
    for svc in "${services[@]}"; do
        log_info "Rolling back $svc..."
        # Get previous revision
        prev_revision=$(gcloud run revisions list \
            --service="$svc" \
            --region=us-east1 \
            --format="value(name)" \
            --limit=2 | tail -n 1)
        
        if [ -n "$prev_revision" ]; then
            gcloud run services update-traffic "$svc" \
                --region=us-east1 \
                --to-revisions="$prev_revision=100"
            log_info "✅ Rolled back $svc to $prev_revision"
        else
            log_error "No previous revision found for $svc"
        fi
    done
}

# ============================================================================
# VERIFY - Verify deployment
# ============================================================================
verify() {
    local env="${1:-staging}"
    log_info "Verifying $env deployment..."
    
    # Get service URLs
    mcp_url=$(gcloud run services describe infinity-mcp-gateway-$env --region=us-east1 --format="value(status.url)")
    api_url=$(gcloud run services describe infinity-api-$env --region=us-east1 --format="value(status.url)")
    web_url=$(gcloud run services describe infinity-web-$env --region=us-east1 --format="value(status.url)")
    
    log_info "MCP Gateway: $mcp_url"
    log_info "API: $api_url"
    log_info "Web: $web_url"
    
    # Test endpoints
    local failed=0
    
    log_info "Testing MCP Gateway health..."
    if curl -sf "$mcp_url/mcp/health" | jq -e '.status == "healthy"' > /dev/null; then
        log_info "✅ MCP Gateway is healthy"
    else
        log_error "❌ MCP Gateway health check failed"
        failed=1
    fi
    
    log_info "Testing API health..."
    if curl -sf "$api_url/health" > /dev/null; then
        log_info "✅ API is healthy"
    else
        log_error "❌ API health check failed"
        failed=1
    fi
    
    log_info "Testing Web..."
    if curl -sf "$web_url" > /dev/null; then
        log_info "✅ Web is accessible"
    else
        log_error "❌ Web is not accessible"
        failed=1
    fi
    
    if [ $failed -eq 0 ]; then
        log_info "✅ Verification PASSED"
        return 0
    else
        log_error "❌ Verification FAILED"
        return 1
    fi
}

# ============================================================================
# RUN-DEMO - Run a demo of the system
# ============================================================================
run_demo() {
    log_info "Running InfinityXAI demo..."
    
    # Start services locally
    log_info "Starting MCP Gateway..."
    cd "$PROJECT_ROOT/magic_pack/mcp_gateway" && python main.py &
    MCP_PID=$!
    
    sleep 3
    
    log_info "Starting Backend API..."
    cd "$PROJECT_ROOT/backend" && uvicorn main:app --port 8000 &
    API_PID=$!
    
    sleep 3
    
    log_info "Starting Frontend..."
    cd "$PROJECT_ROOT/frontend" && npm run dev &
    WEB_PID=$!
    
    log_info "Demo services started!"
    log_info "  MCP Gateway: http://localhost:8001"
    log_info "  API: http://localhost:8000"
    log_info "  Web: http://localhost:5173"
    log_info ""
    log_info "Press Ctrl+C to stop all services"
    
    # Wait for Ctrl+C
    trap "kill $MCP_PID $API_PID $WEB_PID 2>/dev/null; exit" INT
    wait
}

# ============================================================================
# RUN-AUTOPILOT - Run autopilot cycle
# ============================================================================
run_autopilot() {
    log_info "Running Autopilot cycle..."
    
    cd "$PROJECT_ROOT/magic_pack/autopilot"
    python engine.py
}

# ============================================================================
# Main command dispatcher
# ============================================================================
case "${1:-help}" in
    hydrate)
        hydrate
        ;;
    preflight)
        preflight
        ;;
    deploy)
        deploy "${2:-staging}"
        ;;
    rollback)
        rollback "${2:-staging}" "${3:-all}"
        ;;
    verify)
        verify "${2:-staging}"
        ;;
    run-demo)
        run_demo
        ;;
    run-autopilot)
        run_autopilot
        ;;
    *)
        echo "InfinityXAI One-Button Scripts"
        echo ""
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  hydrate              - Install all dependencies"
        echo "  preflight            - Run pre-deployment checks"
        echo "  deploy [env]         - Deploy to environment (default: staging)"
        echo "  rollback [env] [svc] - Rollback deployment"
        echo "  verify [env]         - Verify deployment"
        echo "  run-demo             - Run local demo"
        echo "  run-autopilot        - Run autopilot cycle"
        echo ""
        ;;
esac
