# Multi-stage Dockerfile optimized for Google Cloud Run
# Stage 1: Build frontend & backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace and package manifests
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for compilation
RUN npm install --prefix backend && npm install --prefix frontend

# Copy source trees
COPY backend ./backend
COPY frontend ./frontend

# Compile backend TypeScript & build frontend Vite bundle
RUN npm run build --prefix backend
RUN npm run build --prefix frontend

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy root manifest and backend manifests
COPY package.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only for backend
RUN npm install --prefix backend --omit=dev && npm cache clean --force

# Copy compiled backend dist and frontend static dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Security: Run under non-root user
RUN chown -R node:node /app
USER node

# Cloud Run default port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start production server
CMD ["node", "backend/dist/server.js"]
