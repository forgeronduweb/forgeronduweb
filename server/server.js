import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de sécurité
app.use(helmet());

// Configuration CORS pour permettre les requêtes du client React
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use(morgan('combined'));

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Forgeron du Web',
    version: '1.0.0',
    status: 'active'
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API
app.use('/api/v1', (req, res, next) => {
  // Middleware pour toutes les routes API
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

// Route pour les projets (exemple)
app.get('/api/v1/projects', (req, res) => {
  res.json({
    message: 'Liste des projets',
    projects: [
      {
        id: 1,
        title: 'Projet Portfolio',
        description: 'Site portfolio personnel',
        technologies: ['React', 'Node.js', 'Express'],
        status: 'En développement'
      }
    ]
  });
});

// Route pour les compétences (exemple)
app.get('/api/v1/skills', (req, res) => {
  res.json({
    message: 'Mes compétences',
    skills: {
      frontend: ['React', 'Vue.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
      backend: ['Node.js', 'Express', 'Python', 'PHP'],
      database: ['MongoDB', 'MySQL', 'PostgreSQL'],
      tools: ['Git', 'Docker', 'Webpack', 'Vite']
    }
  });
});

// Route pour le contact (exemple)
app.post('/api/v1/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validation basique
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Tous les champs sont requis',
      required: ['name', 'email', 'message']
    });
  }
  
  // Ici vous pourriez ajouter la logique pour envoyer l'email
  console.log('Nouveau message de contact:', { name, email, message });
  
  res.json({
    message: 'Message envoyé avec succès',
    data: { name, email }
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  
  res.status(error.status || 500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});
