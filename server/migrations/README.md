# 🔄 Système de Migration - Forgeron du Web

Ce système de migration permet de gérer les changements de structure et de données de votre base de données MongoDB de manière versionnée et contrôlée.

## 📁 Structure des migrations

```
migrations/
├── Migration.js              # Classe de base et modèle de tracking
├── migrator.js              # Gestionnaire principal des migrations
├── 001_initial_setup.js     # Migration initiale
├── 002_add_message_fields.js # Ajout de champs aux messages
└── README.md               # Ce fichier
```

## 🚀 Utilisation

### Commandes disponibles

```bash
# Exécuter toutes les migrations en attente
npm run migrate

# Afficher l'état des migrations
npm run migrate:status

# Annuler la dernière migration
npm run migrate:rollback

# Supprimer tous les enregistrements de migrations (attention !)
npm run migrate:reset
```

### Exécution automatique

Les migrations s'exécutent **automatiquement** au démarrage du serveur en mode développement.

## 📋 Migrations disponibles

### 001_initial_setup (v1.0.0)
**Objectif :** Configuration initiale de la base de données

**Actions :**
- ✅ Création des index pour optimiser les performances
- ✅ Insertion de données de démonstration (projets, compétences)
- ✅ Configuration des collections principales

**Données créées :**
- 3 projets de démonstration
- 16 compétences dans différentes catégories
- Index optimisés pour les requêtes

### 002_add_message_fields (v1.1.0)
**Objectif :** Amélioration du système de messages

**Actions :**
- ✅ Ajout des champs `subject`, `priority`, `readAt`
- ✅ Ajout des champs `userAgent`, `ipAddress`
- ✅ Création d'index pour les nouveaux champs
- ✅ Mise à jour des messages existants

## 🛠️ Créer une nouvelle migration

### 1. Créer le fichier de migration

```bash
# Nommage : 003_description_changement.js
touch migrations/003_add_user_roles.js
```

### 2. Structure de base

```javascript
import { BaseMigration } from './Migration.js';
import MonModel from '../models/MonModel.js';

export class AddUserRoles extends BaseMigration {
  constructor() {
    super('003_add_user_roles', '1.2.0');
  }

  async up() {
    console.log('🚀 Exécution de la migration : Ajout des rôles utilisateur');
    
    // Votre code de migration ici
    await MonModel.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    console.log('✅ Migration 003_add_user_roles terminée');
  }

  async down() {
    console.log('🔄 Annulation de la migration : Suppression des rôles');
    
    // Code pour annuler la migration
    await MonModel.updateMany(
      {},
      { $unset: { role: '' } }
    );

    console.log('✅ Migration 003_add_user_roles annulée');
  }
}
```

### 3. Ajouter au migrator.js

```javascript
import { AddUserRoles } from './003_add_user_roles.js';

// Dans le constructeur de Migrator
this.migrations = [
  new InitialSetup(),
  new AddMessageFields(),
  new AddUserRoles() // Nouvelle migration
];
```

## 📊 Suivi des migrations

### Collection `migrations`

Le système crée automatiquement une collection `migrations` qui track :

```javascript
{
  name: "001_initial_setup",
  executedAt: "2024-01-20T10:30:00.000Z",
  version: "1.0.0"
}
```

### Vérifier l'état

```bash
npm run migrate:status
```

Sortie exemple :
```
📊 État des migrations:

✅ Exécutée - 001_initial_setup (v1.0.0) 2024-01-20T10:30:00.000Z
✅ Exécutée - 002_add_message_fields (v1.1.0) 2024-01-20T10:31:15.000Z
⏸️  En attente - 003_add_user_roles (v1.2.0)

📈 Total: 2/3 migrations exécutées
```

## ⚠️ Bonnes pratiques

### ✅ À faire

- **Tester les migrations** sur une copie de la base avant production
- **Créer des sauvegardes** avant les migrations importantes
- **Nommer clairement** les migrations (numéro + description)
- **Implémenter `down()`** pour pouvoir annuler si nécessaire
- **Versionner** les migrations avec le code

### ❌ À éviter

- **Modifier** une migration déjà exécutée en production
- **Supprimer** des migrations déjà déployées
- **Oublier** d'ajouter la migration au `migrator.js`
- **Faire** des changements destructifs sans sauvegarde

## 🔧 Dépannage

### Migration échoue

```bash
# Voir les détails de l'erreur
npm run migrate

# Vérifier l'état
npm run migrate:status

# Annuler si nécessaire
npm run migrate:rollback
```

### Reset complet (développement uniquement)

```bash
# ⚠️ ATTENTION : Supprime tous les enregistrements de migrations
npm run migrate:reset

# Puis re-exécuter toutes les migrations
npm run migrate
```

### Base de données corrompue

1. **Sauvegarder** les données importantes
2. **Supprimer** la collection `migrations`
3. **Re-exécuter** toutes les migrations
4. **Vérifier** l'intégrité des données

## 📈 Évolution du schéma

### Versioning

- **v1.0.0** : Configuration initiale
- **v1.1.0** : Amélioration des messages
- **v1.2.0** : Ajout des rôles utilisateur (exemple)

### Planification

Les prochaines migrations peuvent inclure :
- Système d'authentification avancé
- Gestion des fichiers et médias
- Optimisations de performance
- Nouvelles fonctionnalités métier

## 🚨 Production

### Déploiement

1. **Tester** les migrations en staging
2. **Sauvegarder** la base de production
3. **Exécuter** manuellement : `npm run migrate`
4. **Vérifier** l'état : `npm run migrate:status`
5. **Valider** le fonctionnement de l'application

### Rollback en production

```bash
# Annuler la dernière migration
npm run migrate:rollback

# Vérifier l'état
npm run migrate:status
```

---

💡 **Astuce :** Les migrations sont votre historique de changements de base de données. Traitez-les comme du code : versionnez, testez, et documentez !
