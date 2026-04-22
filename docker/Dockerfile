# ─── Build stage ────────────────────────────────────────────────────────────
# public.ecr.aws mirror: same images as Docker Hub, no auth, no rate limits
FROM public.ecr.aws/docker/library/node:22-alpine AS builder

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ─── Production stage ────────────────────────────────────────────────────────
FROM public.ecr.aws/docker/library/node:22-alpine AS production

RUN apk upgrade --no-cache

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

ARG MCP_PORT=3000
EXPOSE $MCP_PORT

USER node

CMD ["node", "dist/index.js"]
