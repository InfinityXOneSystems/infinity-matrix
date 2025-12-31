#!/bin/bash

# Integration Test Script
# This script tests the full system integration

set -e

echo "🧪 Running Integration Tests"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Start backend in test mode
print_info "Starting backend server..."
cd backend
PORT=3333 NODE_ENV=test npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
print_info "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3333/health > /dev/null 2>&1; then
        print_status "Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Run integration tests
echo ""
print_info "Running API integration tests..."

# Test 1: Health check
print_info "Test 1: Health check endpoint"
HEALTH_RESPONSE=$(curl -s http://localhost:3333/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    print_status "Health check passed"
else
    print_error "Health check failed"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Test 2: Get agents
print_info "Test 2: Get agents endpoint"
AGENTS_RESPONSE=$(curl -s http://localhost:3333/api/agents)
if echo "$AGENTS_RESPONSE" | grep -q "success"; then
    print_status "Get agents passed"
else
    print_error "Get agents failed"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Test 3: System status
print_info "Test 3: System status endpoint"
STATUS_RESPONSE=$(curl -s http://localhost:3333/api/system/status)
if echo "$STATUS_RESPONSE" | grep -q "healthy"; then
    print_status "System status passed"
else
    print_error "System status failed"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Test 4: AI models endpoint
print_info "Test 4: AI models endpoint"
MODELS_RESPONSE=$(curl -s http://localhost:3333/api/ai/models)
if echo "$MODELS_RESPONSE" | grep -q "success"; then
    print_status "AI models passed"
else
    print_error "AI models failed"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Cleanup
print_info "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
sleep 2

echo ""
echo "================================"
print_status "All integration tests passed!"
echo ""

exit 0
