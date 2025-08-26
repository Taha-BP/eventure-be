export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  microservices: {
    auth: {
      host: process.env.AUTH_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
    },
    users: {
      host: process.env.USERS_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USERS_SERVICE_PORT || '3002', 10),
    },
    friends: {
      host: process.env.FRIENDS_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.FRIENDS_SERVICE_PORT || '3003', 10),
    },
    events: {
      host: process.env.EVENTS_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.EVENTS_SERVICE_PORT || '3004', 10),
    },
    leaderboard: {
      host: process.env.LEADERBOARD_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.LEADERBOARD_SERVICE_PORT || '3005', 10),
    },
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  },
});
