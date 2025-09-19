# Forgeron du Web - Admin Panel

Panneau d'administration moderne pour gérer le portfolio Forgeron du Web.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec gestion des sessions
- **Dashboard** avec statistiques et aperçu des performances
- **Gestion des projets** - Ajout, modification, suppression
- **Gestion des compétences** - Organisation par catégories avec niveaux
- **Paramètres** - Configuration du profil, sécurité, notifications
- **Interface responsive** - Optimisée pour desktop et mobile
- **Thème sombre/clair** - Basculement automatique
- **Notifications toast** - Feedback utilisateur en temps réel

## 🛠 Technologies utilisées

- **React 19** - Framework frontend
- **Vite** - Build tool et dev server
- **React Router** - Navigation SPA
- **Tailwind CSS** - Framework CSS utilitaire
- **DaisyUI** - Composants UI prêts à l'emploi
- **Lucide React** - Icônes modernes
- **React Hook Form** - Gestion des formulaires
- **React Hot Toast** - Notifications
- **Axios** - Client HTTP

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3001](http://localhost:3001) dans votre navigateur

### Build pour la production

```bash
npm run build
```

## 🔐 Authentification

### Identifiants de test :
- **Email** : `admin@forgeron.dev`
- **Mot de passe** : `admin123`

> ⚠️ **Important** : Changez ces identifiants en production !

## 📋 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code avec ESLint

## 🏗 Structure du projet

```
admin/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── auth/         # Composants d'authentification
│   │   ├── dashboard/    # Composants du dashboard
│   │   └── layout/       # Composants de mise en page
│   ├── contexts/         # Contextes React
│   ├── pages/            # Pages principales
│   ├── App.jsx           # Composant racine
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── index.html            # Template HTML
├── package.json          # Dépendances et scripts
├── tailwind.config.js    # Configuration Tailwind
├── vite.config.js        # Configuration Vite
└── README.md            # Documentation
```

## 🎨 Personnalisation

### Thèmes
Le projet utilise DaisyUI avec support des thèmes clair/sombre. Vous pouvez personnaliser les couleurs dans `tailwind.config.js`.

### Composants
Tous les composants sont modulaires et réutilisables. Ils suivent les conventions React modernes avec hooks.

## 🔗 Intégration avec le backend

L'admin est conçu pour fonctionner avec l'API backend sur le port 5000. Assurez-vous que le serveur backend est démarré.

### Configuration API
Modifiez les URLs d'API dans les composants selon votre configuration backend.

## 📱 Responsive Design

L'interface s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : Layout complet avec sidebar
- **Tablet** : Layout adaptatif
- **Mobile** : Menu hamburger et navigation optimisée

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Serveur statique
Le dossier `dist/` contient les fichiers optimisés pour la production.

### Variables d'environnement
Créez un fichier `.env` pour la configuration :
```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=Admin - Forgeron du Web
```

## 🔧 Développement

### Ajout de nouvelles pages
1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `App.jsx`
3. Ajouter le lien dans `Sidebar.jsx`

### Ajout de nouvelles fonctionnalités
1. Créer les composants nécessaires
2. Ajouter les contextes si besoin
3. Intégrer avec l'API backend
4. Ajouter les tests

## 📝 TODO

- [ ] Tests unitaires avec Vitest
- [ ] Tests d'intégration
- [ ] Gestion des erreurs avancée
- [ ] Optimisation des performances
- [ ] PWA (Progressive Web App)
- [ ] Internationalisation (i18n)
- [ ] Mode hors ligne
- [ ] Upload de fichiers
- [ ] Éditeur WYSIWYG

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
