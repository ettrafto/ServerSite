import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

// Simple CSRF protection using double-submit cookie pattern
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next()
  }

  // Generate CSRF token if not exists
  if (!req.session?.csrfToken) {
    req.session!.csrfToken = crypto.randomBytes(32).toString('hex')
  }

  // Set CSRF token cookie
  res.cookie('csrf_token', req.session!.csrfToken, {
    httpOnly: false, // Allow client-side access for double-submit
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  // Verify CSRF token for state-changing requests
  if (req.method !== 'GET') {
    const tokenFromHeader = req.headers['x-csrf'] as string
    const tokenFromSession = req.session?.csrfToken

    if (!tokenFromHeader || !tokenFromSession || tokenFromHeader !== tokenFromSession) {
      return res.status(403).json({ error: 'Invalid CSRF token' })
    }
  }

  next()
}
