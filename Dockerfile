FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY config/ ./config/
COPY manifests/ ./manifests/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/manifests ./manifests

# Create non-root user
RUN addgroup -g 1001 -S infinity && \
    adduser -S infinity -u 1001 && \
    chown -R infinity:infinity /app

USER infinity

# Expose ports
EXPOSE 3000 3100 8080 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node dist/cli/health.js || exit 1

CMD ["node", "dist/index.js"]
