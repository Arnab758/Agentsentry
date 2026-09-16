# Production-Grade Multi-stage Dockerfile for Google Cloud Run
# Stage 1: Build Frontend and Backend
FROM node:20-slim AS builder

WORKDIR /app

# Copy manifests
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for compilation
RUN npm install --prefix backend && npm install --prefix frontend

# Copy application source
COPY backend ./backend
COPY frontend ./frontend

# Compile backend TypeScript & build frontend Vite bundle
RUN npm run build --prefix backend
RUN npm run build --prefix frontend

# Stage 2: Production Container
FROM node:20-slim AS runner

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

# Cloud Run dynamic port exposure
EXPOSE 8080

# Start production server
CMD ["node", "backend/dist/server.js"]
