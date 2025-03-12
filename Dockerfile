FROM node:22-slim AS build_image

# Needed for prisma setup
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Fake env
ENV DO_ENDPOINT a.com
ENV DO_REGION us-east1
ENV DO_BUCKET crm
ENV DO_ACCESS_KEY_ID fakeid
ENV DO_ACCESS_KEY_SECRET fake-key

RUN corepack enable && \
    rm -f /usr/local/bin/pnpm && \
    rm -f /usr/local/bin/pnpx && \
    npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
# COPY .env .env.local ./
RUN pnpm install

COPY . .
# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
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