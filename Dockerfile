FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ENV DATABASE_URL=""

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npm run db:deploy && npm run start"]
