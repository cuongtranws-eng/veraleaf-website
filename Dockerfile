# VeraLeaf website + Payload CMS — production image
# Build:  docker build --build-arg NEXT_PUBLIC_SERVER_URL=https://veraleaf.com.vn -t veraleaf .
# (Usually built through docker-compose.yml.)

FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No database is needed at build time: CMS pages are rendered on request.
RUN npm run build

FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000
COPY --from=build --chown=node:node /app ./
RUN mkdir -p media && chown node:node media
USER node
EXPOSE 3000
# Apply pending database migrations, then start the server.
CMD ["sh", "-c", "npm run migrate && npm run start"]
