"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
function authRequired(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // Type assertion is safe here because we checked above
    req.user = req.session.user;
    next();
}
