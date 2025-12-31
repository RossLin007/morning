# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/client
ARG _VITE_API_KEY
ARG _VITE_GEMINI_API_KEY
ARG _VITE_SUPABASE_URL
ARG _VITE_SUPABASE_ANON_KEY
ARG _VITE_UNIAUTH_BASE_URL
ARG _VITE_UNIAUTH_CLIENT_ID
# Note: Client secret removed for security - frontend uses PKCE flow
ENV VITE_API_KEY=$_VITE_API_KEY
ENV VITE_GEMINI_API_KEY=$_VITE_GEMINI_API_KEY
ENV VITE_SUPABASE_URL=$_VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$_VITE_SUPABASE_ANON_KEY
ENV VITE_UNIAUTH_BASE_URL=$_VITE_UNIAUTH_BASE_URL
ENV VITE_UNIAUTH_CLIENT_ID=$_VITE_UNIAUTH_CLIENT_ID
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

# Stage 3: Production
FROM node:20-slim
WORKDIR /app

# 复制产物到统一的工作目录
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=frontend-builder /app/client/dist ./client/dist

# 设置生产环境变量
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# 在 server 目录下运行，这样 ../../client/dist 的路径引用就能生效
WORKDIR /app/server
CMD ["node", "dist/index.js"]
