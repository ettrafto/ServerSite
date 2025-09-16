import { WebSocketServer } from 'ws'
import { Server } from 'http'
import { config } from './config.js'

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/api/ws'
  })

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection')
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Evan Server Dashboard WebSocket'
    }))

    // Set up heartbeat
    const heartbeat = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: Date.now()
        }))
      } else {
        clearInterval(heartbeat)
      }
    }, 30000) // 30 seconds

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())
        console.log('Received WebSocket message:', message)
        
        // Echo back the message
        ws.send(JSON.stringify({
          type: 'echo',
          originalMessage: message,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON message'
        }))
      }
    })

    ws.on('close', () => {
      console.log('WebSocket connection closed')
      clearInterval(heartbeat)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      clearInterval(heartbeat)
    })
  })

  return wss
}
