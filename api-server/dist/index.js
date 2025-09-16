"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_js_1 = require("./server.js");
const ws_js_1 = require("./ws.js");
const config_js_1 = require("./config.js");
const redis_js_1 = require("./redis.js");
// Load environment variables
dotenv_1.default.config();
async function main() {
    try {
        // Create Express app
        const app = (0, server_js_1.createServer)();
        // Start HTTP server
        const server = app.listen(config_js_1.config.port, () => {
            console.log(`🚀 Server running on port ${config_js_1.config.port}`);
            console.log(`📊 Health check: http://localhost:${config_js_1.config.port}/api/health`);
            console.log(`🔌 WebSocket: ws://localhost:${config_js_1.config.port}/api/ws`);
        });
        // Setup WebSocket server
        (0, ws_js_1.setupWebSocket)(server);
        // Enqueue example job
        await (0, redis_js_1.enqueueExampleJob)({ message: 'Hello from Evan Server Dashboard!' });
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Failed to start server:', msg);
        process.exit(1);
    }
}
main();
