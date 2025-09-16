import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  User,
  Server,
  Globe,
  Database,
  Activity,
  Play,
  Key,
  FolderOpen
} from 'lucide-react'

const navigation = [
  { name: 'Personal', href: '/personal', icon: User },
  { name: 'Server Controls', href: '/server-controls', icon: Server },
  { name: 'Website Manager', href: '/website-manager', icon: Globe },
  { name: 'Data Explorer', href: '/data-explorer', icon: Database },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Job Runner', href: '/job-runner', icon: Play },
  { name: 'Secrets Manager', href: '/secrets-manager', icon: Key },
  { name: 'File Manager', href: '/file-manager', icon: FolderOpen },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">Evan Server Dashboard</h1>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
              (location.pathname === '/' && item.href === '/personal')
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
