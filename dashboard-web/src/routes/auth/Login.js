import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await authClient.login(email, password);
            if (result.success) {
                navigate('/');
            }
            else {
                setError(result.error || 'Login failed');
            }
        }
        catch (err) {
            setError('An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-bold text-foreground", children: "Evan Server Dashboard" }), _jsx("p", { className: "mt-2 text-center text-sm text-muted-foreground", children: "Sign in to your account" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-foreground", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent", placeholder: "Enter your email" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-foreground", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent", placeholder: "Enter your password" })] })] }), error && (_jsx("div", { className: "text-sm text-destructive text-center", children: error })), _jsx("div", { children: _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? 'Signing in...' : 'Sign in' }) }), _jsxs("div", { className: "text-xs text-muted-foreground text-center", children: [_jsx("p", { children: "Note: This is a demo login. Any email/password combination will work." }), _jsx("p", { children: "Real authentication will be connected to /api/auth/* endpoints." })] })] })] }) }));
}
