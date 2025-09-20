import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from './models/Message.js';

dotenv.config();

const checkMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
    
    const messages = await Message.find().sort({createdAt: -1}).limit(5);
    console.log('📊 Derniers messages en base:');
    
    messages.forEach((msg, i) => {
      console.log(`${i+1}. ${msg.name} - "${msg.subject}" (${msg.createdAt.toLocaleString()})`);
    });
    
    console.log(`\n📈 Total messages: ${await Message.countDocuments()}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

checkMessages();
