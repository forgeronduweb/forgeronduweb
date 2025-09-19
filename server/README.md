# Forgeron du Web - Backend Server

Backend Node.js/Express pour le portfolio Forgeron du Web.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Modifier le fichier .env selon vos besoins
```

3. Démarrer le serveur en mode développement :
```bash
npm run dev
```

4. Démarrer le serveur en mode production :
```bash
npm start
```

## 📋 Scripts disponibles

- `npm start` : Démarre le serveur en mode production
- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm test` : Lance les tests (à implémenter)

## 🛠 API Endpoints

### Routes principales

- `GET /` : Page d'accueil de l'API
- `GET /health` : Vérification de l'état du serveur

### Routes API (v1)

- `GET /api/v1/projects` : Liste des projets
- `GET /api/v1/skills` : Liste des compétences
- `POST /api/v1/contact` : Formulaire de contact

## 🔧 Configuration

Le serveur utilise les variables d'environnement suivantes :

- `PORT` : Port du serveur (défaut: 5000)
- `NODE_ENV` : Environnement (development/production)
- `CLIENT_URL` : URL du client pour CORS (défaut: http://localhost:5173)

## 🏗 Architecture

```
server/
├── server.js          # Point d'entrée principal
├── package.json       # Dépendances et scripts
├── .env              # Variables d'environnement
├── .gitignore        # Fichiers ignorés par Git
└── README.md         # Documentation
```

## 🔐 Sécurité

Le serveur inclut plusieurs middlewares de sécurité :
- **Helmet** : Protection contre les vulnérabilités communes
- **CORS** : Configuration des origines autorisées
- **Morgan** : Logging des requêtes
- **Validation** : Validation des données d'entrée

## 🚀 Déploiement

Pour déployer en production :

1. Configurer les variables d'environnement de production
2. Installer les dépendances : `npm ci --only=production`
3. Démarrer le serveur : `npm start`

## 📝 TODO

- [ ] Ajouter une base de données
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter des tests unitaires
- [ ] Configurer le logging avancé
- [ ] Ajouter la validation avec Joi/Yup
- [ ] Implémenter le rate limiting
