# Étape 1 : Image Node pour le développement Vite
FROM node:22
# FROM node:18-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json en premier pour profiter du cache Docker
COPY front-end/package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY front-end/ ./

# Exposer le port utilisé par Vite (par défaut 5173)
EXPOSE 1003

# Commande pour démarrer Vite en mode dev
CMD ["npm", "run", "dev"]
