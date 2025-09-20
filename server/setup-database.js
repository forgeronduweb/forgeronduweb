import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function setupDatabase() {
  console.log('🔧 Configuration de la base de données MongoDB Atlas...\n');

  try {
    // Vérifier l'URI actuelle
    const currentUri = process.env.MONGODB_URI;
    console.log('📋 URI actuelle:', currentUri?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    // Extraire les informations de l'URI
    const uriParts = currentUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/?(.*)?/);
    
    if (!uriParts) {
      console.error('❌ Format d\'URI MongoDB invalide');
      return;
    }

    const [, username, password, cluster, dbAndParams] = uriParts;
    const [currentDb, params] = dbAndParams ? dbAndParams.split('?') : ['', ''];
    
    console.log('👤 Utilisateur:', username);
    console.log('🌐 Cluster:', cluster);
    console.log('📊 Base actuelle:', currentDb || 'test (par défaut)');
    console.log('');

    // Proposer la nouvelle URI
    const newDbName = 'forgeron_du_web';
    const newUri = `mongodb+srv://${username}:${password}@${cluster}/${newDbName}${params ? '?' + params : '?retryWrites=true&w=majority'}`;
    
    console.log('✨ URI recommandée pour votre projet:');
    console.log('MONGODB_URI=' + newUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    console.log('');

    // Tester la connexion avec la nouvelle base
    console.log('🧪 Test de connexion avec la nouvelle base...');
    await mongoose.connect(newUri);
    
    console.log('✅ Connexion réussie !');
    console.log('📊 Nouvelle base:', mongoose.connection.name);
    console.log('🌐 Cluster:', mongoose.connection.host);
    
    // Vérifier les collections existantes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections dans la nouvelle base:', collections.length);
    
    if (collections.length === 0) {
      console.log('✨ Base vide - parfait pour un nouveau projet !');
    } else {
      console.log('📁 Collections existantes:');
      collections.forEach(col => console.log('  -', col.name));
    }

    await mongoose.disconnect();
    
    console.log('\n🎯 Actions recommandées:');
    console.log('1. Mettez à jour votre fichier .env avec la nouvelle URI');
    console.log('2. Redémarrez votre serveur');
    console.log('3. Les migrations créeront automatiquement les données dans la nouvelle base');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

setupDatabase();
