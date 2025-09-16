import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { authClient } from '@/lib/auth/client';
export default function AuthGuard({ children }) {
    if (!authClient.isAuthenticated()) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
