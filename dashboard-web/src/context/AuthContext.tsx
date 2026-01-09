import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authClient, type AuthUser, HttpError } from '@/lib/auth/client'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error?: string
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    status: 'idle',
  })

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      setState((s) => ({ ...s, status: 'loading', error: undefined }))
      try {
        const user = await authClient.fetchCurrentUser()
        if (cancelled) return
        if (user) {
          setState({ user, status: 'authenticated' })
        } else {
          setState({ user: null, status: 'unauthenticated' })
        }
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load session'
        setState({ user: null, status: 'error', error: message })
      }
    }
    void init()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login: async (email: string, password: string) => {
      setState((s) => ({ ...s, status: 'loading', error: undefined }))
      try {
        const user = await authClient.login(email, password)
        setState({ user, status: 'authenticated' })
      } catch (err) {
        const dataError =
          err instanceof HttpError &&
          err.data &&
          typeof err.data === 'object' &&
          'error' in err.data
            ? (err.data as { error?: string }).error
            : undefined
        const message =
          dataError ||
          (err instanceof Error ? err.message : 'Login failed')
        setState({ user: null, status: 'unauthenticated', error: message })
        throw err
      }
    },
    logout: async () => {
      setState((s) => ({ ...s, status: 'loading', error: undefined }))
      try {
        await authClient.logout()
      } finally {
        setState({ user: null, status: 'unauthenticated' })
      }
    },
    refreshUser: async () => {
      setState((s) => ({ ...s, status: 'loading', error: undefined }))
      try {
        const user = await authClient.fetchCurrentUser()
        if (user) {
          setState({ user, status: 'authenticated' })
        } else {
          setState({ user: null, status: 'unauthenticated' })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to refresh user'
        setState({ user: null, status: 'error', error: message })
      }
    }
  }), [state])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}



