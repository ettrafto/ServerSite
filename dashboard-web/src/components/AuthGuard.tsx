import { Navigate } from 'react-router-dom'
import { authClient } from '@/lib/auth/client'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  if (!authClient.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
