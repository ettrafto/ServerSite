# Evan Server Dashboard - Frontend

A modern React dashboard built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Modern Stack**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6 with protected routes
- **Authentication**: Local login system (ready for backend integration)
- **Theme**: Minimal black/white design with subtle grid background
- **Responsive**: Mobile-first design approach

## Sections

The dashboard includes the following sections (currently with placeholder content):

- **Personal**: User profile and settings
- **Server Controls**: Server management and monitoring
- **Website Manager**: Website and domain management
- **Data Explorer**: Database management and analytics
- **Monitoring**: System metrics and alerts
- **Job Runner**: Background job management
- **Secrets Manager**: API keys and secret management
- **File Manager**: File browser and backup management

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Authentication

Currently uses a local authentication stub that accepts any email/password combination. The login sets a flag in localStorage.

**Note**: Real authentication will be connected to `/api/auth/*` endpoints with proper cookie-based sessions and CSRF protection.

## Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t dashboard-web .

# Run the container
docker run -p 80:80 dashboard-web
```

### With Docker Compose

The frontend is included in the main `docker-compose.yml` file and will be served by Nginx, which proxies API requests to the backend.

## Architecture

- **Frontend**: React SPA served by Nginx
- **API Proxy**: Nginx routes `/api/*` requests to the backend
- **WebSocket**: Nginx proxies `/api/ws` to backend WebSocket server
- **Routing**: Client-side routing with React Router

## Environment Variables

No environment variables are required for the frontend in development mode. In production, the Nginx configuration handles API proxying.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test your changes locally before submitting

## License

Private project - All rights reserved.
