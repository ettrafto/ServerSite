import { Request, Response, NextFunction } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export function authRequired(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  
  // Type assertion is safe here because we checked above
  req.user = req.session.user
  next()
}
