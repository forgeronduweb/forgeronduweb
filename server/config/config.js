import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration centralisée de l'application
export const config = {
  // Serveur
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  },

  // Base de données
  database: {
    mongoUri: process.env.MONGODB_URI,
  },

  // URLs des applications
  urls: {
    client: process.env.CLIENT_URL || 'http://localhost:5174',
    admin: process.env.ADMIN_URL || 'http://localhost:3001',
    corsOrigins: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : [
          process.env.CLIENT_URL || 'http://localhost:5174',
          'http://localhost:5173', // Fallback dev
          process.env.ADMIN_URL || 'http://localhost:3001'
        ]
  },

  // Authentification
  auth: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@forgeron.dev',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
    sessionSecret: process.env.SESSION_SECRET || 'default-session-secret'
  },

  // Upload de fichiers
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
    maxFiles: parseInt(process.env.UPLOAD_MAX_FILES) || 4,
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES 
      ? process.env.UPLOAD_ALLOWED_TYPES.split(',')
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },

  // Coordonnées et informations personnelles
  contact: {
    email: process.env.CONTACT_EMAIL || 'contact@forgeron.dev',
    phone: process.env.CONTACT_PHONE || '+33 6 12 34 56 78',
    address: process.env.CONTACT_ADDRESS || '123 Rue du Développeur, 75001 Paris, France'
  },

  // Réseaux sociaux
  social: {
    github: process.env.SOCIAL_GITHUB || 'https://github.com/votre-username',
    linkedin: process.env.SOCIAL_LINKEDIN || 'https://linkedin.com/in/votre-profil',
    twitter: process.env.SOCIAL_TWITTER || 'https://twitter.com/votre-username'
  },

  // Informations professionnelles
  developer: {
    name: process.env.DEVELOPER_NAME || 'Votre Nom',
    title: process.env.DEVELOPER_TITLE || 'Développeur Full Stack',
    company: process.env.COMPANY_NAME || 'Forgeron du Web'
  },

  // Configuration email (optionnel)
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};

// Validation des variables essentielles
export const validateConfig = () => {
  const errors = [];

  if (!config.database.mongoUri) {
    errors.push('MONGODB_URI est requis');
  }

  if (config.server.nodeEnv === 'production') {
    if (config.auth.jwtSecret === 'default-jwt-secret-change-in-production') {
      errors.push('JWT_SECRET doit être défini en production');
    }
    if (config.auth.sessionSecret === 'default-session-secret') {
      errors.push('SESSION_SECRET doit être défini en production');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Erreurs de configuration:');
    errors.forEach(error => console.error(`   - ${error}`));
    return false;
  }

  return true;
};

export default config;
