import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth/client'

export default function Topbar() {
  const navigate = useNavigate()
  const user = authClient.getCurrentUser()

  const handleLogout = () => {
    authClient.logout()
    navigate('/login')
  }

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Welcome back, {user?.email}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
