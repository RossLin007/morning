# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-slim AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Final Production Image
FROM node:20-slim
WORKDIR /app

# Copy built backend
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules

# Copy built frontend (BFF will serve this)
COPY --from=frontend-builder /app/client/dist ./client/dist

# Expose the port Cloud Run will use
ENV PORT=8080
EXPOSE 8080

# Environment variables will be injected by Cloud Run
# We start the backend from the server directory
WORKDIR /app/server
CMD ["node", "dist/index.js"]
