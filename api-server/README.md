# Evan Server Dashboard - API Server

A Node.js API server built with Express, TypeScript, Prisma, and Redis for the Evan Server Dashboard.

## Features

- **Modern Stack**: Node.js 20 + Express + TypeScript
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **Authentication**: Session-based auth with bcrypt password hashing
- **Security**: CSRF protection with double-submit cookie pattern
- **Background Jobs**: BullMQ with Redis for job queues
- **WebSocket**: Real-time communication support
- **Health Checks**: Built-in health monitoring

## API Endpoints

### Health
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration (dev only)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### WebSocket
- `WS /api/ws` - WebSocket connection with heartbeat

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Redis server

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8080`

### Environment Variables

Create a `.env` file based on `env.example`:

```env
PORT=8080
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
DATABASE_URL="file:./dev.db"
REDIS_URL="redis://localhost:6379"
DEV_ALLOW_REGISTER=true
NODE_ENV=development
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run seed` - Seed the database (if implemented)

## Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Authentication Flow

1. **Registration** (dev only): Creates user with hashed password
2. **Login**: Validates credentials and creates session
3. **Session**: Stored server-side with secure cookies
4. **CSRF**: Double-submit cookie pattern for state-changing requests
5. **Logout**: Destroys session and clears cookies

## Background Jobs

The server includes BullMQ setup for background job processing:

- **Queue**: `cron-jobs` for scheduled tasks
- **Worker**: Processes jobs with retry logic
- **Example**: `enqueueExampleJob()` helper function

## WebSocket Features

- **Connection**: Automatic welcome message
- **Heartbeat**: 30-second ping/pong
- **Echo**: Echoes received messages
- **Error Handling**: Graceful error responses

## Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t api-server .

# Run with Redis
docker-compose up
```

### Health Checks

The Docker container includes health checks that hit `/api/health` endpoint.

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: httpOnly, secure cookies
- **CSRF Protection**: Double-submit cookie pattern
- **CORS**: Configured for frontend domain
- **Input Validation**: Basic request validation

## Development vs Production

### Development
- Registration enabled (`DEV_ALLOW_REGISTER=true`)
- Detailed error messages
- HTTP cookies (not secure)
- SQLite database

### Production
- Registration disabled
- Minimal error details
- Secure cookies
- Database connection string configurable

## Monitoring

- **Health Endpoint**: `/api/health` returns server status
- **Logging**: Morgan HTTP request logging
- **Error Handling**: Centralized error middleware
- **Graceful Shutdown**: SIGTERM/SIGINT handling

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include type definitions
4. Test authentication flows
5. Update documentation for new endpoints

## License

Private project - All rights reserved.
