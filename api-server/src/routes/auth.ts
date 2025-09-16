import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../db.js'
import { config } from '../config.js'
import { authRequired, AuthenticatedRequest } from '../middleware/authRequired.js'

const router = Router()

// Register endpoint (only enabled in development)
router.post('/register', async (req: Request, res: Response) => {
  if (!config.devAllowRegister) {
    return res.status(403).json({ error: 'Registration is disabled' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash
      }
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Set session
    req.session!.user = {
      id: user.id,
      email: user.email
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  req.session?.destroy((err: Error | null) => {
    if (err) {
      console.error('Session destruction error:', err)
      return res.status(500).json({ error: 'Logout failed' })
    }

    res.clearCookie('connect.sid')
    res.json({ message: 'Logout successful' })
  })
})

// Get current user
router.get('/me', authRequired, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user
  })
})

export default router
