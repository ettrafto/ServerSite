#!/bin/bash

# Evan Server Dashboard - Setup Script
# This script sets up both the frontend and backend for local development

set -e

echo "🚀 Setting up Evan Server Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    print_warning "Redis is not running. Please start Redis server first:"
    echo "  macOS: brew services start redis"
    echo "  Ubuntu: sudo systemctl start redis"
    echo "  Docker: docker run -d -p 6379:6379 redis:alpine"
    echo ""
    read -p "Press Enter to continue anyway (you'll need to start Redis before running the backend)..."
fi

# Setup Backend (api-server)
echo ""
echo "🔧 Setting up backend (api-server)..."
cd api-server

if [ ! -f .env ]; then
    print_status "Creating .env file from template"
    cp env.example .env
    print_warning "Please review and update .env file with your settings"
else
    print_status ".env file already exists"
fi

print_status "Installing backend dependencies"
npm install

print_status "Generating Prisma client"
npm run prisma:generate

print_status "Running database migrations"
npm run prisma:migrate

print_status "Seeding database with default admin user"
npm run seed

cd ..

# Setup Frontend (dashboard-web)
echo ""
echo "🎨 Setting up frontend (dashboard-web)..."
cd dashboard-web

print_status "Installing frontend dependencies"
npm install

cd ..

# Create startup scripts
echo ""
echo "📝 Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting backend server..."
cd api-server
npm run dev
EOF

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting frontend server..."
cd dashboard-web
npm run dev
EOF

# Both startup script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Evan Server Dashboard in development mode..."

# Start backend in background
echo "Starting backend..."
cd api-server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd ../dashboard-web
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:8080"
echo "💚 Health: http://localhost:8080/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh start-dev.sh

print_status "Created startup scripts:"
echo "  - start-backend.sh (backend only)"
echo "  - start-frontend.sh (frontend only)"
echo "  - start-dev.sh (both servers)"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure Redis is running"
echo "2. Review api-server/.env configuration"
echo "3. Start development servers:"
echo "   ./start-dev.sh"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@evantrafton.me"
echo "   Password: admin123"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api/health"
echo "   WebSocket: ws://localhost:8080/api/ws"
echo ""
echo "📚 For Docker deployment, see README.md"
