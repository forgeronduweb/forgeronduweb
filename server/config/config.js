import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration simple
export const config = {
  // Serveur
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',

  // Base de données
  mongoUri: process.env.MONGODB_URI,

  // CORS - URLs autorisées
  corsOrigins: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3001'],

  // Admin
  adminEmail: process.env.ADMIN_EMAIL || 'admin@forgeron.dev',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  jwtSecret: process.env.JWT_SECRET || 'jwt-secret-dev'
};

// Validation simple
export const validateConfig = () => {
  if (!config.mongoUri) {
    console.error('❌ MONGODB_URI est requis dans le fichier .env');
    return false;
  }
  return true;
};

export default config;
