// Client-side auth stub for now
// TODO: Replace with real API calls to /api/auth/* endpoints
export const authClient = {
    // Check if user is authenticated (localStorage flag for now)
    isAuthenticated() {
        return localStorage.getItem('auth_token') === 'true';
    },
    // Get current user (stub)
    getCurrentUser() {
        if (!this.isAuthenticated())
            return null;
        return {
            id: '1',
            email: 'admin@evantrafton.me'
        };
    },
    // Login (fake for now)
    async login(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Fake login - accept any credentials
        if (email && password) {
            localStorage.setItem('auth_token', 'true');
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    },
    // Logout
    logout() {
        localStorage.removeItem('auth_token');
    }
};
