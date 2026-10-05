FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/config/package.json packages/config/package.json
RUN npm ci
COPY apps/api apps/api
COPY packages packages
RUN npm run prisma:generate --workspace=@veonix/api && npm run build --workspace=@veonix/api

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/config/package.json packages/config/package.json
RUN npm ci --omit=dev
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/prisma apps/api/prisma
COPY --from=build /app/node_modules/.prisma node_modules/.prisma
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/api/prisma/schema.prisma && node apps/api/dist/server.js"]
