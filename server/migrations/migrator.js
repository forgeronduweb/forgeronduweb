import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { Migration } from './Migration.js';

// Importer toutes les migrations
import { InitialSetup } from './001_initial_setup.js';
import { AddMessageFields } from './002_add_message_fields.js';

class Migrator {
  constructor() {
    this.migrations = [
      new InitialSetup(),
      new AddMessageFields()
    ];
  }

  async connect() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.database.mongoUri);
      console.log('🔗 Connexion à MongoDB établie pour les migrations');
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }

  async runMigrations() {
    console.log('🚀 Démarrage des migrations...\n');

    let executedCount = 0;

    for (const migration of this.migrations) {
      const isExecuted = await migration.isExecuted();
      
      if (!isExecuted) {
        console.log(`📦 Exécution de la migration: ${migration.name}`);
        try {
          await migration.up();
          await migration.markAsExecuted();
          executedCount++;
          console.log(`✅ Migration ${migration.name} terminée avec succès\n`);
        } catch (error) {
          console.error(`❌ Erreur lors de la migration ${migration.name}:`, error.message);
          throw error;
        }
      } else {
        console.log(`⏭️  Migration ${migration.name} déjà exécutée`);
      }
    }

    if (executedCount === 0) {
      console.log('✨ Toutes les migrations sont déjà à jour');
    } else {
      console.log(`🎉 ${executedCount} migration(s) exécutée(s) avec succès`);
    }
  }

  async rollbackLastMigration() {
    console.log('🔄 Rollback de la dernière migration...\n');

    // Trouver la dernière migration exécutée
    const lastMigration = await Migration.findOne().sort({ executedAt: -1 });
    
    if (!lastMigration) {
      console.log('ℹ️  Aucune migration à annuler');
      return;
    }

    // Trouver la migration correspondante
    const migrationToRollback = this.migrations.find(m => m.name === lastMigration.name);
    
    if (!migrationToRollback) {
      console.error(`❌ Migration ${lastMigration.name} non trouvée dans le code`);
      return;
    }

    try {
      console.log(`📦 Annulation de la migration: ${migrationToRollback.name}`);
      await migrationToRollback.down();
      await migrationToRollback.markAsNotExecuted();
      console.log(`✅ Migration ${migrationToRollback.name} annulée avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'annulation de ${migrationToRollback.name}:`, error.message);
      throw error;
    }
  }

  async getMigrationStatus() {
    console.log('📊 État des migrations:\n');

    const executedMigrations = await Migration.find().sort({ executedAt: 1 });
    const executedNames = executedMigrations.map(m => m.name);

    for (const migration of this.migrations) {
      const isExecuted = executedNames.includes(migration.name);
      const status = isExecuted ? '✅ Exécutée' : '⏸️  En attente';
      const date = isExecuted 
        ? executedMigrations.find(m => m.name === migration.name).executedAt.toISOString()
        : '';
      
      console.log(`${status} - ${migration.name} (v${migration.version}) ${date}`);
    }

    console.log(`\n📈 Total: ${executedNames.length}/${this.migrations.length} migrations exécutées`);
  }

  async resetMigrations() {
    console.log('🗑️  Suppression de tous les enregistrements de migrations...');
    
    const result = await Migration.deleteMany({});
    console.log(`✅ ${result.deletedCount} enregistrement(s) de migration supprimé(s)`);
    console.log('⚠️  Note: Les données ne sont pas supprimées, seuls les enregistrements de migrations');
  }
}

// Fonction utilitaire pour exécuter les migrations
export async function runMigrations() {
  const migrator = new Migrator();
  
  try {
    await migrator.connect();
    await migrator.runMigrations();
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  } finally {
    await migrator.disconnect();
  }
}

// CLI pour les migrations
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const migrator = new Migrator();

  try {
    await migrator.connect();

    switch (command) {
      case 'up':
      case 'migrate':
        await migrator.runMigrations();
        break;
      
      case 'down':
      case 'rollback':
        await migrator.rollbackLastMigration();
        break;
      
      case 'status':
        await migrator.getMigrationStatus();
        break;
      
      case 'reset':
        await migrator.resetMigrations();
        break;
      
      default:
        console.log(`
🔧 Gestionnaire de migrations Forgeron du Web

Commandes disponibles:
  up, migrate    - Exécuter toutes les migrations en attente
  down, rollback - Annuler la dernière migration
  status         - Afficher l'état des migrations
  reset          - Supprimer tous les enregistrements de migrations

Exemples:
  node migrations/migrator.js migrate
  node migrations/migrator.js status
  node migrations/migrator.js rollback
        `);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await migrator.disconnect();
  }
}

export default Migrator;
