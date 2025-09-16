"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_js_1 = require("./config.js");
const csrf_js_1 = require("./middleware/csrf.js");
const error_js_1 = require("./middleware/error.js");
const health_js_1 = __importDefault(require("./routes/health.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
function createServer() {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, morgan_1.default)('combined'));
    app.use((0, cors_1.default)({
        origin: config_js_1.config.isProduction ? 'https://evantrafton.me' : 'http://localhost:3000',
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // Session configuration
    app.use((0, express_session_1.default)({
        secret: config_js_1.config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: config_js_1.config.isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));
    // CSRF protection
    app.use(csrf_js_1.csrfProtection);
    // Routes
    app.use('/api/health', health_js_1.default);
    app.use('/api/auth', auth_js_1.default);
    // Error handling
    app.use(error_js_1.notFoundHandler);
    app.use(error_js_1.errorHandler);
    return app;
}
