# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# Stage 2: Development
FROM node:20-alpine AS development
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev"]

# Stage 3: Builder (프로덕션 빌드용)
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 빌드
RUN npm run build

# Stage 4: Production
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production

# 빌드 결과물 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# 포트 노출
EXPOSE 3000

# 프로덕션 서버 실행
CMD ["npm", "start"]
