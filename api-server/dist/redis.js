"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobsQueue = exports.redis = void 0;
exports.enqueueExampleJob = enqueueExampleJob;
exports.safeGet = safeGet;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const config_js_1 = require("./config.js");
// Redis connection with BullMQ-compatible options
exports.redis = new ioredis_1.default(config_js_1.config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    connectTimeout: 10000
});
// Handle Redis connection errors gracefully
exports.redis.on('error', (err) => {
    console.warn('Redis connection error:', err.message);
    console.warn('Continuing without Redis - background jobs will be disabled');
});
exports.redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});
// BullMQ queues
exports.cronJobsQueue = new bullmq_1.Queue('cron-jobs', {
    connection: exports.redis
});
// Example job enqueuer
async function enqueueExampleJob(data) {
    try {
        await exports.cronJobsQueue.add('example-job', data, {
            delay: 1000, // 1 second delay
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
        console.log('✅ Example job enqueued');
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn('⚠️ Failed to enqueue job (Redis not available):', msg);
    }
}
// Worker setup
const worker = new bullmq_1.Worker('cron-jobs', async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Job ${job.id} completed`);
}, {
    connection: exports.redis
});
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});
worker.on('error', (err) => {
    console.warn('Worker error (Redis not available):', err.message);
});
// Optional: helper with proper error typing
async function safeGet(key) {
    try {
        return await exports.redis.get(key);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[redis] get error:', msg);
        return null;
    }
}
