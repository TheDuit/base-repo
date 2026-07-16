FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY system.manifest.json system.manifest.json

RUN npm ci

COPY . .

RUN npm run build -w apps/web

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/apps/web/out /usr/share/nginx/html

EXPOSE 80
