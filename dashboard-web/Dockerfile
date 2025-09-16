# ---- builder ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # copy manifest first for better cache
    COPY package*.json ./
    
    # install WITH dev deps for build tools
    RUN npm ci
    
    # now copy the rest of the source
    COPY . .
    
    # build your app (tsc + vite)
    RUN npm run build
    
    # ---- runtime ----
    FROM nginx:alpine
    # (optional) custom nginx.conf if you have one:
    # COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # copy the built static files only
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    