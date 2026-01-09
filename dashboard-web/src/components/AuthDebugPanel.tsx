import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { authClient } from '@/lib/auth/client'

export default function AuthDebugPanel() {
  const { status, user, error, login, logout, refreshUser } = useAuth()
  const [meResult, setMeResult] = useState<string>('')
  const [csrfToken, setCsrfToken] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const runWithState = async (fn: () => Promise<void>) => {
    setLoading(true)
    setActionError('')
    try {
      await fn()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Auth Debug Panel (dev only)</h1>
        <p className="text-sm text-muted-foreground">Inspect auth state and hit backend auth endpoints.</p>
      </div>

      <div className="space-y-2">
        <div className="text-sm">Status: <span className="font-mono">{status}</span></div>
        <div className="text-sm">User: <pre className="bg-muted p-2 rounded">{JSON.stringify(user, null, 2)}</pre></div>
        {error && <div className="text-sm text-destructive">Context error: {error}</div>}
        {actionError && <div className="text-sm text-destructive">Action error: {actionError}</div>}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => runWithState(async () => {
            const token = await authClient.getCsrfToken()
            setCsrfToken(token)
          })}
        >
          Fetch CSRF token
        </Button>

        <Button
          variant="outline"
          disabled={loading}
          onClick={() => runWithState(async () => {
            const me = await authClient.fetchCurrentUser()
            setMeResult(JSON.stringify(me, null, 2))
          })}
        >
          Call /api/auth/me
        </Button>

        <Button
          variant="outline"
          disabled={loading}
          onClick={() => runWithState(async () => {
            await login('admin@evantrafton.me', 'admin123')
          })}
        >
          Login as seeded admin
        </Button>

        <Button
          variant="outline"
          disabled={loading}
          onClick={() => runWithState(async () => {
            await logout()
          })}
        >
          Logout
        </Button>

        <Button
          variant="outline"
          disabled={loading}
          onClick={() => runWithState(refreshUser)}
        >
          Refresh user (GET /me)
        </Button>
      </div>

      {csrfToken && (
        <div className="text-sm">
          CSRF token: <code className="font-mono">{csrfToken}</code>
        </div>
      )}

      {meResult && (
        <div className="text-sm">
          /api/auth/me response:
          <pre className="bg-muted p-2 rounded">{meResult}</pre>
        </div>
      )}
    </div>
  )
}




