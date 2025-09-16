"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = csrfProtection;
exports.attachCsrf = attachCsrf;
exports.verifyCsrf = verifyCsrf;
const crypto_1 = __importDefault(require("crypto"));
// Simple CSRF protection using double-submit cookie pattern
function csrfProtection(req, res, next) {
    // Skip CSRF for GET requests
    if (req.method === 'GET') {
        return next();
    }
    // Generate CSRF token if not exists
    if (!req.session?.csrfToken) {
        req.session.csrfToken = crypto_1.default.randomBytes(32).toString('hex');
    }
    // Set CSRF token cookie
    res.cookie('csrf_token', req.session.csrfToken, {
        httpOnly: false, // Allow client-side access for double-submit
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    // Verify CSRF token for state-changing requests
    if (req.method !== 'GET') {
        const tokenFromHeader = req.headers['x-csrf'];
        const tokenFromSession = req.session?.csrfToken;
        if (!tokenFromHeader || !tokenFromSession || tokenFromHeader !== tokenFromSession) {
            return res.status(403).json({ error: 'Invalid CSRF token' });
        }
    }
    next();
}
function attachCsrf(req, res, next) {
    if (!req.session)
        return next();
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto_1.default.randomBytes(32).toString('hex');
    }
    res.setHeader('X-CSRF-Token', req.session.csrfToken);
    next();
}
function verifyCsrf(req, res, next) {
    const token = (req.get('x-csrf-token') ?? req.body?.csrfToken ?? req.query?.csrfToken);
    if (!req.session?.csrfToken || !token || token !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
}
