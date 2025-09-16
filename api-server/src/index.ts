import dotenv from 'dotenv'
import { createServer } from './server.js'
import { setupWebSocket } from './ws.js'
import { config } from './config.js'
import { enqueueExampleJob } from './redis.js'

// Load environment variables
dotenv.config()

async function main() {
  try {
    // Create Express app
    const app = createServer()
    
    // Start HTTP server
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`)
      console.log(`📊 Health check: http://localhost:${config.port}/api/health`)
      console.log(`🔌 WebSocket: ws://localhost:${config.port}/api/ws`)
    })

    // Setup WebSocket server
    setupWebSocket(server)

    // Enqueue example job
    await enqueueExampleJob({ message: 'Hello from Evan Server Dashboard!' })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()
