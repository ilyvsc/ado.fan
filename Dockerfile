FROM node:24.5.0-alpine AS base
RUN npm install -g pnpm
WORKDIR /workspace

# Development stage
FROM base AS development
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY prisma ./prisma/
RUN pnpm exec prisma generate

CMD ["pnpm", "run", "dev"]

# Builder stage
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod

ENV DATABASE_URL="file:./dev.db"

COPY prisma ./prisma/
RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma generate && pnpm run db:deploy && pnpm run start"]
