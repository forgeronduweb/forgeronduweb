import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Charger les variables d'environnement
dotenv.config();

// Configuration centralisée
import { config, validateConfig } from './config/config.js';

// Système de migration
import { runMigrations } from './migrations/migrator.js';

// Importation des modèles
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Message from './models/Message.js';
import Article from './models/Article.js';

const app = express();
const PORT = config.server.port;

// Valider la configuration au démarrage
if (!validateConfig()) {
  console.error('❌ Configuration invalide, arrêt du serveur');
  process.exit(1);
}

// Configuration pour les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads/projects'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter seulement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
    files: config.upload.maxFiles
  }
});

// Middlewares de sécurité
app.use(helmet());

// Configuration CORS pour permettre les requêtes du client React et de l'admin
const allowedOrigins = config.urls.corsOrigins;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Logging des requêtes
app.use(morgan('combined'));

// Connexion à MongoDB Atlas avec variables d'environnement
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI non définie dans le fichier .env');
      console.error('💡 Ajoutez: MONGODB_URI=mongodb+srv://...');
      process.exit(1);
    }
    
    // Options de connexion pour MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout après 5s
      socketTimeoutMS: 45000, // Fermer les sockets après 45s d'inactivité
    };
    
    await mongoose.connect(config.database.mongoUri, options);
    
    console.log('🍃 MongoDB Atlas connecté avec succès');
    console.log(`📊 Base de données: ${mongoose.connection.name}`);
    console.log(`🌐 Cluster: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB Atlas:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Erreur d\'authentification - Vérifiez vos identifiants MongoDB');
    } else if (error.message.includes('network')) {
      console.error('🌐 Erreur réseau - Vérifiez votre connexion internet');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Timeout de connexion - Le cluster MongoDB est-il accessible ?');
    }
    
    console.error('💡 Vérifiez votre variable MONGODB_URI dans le fichier .env');
    process.exit(1);
  }
};

// Initialiser la connexion DB
connectDB();

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Forgeron du Web',
    version: '1.0.0',
    status: 'active'
  });
});

// Route de santé pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Forgeron du Web fonctionnelle',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv
  });
});

// Endpoint pour les informations publiques de configuration
app.get('/api/v1/config', (req, res) => {
  res.json({
    success: true,
    data: {
      contact: config.contact,
      social: config.social,
      developer: config.developer,
      urls: {
        client: config.urls.client,
        admin: config.urls.admin
      }
    }
  });
});

// Middleware pour toutes les routes API
app.use('/api/v1', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES PUBLIQUES =====

// Routes pour les projets (publiques)
app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Terminé' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des projets'
    });
  }
});

app.get('/api/v1/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération du projet'
    });
  }
});

// Routes pour les compétences (publiques)
app.get('/api/v1/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des compétences'
    });
  }
});

// Routes pour les articles (publiques)
app.get('/api/v1/articles', async (req, res) => {
  try {
    const { category, tag, featured, limit = 10, page = 1 } = req.query;
    
    let query = { status: 'published' };
    
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (featured === 'true') query.featured = true;
    
    const skip = (page - 1) * limit;
    
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-content'); // Exclure le contenu complet pour la liste
    
    const total = await Article.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: articles.length,
          totalArticles: total
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des articles'
    });
  }
});

app.get('/api/v1/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }
    
    // Incrémenter les vues
    article.views += 1;
    await article.save();
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'article'
    });
  }
});

// Route pour le contact
app.post('/api/v1/contact', async (req, res) => {
  try {
    const { name, email, message, phone, subject } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont requis',
        required: ['name', 'email', 'message']
      });
    }
    
    const newMessage = new Message({
      name,
      email,
      message,
      phone: phone || '',
      subject: subject || 'Message de contact',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || ''
    });
    
    const savedMessage = await newMessage.save();
    console.log('Nouveau message de contact:', savedMessage);
    
    res.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: { name, email }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'envoi du message'
    });
  }
});

// ===== ROUTES ADMIN =====

// Middleware simple d'authentification pour les routes admin
const adminAuth = (req, res, next) => {
  // Vérification basique avec les variables d'environnement
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification requis'
    });
  }
  
  // Pour la démo, on accepte le token mock
  // En production, vérifiez le JWT ici avec process.env.JWT_SECRET
  const token = authHeader.replace('Bearer ', '');
  
  if (token === 'mock-admin-token' || token.startsWith('mock-admin-token-')) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification invalide'
    });
  }
};

// Route d'upload d'images pour les projets
app.post('/api/v1/admin/upload/project-images', adminAuth, upload.array('images', 4), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image uploadée'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: `/uploads/projects/${file.filename}`,
      alt: '',
      isPrimary: false
    }));

    // Marquer la première image comme principale
    if (uploadedImages.length > 0) {
      uploadedImages[0].isPrimary = true;
    }

    res.json({
      success: true,
      data: {
        images: uploadedImages,
        count: uploadedImages.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'upload des images'
    });
  }
});

// Route de login admin
app.post('/api/v1/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier avec les variables d'environnement
  const adminEmail = config.auth.adminEmail;
  const adminPassword = config.auth.adminPassword;
  
  if (email === adminEmail && password === adminPassword) {
    // En production, générez un vrai JWT avec process.env.JWT_SECRET
    const token = `mock-admin-token-${Date.now()}`;
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          email: adminEmail,
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Identifiants incorrects'
    });
  }
});

// Routes admin pour les projets
app.get('/api/v1/admin/projects', adminAuth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des projets'
    });
  }
});

app.get('/api/v1/admin/projects/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération du projet'
    });
  }
});

app.post('/api/v1/admin/projects', adminAuth, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json({
      success: true,
      data: savedProject
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la création du projet'
    });
  }
});

app.put('/api/v1/admin/projects/:id', adminAuth, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la mise à jour du projet'
    });
  }
});

app.delete('/api/v1/admin/projects/:id', adminAuth, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression du projet'
    });
  }
});

// Routes admin pour les articles
app.get('/api/v1/admin/articles', adminAuth, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Article.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: articles.length,
          totalArticles: total
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des articles'
    });
  }
});

app.get('/api/v1/admin/articles/:id', adminAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'article'
    });
  }
});

app.post('/api/v1/admin/articles', adminAuth, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json({
      success: true,
      data: savedArticle
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la création de l\'article'
    });
  }
});

app.put('/api/v1/admin/articles/:id', adminAuth, async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la mise à jour de l\'article'
    });
  }
});

app.delete('/api/v1/admin/articles/:id', adminAuth, async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    
    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression de l\'article'
    });
  }
});

// Routes admin pour les compétences
app.get('/api/v1/admin/skills', adminAuth, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des compétences'
    });
  }
});

app.get('/api/v1/admin/skills/:id', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée'
      });
    }
    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de la compétence'
    });
  }
});

app.post('/api/v1/admin/skills', adminAuth, async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const savedSkill = await newSkill.save();
    res.status(201).json({
      success: true,
      data: savedSkill
    });
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la création de la compétence'
    });
  }
});

app.put('/api/v1/admin/skills/:id', adminAuth, async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: updatedSkill
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erreur lors de la mise à jour de la compétence'
    });
  }
});

app.delete('/api/v1/admin/skills/:id', adminAuth, async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Compétence supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression de la compétence'
    });
  }
});

// Routes admin pour les messages
app.get('/api/v1/admin/messages', adminAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des messages'
    });
  }
});

app.patch('/api/v1/admin/messages/:id/read', adminAuth, async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        read: true, 
        readAt: new Date() 
      },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du message'
    });
  }
});

app.delete('/api/v1/admin/messages/:id', adminAuth, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    
    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }
    
    console.log('Message supprimé:', deletedMessage);
    
    res.json({
      success: true,
      message: 'Message supprimé avec succès',
      data: deletedMessage
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du message'
    });
  }
});

// Statistiques du dashboard
app.get('/api/v1/admin/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const [projectCount, skillCount, messageCount, unreadMessageCount, articleCount, publishedArticleCount] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' })
    ]);

    res.json({
      success: true,
      data: {
        projects: projectCount,
        skills: skillCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
        articles: articleCount,
        publishedArticles: publishedArticleCount,
        visitors: Math.floor(Math.random() * 1000) + 500 // Simulation
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
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

// Démarrer le serveur après connexion à la base de données
connectDB().then(async () => {
  // Exécuter les migrations automatiquement au démarrage
  if (config.server.nodeEnv === 'development') {
    console.log('🔄 Exécution des migrations...');
    try {
      await runMigrations();
    } catch (error) {
      console.error('❌ Erreur lors des migrations:', error.message);
      // En développement, on continue même si les migrations échouent
    }
  }

  app.listen(PORT, config.server.host, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 Host: ${config.server.host}`);
    console.log(`🌐 URL: ${config.server.nodeEnv === 'production' ? 'https://forgeron-du-web-api.onrender.com' : `http://localhost:${PORT}`}`);
    console.log(`📊 Environnement: ${config.server.nodeEnv}`);
  });
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
