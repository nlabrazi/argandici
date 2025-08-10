# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:20-bullseye-slim

##################################
# 1) BASE (deps + prisma gen)    #
##################################
FROM ${NODE_IMAGE} AS base
WORKDIR /app

# Installer curl et les outils build (pour Prisma)
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl build-essential python3 \
  && rm -rf /var/lib/apt/lists/*

# Copier package.json & prisma schema
COPY package*.json prisma/ ./
RUN npm ci \
  && npx prisma generate

# Copier le reste de l'app
COPY . .

##################################
# 2) DEV (hot-reload Nuxt)       #
##################################
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npx", "nuxt", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

##################################
# 3) BUILD (compilation prod)    #
##################################
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

##################################
# 4) PROD (image finale)         #
##################################
FROM ${NODE_IMAGE} AS prod
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npx", "nuxt", "start", "--hostname", "0.0.0.0", "--port", "3000"]
