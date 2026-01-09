import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authClient, HttpError } from './client'

const jsonResponse = (body: any, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })

describe('authClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    authClient.clearCache()
  })

  it('getCsrfToken caches the token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ csrfToken: 'token-1' }))

    global.fetch = fetchMock as unknown as typeof fetch

    const first = await authClient.getCsrfToken()
    const second = await authClient.getCsrfToken()

    expect(first).toBe('token-1')
    expect(second).toBe('token-1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('login succeeds with csrf and returns user', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ csrfToken: 'token-1' })) // /csrf
      .mockResolvedValueOnce(jsonResponse({ user: { id: 'u1', email: 'user@example.com' } })) // login

    global.fetch = fetchMock as unknown as typeof fetch

    const user = await authClient.login('user@example.com', 'secret')

    expect(user.email).toBe('user@example.com')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const loginCall = fetchMock.mock.calls[1]
    expect(loginCall[0]).toBe('/api/auth/login')
    expect((loginCall[1] as RequestInit)?.headers).toMatchObject({
      'Content-Type': 'application/json',
      'x-csrf': 'token-1',
    })
  })

  it('login rejects on 401 with HttpError', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ csrfToken: 'token-1' }))
      .mockResolvedValueOnce(jsonResponse({ error: 'Invalid credentials' }, 401))

    global.fetch = fetchMock as unknown as typeof fetch

    await expect(authClient.login('user@example.com', 'bad'))
      .rejects.toBeInstanceOf(HttpError)
  })

  it('fetchCurrentUser returns user on 200 and null on 401', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ user: { id: 'u1', email: 'user@example.com' } })) // first call
      .mockResolvedValueOnce(jsonResponse({ error: 'Unauthorized' }, 401)) // second call

    global.fetch = fetchMock as unknown as typeof fetch

    const user = await authClient.fetchCurrentUser()
    expect(user?.email).toBe('user@example.com')

    const none = await authClient.fetchCurrentUser()
    expect(none).toBeNull()
  })

  it('retries login once on CSRF 403 by refreshing token', async () => {
    const fetchMock = vi.fn()
      // first token
      .mockResolvedValueOnce(jsonResponse({ csrfToken: 'token-1' }))
      // first login attempt -> 403
      .mockResolvedValueOnce(jsonResponse({ error: 'Invalid CSRF token' }, 403))
      // refresh token
      .mockResolvedValueOnce(jsonResponse({ csrfToken: 'token-2' }))
      // retry login success
      .mockResolvedValueOnce(jsonResponse({ user: { id: 'u2', email: 'user@example.com' } }))

    global.fetch = fetchMock as unknown as typeof fetch

    const user = await authClient.login('user@example.com', 'secret')
    expect(user.email).toBe('user@example.com')

    expect(fetchMock).toHaveBeenCalledTimes(4)
    const firstLoginCallHeaders = (fetchMock.mock.calls[1][1] as RequestInit)?.headers as Record<string, string>
    const retryLoginCallHeaders = (fetchMock.mock.calls[3][1] as RequestInit)?.headers as Record<string, string>
    expect(firstLoginCallHeaders['x-csrf']).toBe('token-1')
    expect(retryLoginCallHeaders['x-csrf']).toBe('token-2')
  })
})



