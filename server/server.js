import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
dotenv.config();

// Importer les modèles
import Project from './models/Project.js';
import Message from './models/Message.js';
import Skill from './models/Skill.js';
import Article from './models/Article.js';

const app = express();
const PORT = process.env.PORT || 5000;

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
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 4 // Maximum 4 fichiers
  }
});

// Middlewares de sécurité
app.use(helmet());

// Configuration CORS pour permettre les requêtes du client React et de l'admin
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3001'];

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

// Connexion à MongoDB avec variables d'environnement uniquement
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI non définie dans le fichier .env');
      console.warn('💡 Ajoutez: MONGODB_URI=mongodb://localhost:27017/forgeronwebbd');
      console.warn('🔄 Le serveur fonctionne en mode données simulées');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 MongoDB connecté avec succès');
    console.log(`📊 Base de données: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.error('💡 Vérifiez votre variable MONGODB_URI dans le fichier .env');
    console.warn('🔄 Le serveur continue en mode données simulées');
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

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Données simulées (à remplacer par une vraie base de données)
let projects = [
  {
    id: 1,
    title: 'Site E-commerce React',
    description: 'Plateforme de vente en ligne moderne avec panier et paiement',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'Terminé',
    image: '/api/placeholder/300/200',
    url: 'https://example.com',
    github: 'https://github.com/user/project',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Dashboard Analytics',
    description: 'Interface d\'administration avec graphiques et statistiques',
    technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Chart.js'],
    status: 'En cours',
    image: '/api/placeholder/300/200',
    url: 'https://example2.com',
    github: 'https://github.com/user/project2',
    createdAt: '2024-02-10'
  }
];

let skills = [
  { id: 1, name: 'React', level: 90, category: 'Frontend', icon: 'Code' },
  { id: 2, name: 'Vue.js', level: 85, category: 'Frontend', icon: 'Code' },
  { id: 3, name: 'Node.js', level: 88, category: 'Backend', icon: 'Server' },
  { id: 4, name: 'MongoDB', level: 82, category: 'Database', icon: 'Database' }
];

let messages = [];
let nextId = 3;

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
app.get('/api/v1/skills', (req, res) => {
  res.json({
    success: true,
    data: skills
  });
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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@forgeron.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
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
app.get('/api/v1/admin/skills', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: skills
  });
});

app.post('/api/v1/admin/skills', adminAuth, (req, res) => {
  const newSkill = {
    id: nextId++,
    ...req.body
  };
  skills.push(newSkill);
  res.status(201).json({
    success: true,
    data: newSkill
  });
});

app.put('/api/v1/admin/skills/:id', adminAuth, (req, res) => {
  const index = skills.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Compétence non trouvée'
    });
  }
  
  skills[index] = { ...skills[index], ...req.body };
  res.json({
    success: true,
    data: skills[index]
  });
});

app.delete('/api/v1/admin/skills/:id', adminAuth, (req, res) => {
  const index = skills.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Compétence non trouvée'
    });
  }
  
  skills.splice(index, 1);
  res.json({
    success: true,
    message: 'Compétence supprimée avec succès'
  });
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
        readAt: new Date(),
        status: 'read'
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
      error: 'Erreur serveur lors de la mise à jour du message'
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
