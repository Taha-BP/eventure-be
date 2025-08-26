#!/bin/bash

# Eventure Test Setup Script
echo "🧪 Testing Eventure Microservices Setup..."

# Check if all services are built
echo "📦 Checking service builds..."

services=("api-gateway" "auth-service" "users-service" "friends-service" "events-service" "leaderboard-service")

for service in "${services[@]}"; do
    if [ -d "$service" ]; then
        echo "✅ $service directory exists"
        
        # Check if package.json exists
        if [ -f "$service/package.json" ]; then
            echo "✅ $service package.json exists"
        else
            echo "❌ $service package.json missing"
        fi
        
        # Check if src directory exists
        if [ -d "$service/src" ]; then
            echo "✅ $service src directory exists"
        else
            echo "❌ $service src directory missing"
        fi
    else
        echo "❌ $service directory missing"
    fi
    echo ""
done

# Check shared library
echo "📚 Checking shared library..."
if [ -d "shared-lib" ]; then
    echo "✅ shared-lib directory exists"
    if [ -f "shared-lib/package.json" ]; then
        echo "✅ shared-lib package.json exists"
    fi
    if [ -d "shared-lib/dist" ]; then
        echo "✅ shared-lib built successfully"
    else
        echo "⚠️  shared-lib not built yet"
    fi
else
    echo "❌ shared-lib directory missing"
fi

echo ""
echo "🎯 Setup verification complete!"
echo ""
echo "To start development:"
echo "1. Run: npm run install:all"
echo "2. Run: npm run start:all"
echo ""
echo "Or use Docker:"
echo "1. Run: docker-compose up --build"
