FROM node:20-bookworm-slim AS deps

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000 \
  && npm ci --no-audit --no-fund \
  && test -x node_modules/.bin/nest

FROM deps AS build

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY public ./public
COPY typings ./typings
RUN npm run build && npm prune --omit=dev

FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN groupadd --system nodejs && useradd --system --gid nodejs nest

COPY --from=build --chown=nest:nodejs /usr/src/app/package.json /usr/src/app/package-lock.json ./
COPY --from=build --chown=nest:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nest:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nest:nodejs /usr/src/app/public ./public

USER nest

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health/live').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "dist/main"]
