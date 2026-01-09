import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import AuthGuard from './AuthGuard'

let mockStatus: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error' = 'unauthenticated'

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    status: mockStatus,
    user: mockStatus === 'authenticated' ? { id: 'u1', email: 'user@example.com' } : null,
    error: undefined,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  }),
}))

describe('AuthGuard', () => {
  it('shows loading state when status is loading', () => {
    mockStatus = 'loading'
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthGuard>
          <div>protected</div>
        </AuthGuard>
      </MemoryRouter>
    )
    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()
  })

  it('redirects to /login when unauthenticated', () => {
    mockStatus = 'unauthenticated'
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route
            path="/protected"
            element={
              <AuthGuard>
                <div>protected</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockStatus = 'authenticated'
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthGuard>
          <div>protected content</div>
        </AuthGuard>
      </MemoryRouter>
    )
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })
})




