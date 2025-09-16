import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config.js'
import { csrfProtection } from './middleware/csrf.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'

export function createServer() {
  const app = express()

  // Middleware
  app.use(morgan('combined'))
  app.use(cors({
    origin: config.isProduction ? 'https://evantrafton.me' : 'http://localhost:3000',
    credentials: true
  }))
  app.use(express.json())
  app.use(cookieParser())
  
  // Session configuration
  app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }))

  // CSRF protection
  app.use(csrfProtection)

  // Routes
  app.use('/api/health', healthRoutes)
  app.use('/api/auth', authRoutes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
