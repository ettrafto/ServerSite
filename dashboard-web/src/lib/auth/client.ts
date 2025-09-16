// Client-side auth stub for now
// TODO: Replace with real API calls to /api/auth/* endpoints

export interface User {
  id: string
  email: string
}

export const authClient = {
  // Check if user is authenticated (localStorage flag for now)
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') === 'true'
  },

  // Get current user (stub)
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) return null
    return {
      id: '1',
      email: 'admin@evantrafton.me'
    }
  },

  // Login (fake for now)
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Fake login - accept any credentials
    if (email && password) {
      localStorage.setItem('auth_token', 'true')
      return { success: true }
    }
    
    return { success: false, error: 'Invalid credentials' }
  },

  // Logout
  logout(): void {
    localStorage.removeItem('auth_token')
  }
}
