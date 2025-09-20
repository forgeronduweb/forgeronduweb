import mongoose from 'mongoose';

// Schéma pour tracker les migrations
const migrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  executedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    required: true
  }
});

export const Migration = mongoose.model('Migration', migrationSchema);

// Classe de base pour les migrations
export class BaseMigration {
  constructor(name, version) {
    this.name = name;
    this.version = version;
  }

  // Méthode à implémenter dans chaque migration
  async up() {
    throw new Error('La méthode up() doit être implémentée');
  }

  // Méthode à implémenter pour annuler la migration (optionnel)
  async down() {
    throw new Error('La méthode down() doit être implémentée');
  }

  // Marquer la migration comme exécutée
  async markAsExecuted() {
    await Migration.create({
      name: this.name,
      version: this.version
    });
  }

  // Vérifier si la migration a déjà été exécutée
  async isExecuted() {
    const migration = await Migration.findOne({ name: this.name });
    return !!migration;
  }

  // Supprimer l'enregistrement de migration (pour rollback)
  async markAsNotExecuted() {
    await Migration.deleteOne({ name: this.name });
  }
}
