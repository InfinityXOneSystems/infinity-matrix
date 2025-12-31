#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║   Infinity Matrix Admin System Launcher       ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_status "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_status "Docker Compose is installed"

# Check for environment files
if [ ! -f "./backend/.env" ]; then
    print_warning "Backend .env file not found. Creating from template..."
    cp ./backend/.env.example ./backend/.env
    print_warning "Please edit ./backend/.env with your API keys before proceeding."
    read -p "Press Enter when ready to continue..."
fi

if [ ! -f "./frontend/.env" ]; then
    print_warning "Frontend .env file not found. Creating from template..."
    cp ./frontend/.env.example ./frontend/.env
fi

# Stop any existing containers
echo ""
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true
print_status "Existing containers stopped"

# Build and start services
echo ""
echo "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check backend health
echo "Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Backend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start"
        echo "Logs:"
        docker-compose logs backend
        exit 1
    fi
    sleep 2
done

# Check frontend health
echo "Checking frontend health..."
for i in {1..30}; do
    if curl -s http://localhost > /dev/null 2>&1; then
        print_status "Frontend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Frontend failed to start"
        echo "Logs:"
        docker-compose logs frontend
        exit 1
    fi
    sleep 2
done

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║         System Successfully Launched!         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3000"
echo "Health Check: http://localhost:3000/health"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the system:"
echo "  docker-compose down"
echo ""
