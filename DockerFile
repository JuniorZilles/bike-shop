# ---------- Base ----------

FROM node AS base

WORKDIR /app

FROM base AS builder

COPY package*.json tsconfig.json tsconfig.build.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production

# ---------- Release ----------
FROM base AS release

USER node

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]