# -------------------------------
# Multi-stage build for Node.js API server
# -------------------------------

# ---- Builder ----
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  # Copy manifests and Prisma schema first for better caching
  COPY package*.json ./
  COPY prisma ./prisma/
  
  # Install dependencies (includes dev deps for build)
  RUN npm ci
  
  # Generate Prisma client
  RUN npx prisma generate
  
  # Copy source code
  COPY . .
  
  # Build the application (TypeScript → dist)
  RUN npm run build
  
  
  # ---- Production ----
  FROM node:20-alpine AS production
  
  WORKDIR /app
  
  # Install runtime dependencies:
  # - dumb-init for signal handling
  # - OpenSSL (Prisma requires it on Alpine)
  RUN apk add --no-cache dumb-init \
      && (apk add --no-cache openssl1.1-compat || apk add --no-cache openssl)
  
  # Create non-root user
  RUN addgroup -g 1001 -S nodejs \
      && adduser -S nodejs -u 1001
  
  # Copy built app, runtime deps, and prisma files
  COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
  COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
  COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
  COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
  
  # Switch to non-root user
  USER nodejs
  
  # Expose port
  EXPOSE 8080
  
  # Health check (optional: adapt /api/health to your actual route)
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
  
  # Entrypoint
  ENTRYPOINT ["dumb-init", "--"]
  CMD ["node", "dist/index.js"]
  