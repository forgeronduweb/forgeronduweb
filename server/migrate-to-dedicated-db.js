import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function migrateToNewDatabase() {
  console.log('🔄 Migration vers une base de données dédiée...\n');

  try {
    // URI actuelle (base "test")
    const currentUri = process.env.MONGODB_URI;
    
    // Créer l'URI pour la nouvelle base
    const uriParts = currentUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/?(.*)?/);
    const [, username, password, cluster, dbAndParams] = uriParts;
    const [, params] = dbAndParams ? dbAndParams.split('?') : ['', ''];
    
    const oldUri = currentUri; // Base "test"
    const newUri = `mongodb+srv://${username}:${password}@${cluster}/forgeron_du_web${params ? '?' + params : '?retryWrites=true&w=majority'}`;

    console.log('📊 Migration de "test" vers "forgeron_du_web"');
    console.log('');

    // Connexion à l'ancienne base
    console.log('🔗 Connexion à l\'ancienne base...');
    const oldConnection = await mongoose.createConnection(oldUri);
    console.log('✅ Connecté à:', oldConnection.name);

    // Connexion à la nouvelle base
    console.log('🔗 Connexion à la nouvelle base...');
    const newConnection = await mongoose.createConnection(newUri);
    console.log('✅ Connecté à:', newConnection.name);
    console.log('');

    // Collections à migrer (spécifiques à votre projet)
    const collectionsToMigrate = ['messages', 'projects', 'skills', 'articles', 'migrations'];

    for (const collectionName of collectionsToMigrate) {
      console.log(`📦 Migration de la collection "${collectionName}"...`);
      
      try {
        // Vérifier si la collection existe dans l'ancienne base
        const oldCollections = await oldConnection.db.listCollections({ name: collectionName }).toArray();
        
        if (oldCollections.length === 0) {
          console.log(`   ⏭️  Collection "${collectionName}" n'existe pas dans l'ancienne base`);
          continue;
        }

        // Récupérer les données
        const oldCollection = oldConnection.collection(collectionName);
        const documents = await oldCollection.find({}).toArray();
        
        if (documents.length === 0) {
          console.log(`   📭 Collection "${collectionName}" est vide`);
          continue;
        }

        // Vérifier si la collection existe déjà dans la nouvelle base
        const newCollection = newConnection.collection(collectionName);
        const existingCount = await newCollection.countDocuments();
        
        if (existingCount > 0) {
          console.log(`   ⚠️  Collection "${collectionName}" existe déjà dans la nouvelle base (${existingCount} documents)`);
          console.log(`   💡 Voulez-vous la remplacer ? (Sautée pour l'instant)`);
          continue;
        }

        // Insérer dans la nouvelle base
        await newCollection.insertMany(documents);
        console.log(`   ✅ ${documents.length} documents migrés`);

      } catch (error) {
        console.error(`   ❌ Erreur lors de la migration de "${collectionName}":`, error.message);
      }
    }

    console.log('\n🎯 Migration terminée !');
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('1. Mettez à jour votre .env avec la nouvelle URI:');
    console.log(`   MONGODB_URI=${newUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    console.log('2. Redémarrez votre serveur');
    console.log('3. Vérifiez que tout fonctionne correctement');
    console.log('4. Supprimez les anciennes données de la base "test" si nécessaire');

    await oldConnection.close();
    await newConnection.close();

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
  }
}

migrateToNewDatabase();
