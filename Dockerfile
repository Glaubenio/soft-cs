FROM node:22-slim AS deps
RUN corepack enable && \
    rm -f /usr/local/bin/pnpm && \
    rm -f /usr/local/bin/pnpx && \
    npm install -g pnpm

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
# COPY .env .env.local ./
RUN pnpm install

FROM node:22-slim AS build_image
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
#COPY --from=deps /app/package-lock.json ./
COPY --from=deps /app/pnpm-lock.yaml ./
COPY . .
# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    npm install -g pnpm && \
    pnpm run build

FROM node:22-slim AS production
ENV NODE_ENV production


RUN addgroup --system nodejs && \
    adduser --system --ingroup nodejs nextjs

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev 

WORKDIR /app
#COPY --from=build_image --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=build_image --chown=nextjs:nodejs /app/package.json ./
COPY --from=build_image --chown=nextjs:nodejs /app/pnpm-lock.yaml ./
COPY --from=build_image --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build_image --chown=nextjs:nodejs /app/public ./public
COPY --from=build_image --chown=nextjs:nodejs /app/.next ./.next

# Switch to root to install pnpm
USER root

# Install pnpm globally
RUN npm install -g pnpm

# Switch back to nextjs user
USER nextjs
EXPOSE 3000

# Check if pnpm is installed
RUN pnpm --version || echo "pnpm not found"

# Use npx to run pnpm
CMD [ "npx", "pnpm", "start" ]