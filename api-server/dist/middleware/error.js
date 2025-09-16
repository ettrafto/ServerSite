"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        error: 'Internal server error',
        ...(isDevelopment && { details: err.message, stack: err.stack })
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
}
