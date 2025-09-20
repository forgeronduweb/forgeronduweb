# 🔧 Configuration Simple du Serveur

## 📁 Fichier .env simple

Copiez `.env.simple` vers `.env` et modifiez les valeurs :

```bash
cp .env.simple .env
```

## ⚙️ Variables essentielles

### 🔧 Développement local
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/forgeron_du_web
CORS_ORIGIN=http://localhost:5174,http://localhost:3001
ADMIN_EMAIL=admin@forgeron.dev
ADMIN_PASSWORD=admin123
JWT_SECRET=jwt-secret-dev
```

### 🚀 Production (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/forgeron_du_web
CORS_ORIGIN=https://votre-client.onrender.com,https://votre-admin.onrender.com
ADMIN_EMAIL=admin@forgeron.dev
ADMIN_PASSWORD=mot-de-passe-securise
JWT_SECRET=jwt-secret-production-long-et-securise
```

## 🎯 Configuration simplifiée

Le serveur utilise maintenant une configuration **ultra-simple** :

- ✅ **Moins de variables** - Seulement l'essentiel
- ✅ **Configuration plate** - Plus de sous-objets complexes
- ✅ **Valeurs par défaut** - Fonctionne sans configuration
- ✅ **Validation simple** - Vérifie juste MongoDB

## 🚀 Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

## 📊 Logs simplifiés

```
🚀 Serveur démarré sur le port 5000
🌐 Host: localhost
📊 Environnement: development
🔗 MongoDB: forgeron_du_web
```

## 🔍 Variables expliquées

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `development` ou `production` |
| `PORT` | Port du serveur | `5000` (local) ou `10000` (Render) |
| `MONGODB_URI` | Connexion MongoDB | `mongodb+srv://...` |
| `CORS_ORIGIN` | URLs autorisées | `http://localhost:5174,http://localhost:3001` |
| `ADMIN_EMAIL` | Email admin | `admin@forgeron.dev` |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` |
| `JWT_SECRET` | Secret pour JWT | `jwt-secret-dev` |

## ✅ Avantages

- **🎯 Simple** : Configuration minimale
- **🚀 Rapide** : Démarrage instantané
- **🔧 Flexible** : Fonctionne partout
- **📝 Clair** : Variables explicites

---

**Plus besoin de configuration complexe - juste l'essentiel !** 🎉
