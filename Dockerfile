
# ==========================================
# ETAPE 1 : Compilation React + Vite
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Compiler l'application React
RUN npm run build

# ==========================================
# ETAPE 2 : Serveur web Nginx
# ==========================================
FROM nginx:alpine

# Copier les fichiers compilés
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Exposer le port HTTP
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
