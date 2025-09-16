import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
import { config } from './config.js'

// Redis connection with BullMQ-compatible options
export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 10000
})

// Handle Redis connection errors gracefully
redis.on('error', (err: Error) => {
  console.warn('Redis connection error:', err.message)
  console.warn('Continuing without Redis - background jobs will be disabled')
})

redis.on('connect', () => {
  console.log('✅ Connected to Redis')
})

// BullMQ queues
export const cronJobsQueue = new Queue('cron-jobs', {
  connection: redis
})

// Example job enqueuer
export async function enqueueExampleJob(data: any) {
  try {
    await cronJobsQueue.add('example-job', data, {
      delay: 1000, // 1 second delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    })
    console.log('✅ Example job enqueued')
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn('⚠️ Failed to enqueue job (Redis not available):', msg)
  }
}

// Worker setup
const worker = new Worker('cron-jobs', async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data)
  
  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log(`Job ${job.id} completed`)
}, {
  connection: redis
})

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

worker.on('error', (err: Error) => {
  console.warn('Worker error (Redis not available):', err.message)
})

// Optional: helper with proper error typing
export async function safeGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[redis] get error:', msg)
    return null
  }
}
