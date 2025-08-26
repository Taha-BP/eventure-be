#!/bin/bash

# Eventure Development Script
echo "🚀 Starting Eventure Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

# Install dependencies for all services
echo "📦 Installing service dependencies..."
npm run install:all

# Create uploads directory
mkdir -p uploads

echo "✅ Dependencies installed successfully!"
echo ""
echo "🎯 Available commands:"
echo "  npm run start:all        - Start all services"
echo "  npm run start:gateway    - Start API Gateway only"
echo "  npm run start:auth       - Start Auth Service only"
echo "  npm run start:users      - Start Users Service only"
echo "  npm run start:friends    - Start Friends Service only"
echo "  npm run start:events     - Start Events Service only"
echo "  npm run start:leaderboard - Start Leaderboard Service only"
echo ""
echo "🔧 To start all services, run: npm run start:all"
