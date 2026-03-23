# Utilise l'image officielle Node.js
FROM node:18

# Crée un dossier dans le container
WORKDIR /app

# Copie package.json et installe les dépendances
COPY package*.json ./
RUN npm install

# Copie tout le code du backend
COPY . .

# Expose le port utilisé par ton backend
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
