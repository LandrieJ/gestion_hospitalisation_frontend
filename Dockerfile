
# ETAPE 1 : Compilation React + Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# ETAPE 2 : Serveur web Nginx
FROM nginx:alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/

# Configuration NGINX pour React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
