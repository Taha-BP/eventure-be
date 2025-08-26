# Eventure - Track the Pulse of Friendship

A microservices-based backend for Eventure, a unique micro-social platform where friendship meets real-time interaction.

## 🏗️ Architecture

This project follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Main entry point, handles routing and authentication
- **Auth Service** (Port 3001) - User authentication and authorization
- **Users Service** (Port 3002) - User management
- **Friends Service** (Port 3003) - Friendship management
- **Events Service** (Port 3004) - Event creation and management
- **Leaderboard Service** (Port 3005) - Points and leaderboard management
- **Shared Library** - Common types and DTOs

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all services:

```bash
npm run install:all
```

### Running the Services

#### Start all services:
```bash
npm run start:all
```

#### Start individual services:
```bash
# API Gateway
npm run start:gateway

# Auth Service
npm run start:auth

# Users Service
npm run start:users

# Friends Service
npm run start:friends

# Events Service
npm run start:events

# Leaderboard Service
npm run start:leaderboard
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends/add` - Add a friend

### Events
- `POST /api/events` - Create an event
- `POST /api/events/:id/open` - Acknowledge an event

### Leaderboard
- `GET /api/leaderboard` - Get user's leaderboard

## 🔌 WebSocket Events

### Client to Server
- `join` - Join user's room for real-time updates

### Server to Client
- `event_created` - Sent to friends when an event is created
- `leaderboard_updated` - Sent to event creator when leaderboard updates

## 📁 Project Structure

```
eventure-be/
├── api-gateway/          # Main API Gateway
├── auth-service/         # Authentication service
├── users-service/        # User management service
├── friends-service/      # Friendship management service
├── events-service/       # Event management service
├── leaderboard-service/  # Leaderboard service
├── shared-lib/          # Shared types and DTOs
└── package.json         # Root package.json with scripts
```

## 🔧 Configuration

Environment variables can be set in `.env` files for each service:

```env
# API Gateway
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Microservice Ports
AUTH_SERVICE_PORT=3001
USERS_SERVICE_PORT=3002
FRIENDS_SERVICE_PORT=3003
EVENTS_SERVICE_PORT=3004
LEADERBOARD_SERVICE_PORT=3005

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 🎯 Features

- **User Authentication** - JWT-based authentication
- **Friend Management** - Add and manage friends
- **Event Creation** - Create events with media upload
- **Real-time Updates** - WebSocket-based real-time communication
- **Points System** - Award points based on response speed
- **Leaderboard** - Track friendship points
- **Media Support** - Upload and store images/videos

## 🛠️ Development

### Building
```bash
npm run build:all
```

### Testing
```bash
npm run test:all
```

## 📝 License

This project is licensed under the ISC License.
