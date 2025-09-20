import { BaseMigration } from './Migration.js';
import Message from '../models/Message.js';

export class AddMessageFields extends BaseMigration {
  constructor() {
    super('002_add_message_fields', '1.1.0');
  }

  async up() {
    console.log('🚀 Exécution de la migration : Ajout de champs aux messages');

    // Ajouter des champs manquants aux messages existants
    await Message.updateMany(
      { subject: { $exists: false } },
      { 
        $set: { 
          subject: 'Message de contact',
          priority: 'medium',
          readAt: null,
          userAgent: '',
          ipAddress: ''
        }
      }
    );

    // Créer des index supplémentaires pour les nouveaux champs
    await Message.collection.createIndex({ subject: 1 });
    await Message.collection.createIndex({ priority: 1 });
    await Message.collection.createIndex({ readAt: 1 });

    console.log('✅ Migration 002_add_message_fields terminée');
  }

  async down() {
    console.log('🔄 Annulation de la migration : Suppression des champs de messages');

    // Supprimer les champs ajoutés
    await Message.updateMany(
      {},
      { 
        $unset: { 
          subject: '',
          priority: '',
          readAt: '',
          userAgent: '',
          ipAddress: ''
        }
      }
    );

    console.log('✅ Migration 002_add_message_fields annulée');
  }
}
