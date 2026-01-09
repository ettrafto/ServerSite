import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

const loginMock = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    status: 'unauthenticated',
    user: null,
    error: undefined,
    login: loginMock,
    logout: vi.fn(),
    refreshUser: vi.fn(),
  }),
}))

describe('Login page', () => {
  beforeEach(() => {
    loginMock.mockReset()
  })

  it('submits credentials and redirects on success', async () => {
    loginMock.mockResolvedValueOnce(undefined)
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>home page</div>} />
        </Routes>
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@example.com', 'secret')
      expect(screen.getByText('home page')).toBeInTheDocument()
    })
  })

  it('shows error on failed login', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'))
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'bad')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})




