FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY . .

RUN npm run build -w apps/api

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV SYSTEM_MANIFEST_PATH=/app/system.manifest.json

COPY --from=build /app/system.manifest.json ./system.manifest.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api ./apps/api

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
