
# Étape 1 : Construire l'application React + Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY front-end/package*.json ./

RUN npm ci --legacy-peer-deps

COPY front-end/ ./

RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 1003

CMD ["nginx", "-g", "daemon off;"]
