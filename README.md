# 🚗 EcoRide — Backend API 

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-secure-000000?style=for-the-badge&logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
 
API REST sécurisée permettant la gestion d’un service de trajets écoresponsables entre passagers et conducteurs.

---

## 📌 Sommaire
- [🚗 EcoRide — Backend API](#-ecoride--backend-api)
  - [📌 Sommaire](#-sommaire)
  - [🚀 Présentation du projet](#-présentation-du-projet)
  - [🛠 Technologies utilisées](#-technologies-utilisées)
  - [📥 Installation](#-installation)
  - [🔐 Configuration des variables d’environnement](#-configuration-des-variables-denvironnement)
  - [▶️ Lancement du projet](#️-lancement-du-projet)
    - [Mode développement](#mode-développement)
    - [Mode production](#mode-production)
  - [🐳 Lancement avec Docker](#-lancement-avec-docker)
  - [📁 Structure du projet](#-structure-du-projet)
  - [🏗️ Architecture du backend EcoRide](#️-architecture-du-backend-ecoride)
    - [🔍 Détails des composants](#-détails-des-composants)
  - [🗂️ Modèles Mongoose (extraits)](#️-modèles-mongoose-extraits)
    - [👤 Modèle User](#-modèle-user)
    - [🚗 Modèle Vehicle](#-modèle-vehicle)
    - [🛣️ Modèle Ride](#️-modèle-ride)
    - [⭐ Modèle Review](#-modèle-review)
  - [📚 Documentation API](#-documentation-api)
    - [🔑 Authentification](#-authentification)
    - [👤 Utilisateurs](#-utilisateurs)
    - [🚗 Véhicules](#-véhicules)
    - [🛣 Trajets](#-trajets)
    - [⭐ Avis](#-avis)
  - [🛣️ Routes détaillées (avec paramètres)](#️-routes-détaillées-avec-paramètres)
    - [🔐 Authentification](#-authentification-1)
    - [👤 Utilisateurs](#-utilisateurs-1)
    - [🚗 Véhicules](#-véhicules-1)
    - [🛣️ Trajets](#️-trajets)
    - [⭐ Avis](#-avis-1)
  - [🔄 Workflow métier EcoRide](#-workflow-métier-ecoride)
  - [🛣️ Workflow métier EcoRide (Diagramme)](#️-workflow-métier-ecoride-diagramme)
    - [🔍 États possibles d’un trajet](#-états-possibles-dun-trajet)
  - [🧠 Décisions techniques](#-décisions-techniques)
    - [🟩 Choix du stack Node.js + Express](#-choix-du-stack-nodejs--express)
    - [🟩 Utilisation de MongoDB + Mongoose](#-utilisation-de-mongodb--mongoose)
    - [🟩 Authentification via JWT](#-authentification-via-jwt)
    - [🟩 Architecture MVC](#-architecture-mvc)
    - [🟩 Utilisation de Docker](#-utilisation-de-docker)
    - [🟩 Gestion des erreurs centralisée](#-gestion-des-erreurs-centralisée)
  - [🔐 Sécurité](#-sécurité)
  - [🧪 Tests](#-tests)
  - [🧭 Bonnes pratiques appliquées](#-bonnes-pratiques-appliquées)
  - [👤 Auteur](#-auteur)

---

## 🚀 Présentation du projet

EcoRide est une application web permettant de mettre en relation des passagers et des conducteurs pour organiser des trajets écoresponsables.

Ce backend fournit :
- une API REST sécurisée,
- une gestion des utilisateurs (passagers & conducteurs),
- une gestion des véhicules,
- une gestion des trajets,
- un système de réservation,
- un workflow métier complet (réservation → validation → trajet → avis),
- une authentification sécurisée via JWT,
- une base de données MongoDB.

Ce projet a été réalisé dans le cadre du **Titre Professionnel Développeur Web & Web Mobile**.

---

## 🛠 Technologies utilisées

- **Node.js 18**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Token)**
- **bcrypt**
- **Docker & Docker Compose**
- **Nodemon (dev)**

---

## 📥 Installation

Clonez le projet :

```bash
git clone https://github.com/votre-repo/ecoride.git
cd ecoride/2-Backend
npm install
```

---

## 🔐 Configuration des variables d’environnement

Créez un fichier `.env` à la racine du backend :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecoride
JWT_SECRET=supersecret
```

---

## ▶️ Lancement du projet

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur :

```
http://localhost:5000
```

---

## 🐳 Lancement avec Docker

Assurez-vous d’être à la racine du projet (où se trouve `docker-compose.yml`) :

```bash
docker compose up --build
```

Cela lance automatiquement :
- le backend,
- MongoDB,
- Mongo Express.

---

## 📁 Structure du projet

```
2-Backend/
│── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
│── server.js
│── package.json
│── Dockerfile
│── .env
│── README.md
```

---

## 🏗️ Architecture du backend EcoRide

Voici une vue d’ensemble de l’architecture technique du backend :

```
                 ┌──────────────────────────┐
                 │        Frontend          │
                 │   (React / autre)        │
                 └────────────┬─────────────┘
                              │ Requêtes HTTP
                              ▼
                 ┌──────────────────────────┐
                 │        API Backend       │
                 │     Node.js / Express    │
                 ├──────────────────────────┤
                 │  Routes / Controllers    │
                 │  Middlewares (auth, log) │
                 │  Services / Utils        │
                 └────────────┬─────────────┘
                              │ Requêtes DB
                              ▼
                 ┌──────────────────────────┐
                 │        MongoDB           │
                 │   (Mongoose Models)      │
                 └──────────────────────────┘
```
---

### 🔍 Détails des composants

- **Frontend** : interface utilisateur (non inclus dans ce README).
- **API Backend** :
  - Express gère les routes et middlewares.
  - JWT sécurise l’authentification.
  - Les contrôleurs orchestrent la logique métier.
  - Les modèles Mongoose structurent les données.
- **MongoDB** :
  - Base de données NoSQL.
  - Collections : users, vehicles, rides, reviews.

---

## 🗂️ Modèles Mongoose (extraits)

Voici les principaux modèles utilisés dans EcoRide.  
Ils structurent les données et garantissent la cohérence dans MongoDB.

---

### 👤 Modèle User

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["passenger", "driver"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
```

---

### 🚗 Modèle Vehicle

```js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  owner:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brand:      { type: String, required: true },
  model:      { type: String, required: true },
  seats:      { type: Number, required: true },
  energyType: { type: String, enum: ["electric", "hybrid", "diesel", "gasoline"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
```

---

### 🛣️ Modèle Ride

```js
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  driver:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle:     { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  start:       { type: String, required: true },
  destination: { type: String, required: true },
  date:        { type: Date, required: true },
  status:      { type: String, enum: ["pending", "validated", "in_progress", "completed"], default: "pending" },
  passenger:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
```

---

### ⭐ Modèle Review

```js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  ride:      { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
```
---

## 📚 Documentation API

### 🔑 Authentification
| Méthode | Endpoint        | Description |
|---------|------------------|-------------|
| POST    | /auth/register   | Inscription |
| POST    | /auth/login      | Connexion   |

### 👤 Utilisateurs
| Méthode | Endpoint   | Description        |
|---------|-------------|--------------------|
| GET     | /users/me   | Profil utilisateur |
| PUT     | /users/me   | Mise à jour       |

### 🚗 Véhicules
| Méthode | Endpoint     | Description         |
|---------|---------------|---------------------|
| POST    | /vehicles     | Ajouter un véhicule |
| GET     | /vehicles     | Lister les véhicules |

### 🛣 Trajets
| Méthode | Endpoint                 | Description              |
|---------|---------------------------|--------------------------|
| POST    | /rides                    | Créer un trajet         |
| GET     | /rides                    | Lister les trajets      |
| POST    | /rides/:id/reserve        | Réserver                |
| POST    | /rides/:id/validate       | Valider réservation     |
| POST    | /rides/:id/start          | Démarrer                |
| POST    | /rides/:id/end            | Terminer                |

### ⭐ Avis
| Méthode | Endpoint              | Description         |
|---------|------------------------|---------------------|
| POST    | /reviews              | Ajouter un avis     |
| GET     | /reviews/:rideId      | Avis d’un trajet    |

---

## 🛣️ Routes détaillées (avec paramètres)

Voici la liste complète des routes EcoRide, avec leurs paramètres, rôles autorisés et descriptions.

---

### 🔐 Authentification

| Méthode | Endpoint        | Corps attendu | Rôle | Description |
|---------|------------------|---------------|------|-------------|
| POST    | /auth/register   | firstname, lastname, email, password, role | public | Inscription |
| POST    | /auth/login      | email, password | public | Connexion |

---

### 👤 Utilisateurs

| Méthode | Endpoint   | Rôle | Description |
|---------|-------------|------|-------------|
| GET     | /users/me   | passenger, driver | Récupérer son profil |
| PUT     | /users/me   | passenger, driver | Modifier son profil |

---

### 🚗 Véhicules

| Méthode | Endpoint     | Corps attendu | Rôle | Description |
|---------|---------------|---------------|------|-------------|
| POST    | /vehicles     | brand, model, seats, energyType | driver | Ajouter un véhicule |
| GET     | /vehicles     | — | passenger, driver | Lister les véhicules |

---

### 🛣️ Trajets

| Méthode | Endpoint                 | Corps attendu | Rôle | Description |
|---------|---------------------------|---------------|------|-------------|
| POST    | /rides                    | start, destination, date, vehicle | driver | Créer un trajet |
| GET     | /rides                    | — | passenger, driver | Lister les trajets |
| POST    | /rides/:id/reserve        | — | passenger | Réserver un trajet |
| POST    | /rides/:id/validate       | — | driver | Valider une réservation |
| POST    | /rides/:id/start          | — | driver | Démarrer un trajet |
| POST    | /rides/:id/end            | — | driver | Terminer un trajet |

---

### ⭐ Avis

| Méthode | Endpoint              | Corps attendu | Rôle | Description |
|---------|------------------------|---------------|------|-------------|
| POST    | /reviews              | rideId, rating, comment | passenger | Ajouter un avis |
| GET     | /reviews/:rideId      | — | passenger, driver | Voir les avis d’un trajet |

---

## 🔄 Workflow métier EcoRide

1. Le conducteur crée un trajet.  
2. Le passager consulte la liste des trajets.  
3. Le passager réserve un trajet → **pending**.  
4. Le conducteur valide → **validated**.  
5. Le conducteur démarre → **in_progress**.  
6. Le conducteur termine → **completed**.  
7. Le passager laisse un avis.

---

## 🛣️ Workflow métier EcoRide (Diagramme)

```
 Passager                                      Conducteur
    │                                               │
    │ 1. Consulte les trajets disponibles           │
    │──────────────────────────────────────────────▶│
    │                                               │
    │ 2. Réserve un trajet (pending)                │
    │──────────────────────────────────────────────▶│
    │                                               │
    │                                               │ 3. Valide la réservation (validated)
    │◀──────────────────────────────────────────────│
    │                                               │
    │                                               │ 4. Démarre le trajet (in_progress)
    │◀──────────────────────────────────────────────│
    │                                               │
    │                                               │ 5. Termine le trajet (completed)
    │◀──────────────────────────────────────────────│
    │                                               │
    │ 6. Laisse un avis                             │
    │──────────────────────────────────────────────▶│
```

### 🔍 États possibles d’un trajet

| État          | Description |
|---------------|-------------|
| `pending`     | Réservation effectuée par le passager |
| `validated`   | Réservation acceptée par le conducteur |
| `in_progress` | Trajet en cours |
| `completed`   | Trajet terminé |
| `cancelled`   | (optionnel) Trajet annulé |

---

## 🧠 Décisions techniques

Cette section présente les choix techniques majeurs réalisés pour le backend EcoRide, ainsi que leurs justifications.
Ces choix ont été faits pour garantir un backend stable, maintenable et conforme aux bonnes pratiques du développement web moderne.

---

### 🟩 Choix du stack Node.js + Express
- **Pourquoi ?**  
  - Léger, rapide, adapté aux API REST.  
  - Large écosystème de packages.  
  - Facile à maintenir et à faire évoluer.  
- **Impact positif :**  
  - Développement rapide.  
  - Structure claire (routes, contrôleurs, middlewares).  
  - Parfait pour un projet pédagogique et professionnel.

---

### 🟩 Utilisation de MongoDB + Mongoose
- **Pourquoi ?**  
  - Base NoSQL flexible, idéale pour des données évolutives.  
  - Mongoose apporte une structure (schemas) et des validations.  
- **Impact positif :**  
  - Modèles simples à maintenir.  
  - Relations faciles (populate).  
  - Adapté à un système de trajets, utilisateurs, véhicules, avis.

---

### 🟩 Authentification via JWT
- **Pourquoi ?**  
  - Standard moderne pour les API stateless.  
  - Facile à intégrer avec Express.  
- **Impact positif :**  
  - Sécurisation des routes.  
  - Gestion simple des rôles (passager / conducteur).  
  - Pas de session côté serveur → plus léger.

---

### 🟩 Architecture MVC
- **Pourquoi ?**  
  - Séparation claire des responsabilités.  
  - Code plus lisible et maintenable.  
- **Impact positif :**  
  - Contrôleurs centrés sur la logique métier.  
  - Modèles dédiés aux données.  
  - Routes propres et cohérentes.

---

### 🟩 Utilisation de Docker
- **Pourquoi ?**  
  - Facilite le déploiement et la reproductibilité.  
  - Permet de lancer backend + MongoDB + Mongo Express en un seul fichier.  
- **Impact positif :**  
  - Environnement stable.  
  - Installation simplifiée pour les testeurs et le jury.  
  - Déploiement futur facilité.

---

### 🟩 Gestion des erreurs centralisée
- **Pourquoi ?**  
  - Éviter la duplication de code.  
  - Avoir des réponses API cohérentes.  
- **Impact positif :**  
  - Meilleure expérience développeur.  
  - Logs plus propres.  
  - Maintenance simplifiée.

---

## 🔐 Sécurité

- Authentification JWT  
- Hashage des mots de passe (bcrypt)  
- Middleware de protection des routes  
- Vérification des rôles (passager / conducteur)  
- Validation des données (Mongoose)

---

## 🧪 Tests

Tests disponibles :

```bash
npm test
```

Tests recommandés :
- Authentification  
- CRUD véhicules  
- CRUD trajets  
- Workflow complet d’un trajet  
- Avis  

---

## 🧭 Bonnes pratiques appliquées

- Architecture MVC  
- Routes RESTful  
- Séparation claire des responsabilités  
- Validation des données  
- Gestion des erreurs centralisée  
- Documentation complète  
- Conteneurisation Docker  

---

## 👤 Auteur

**Anicet Djedjed**  
Développeur Web & Web Mobile  
Projet réalisé dans le cadre du TP DWWM.
