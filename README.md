# Evan Server Dashboard

A modern server management dashboard consisting of a React frontend and Node.js backend API.

## Architecture

This is a **polyrepo** project with two separate repositories:

- **`dashboard-web`**: React frontend with Vite, TypeScript, Tailwind CSS, and shadcn/ui
- **`api-server`**: Node.js backend with Express, TypeScript, Prisma, and Redis

## Features

### Frontend (`dashboard-web`)
- Modern React 18 + Vite + TypeScript stack
- Tailwind CSS with shadcn/ui components
- Minimal black/white theme with subtle grid background
- React Router v6 with protected routes
- Local authentication system (ready for backend integration)
- 8 dashboard sections with placeholder content and demo tabs

### Backend (`api-server`)
- Node.js 20 + Express + TypeScript
- Prisma ORM with SQLite database
- Session-based authentication with bcrypt
- CSRF protection with double-submit cookie pattern
- BullMQ job queues with Redis
- WebSocket server with heartbeat
- Health monitoring endpoints

## Quick Start

### Prerequisites
- Node.js 20+
- npm
- Redis server
- Docker (optional)

### Local Development

1. **Start Redis**:
   ```bash
   redis-server
   ```

2. **Backend Setup**:
   ```bash
   cd api-server
   npm install
   cp env.example .env
   npm run prisma:migrate
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd dashboard-web
   npm install
   npm run dev
   ```

4. **Access**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/health
   - WebSocket: ws://localhost:8080/api/ws

### Docker Development

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Or start individual services
docker-compose up redis api-server
```

## Production Deployment

### With Docker Compose

```bash
# Production deployment
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost (Nginx)
# - Backend: http://localhost:8080
# - Redis: http://localhost:6379
```

### With Cloudflare Tunnel

1. Set up Cloudflare Tunnel with the provided `cloudflared-config.yml`
2. Update tunnel ID and credentials file path
3. Deploy with Docker Compose
4. Access via `evantrafton.me`

## Routing Configuration

### Nginx (Production)
- Frontend served at `evantrafton.me`
- API requests proxied to `evantrafton.me/api/*`
- WebSocket proxied to `evantrafton.me/api/ws`

### Development
- Frontend: `localhost:3000`
- Backend: `localhost:8080`
- Vite proxy handles `/api` requests

## Authentication

### Current Implementation
- **Frontend**: Local storage flag (demo only)
- **Backend**: Real session-based auth with cookies

### Future Integration
- Replace frontend stub with real API calls
- Connect to `/api/auth/*` endpoints
- Implement proper CSRF token handling

## API Endpoints

### Health
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/register` - User registration (dev only)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

### WebSocket
- `WS /api/ws` - Real-time communication

## Dashboard Sections

1. **Personal** - User profile and settings
2. **Server Controls** - Server management
3. **Website Manager** - Website and domain management
4. **Data Explorer** - Database management
5. **Monitoring** - System metrics and alerts
6. **Job Runner** - Background job management
7. **Secrets Manager** - API keys and secrets
8. **File Manager** - File browser and backups

## Environment Variables

### Backend (`api-server/.env`)
```env
PORT=8080
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
DATABASE_URL="file:./dev.db"
REDIS_URL="redis://localhost:6379"
DEV_ALLOW_REGISTER=true
NODE_ENV=development
```

### Frontend
No environment variables required for development.

## Development Workflow

1. **Backend Changes**: Restart `npm run dev` in `api-server/`
2. **Frontend Changes**: Hot reload in `dashboard-web/`
3. **Database Changes**: Run `npm run prisma:migrate` in `api-server/`
4. **New Dependencies**: Update respective `package.json` files

## CI/CD

Both repositories include GitHub Actions workflows:
- **Linting**: ESLint for code quality
- **Type Checking**: TypeScript compilation
- **Building**: Production build verification

## Security Considerations

- **Passwords**: bcrypt hashing with salt rounds
- **Sessions**: httpOnly, secure cookies
- **CSRF**: Double-submit cookie pattern
- **CORS**: Configured for frontend domain
- **Input Validation**: Basic request validation

## Monitoring

- **Health Checks**: `/api/health` endpoint
- **Logging**: Morgan HTTP request logging
- **Error Handling**: Centralized error middleware
- **Graceful Shutdown**: SIGTERM/SIGINT handling

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling and validation
3. Include comprehensive type definitions
4. Test authentication flows thoroughly
5. Update documentation for new features

## License

Private project - All rights reserved.