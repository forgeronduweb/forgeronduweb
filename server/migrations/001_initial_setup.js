import { BaseMigration } from './Migration.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Message from '../models/Message.js';
import Article from '../models/Article.js';

export class InitialSetup extends BaseMigration {
  constructor() {
    super('001_initial_setup', '1.0.0');
  }

  async up() {
    console.log('🚀 Exécution de la migration : Configuration initiale');

    // Créer les index pour optimiser les performances
    await this.createIndexes();
    
    // Insérer des données de démonstration si la base est vide
    await this.seedInitialData();

    console.log('✅ Migration 001_initial_setup terminée');
  }

  async createIndexes() {
    console.log('📊 Création des index...');

    try {
      // Index pour les projets
      await this.createIndexSafely(Project, { title: 1 });
      await this.createIndexSafely(Project, { category: 1 });
      await this.createIndexSafely(Project, { technologies: 1 });
      await this.createIndexSafely(Project, { createdAt: -1 });

      // Index pour les compétences
      await this.createIndexSafely(Skill, { name: 1 });
      await this.createIndexSafely(Skill, { category: 1 });
      await this.createIndexSafely(Skill, { level: -1 });

      // Index pour les messages
      await this.createIndexSafely(Message, { email: 1 });
      await this.createIndexSafely(Message, { createdAt: -1 });
      await this.createIndexSafely(Message, { read: 1 });

      // Index pour les articles
      await this.createIndexSafely(Article, { title: 1 });
      await this.createIndexSafely(Article, { slug: 1 }, { unique: true });
      await this.createIndexSafely(Article, { published: 1 });
      await this.createIndexSafely(Article, { createdAt: -1 });

      console.log('✅ Index créés avec succès');
    } catch (error) {
      console.log('⚠️ Certains index existaient déjà, continuons...');
    }
  }

  async createIndexSafely(Model, indexSpec, options = {}) {
    try {
      await Model.collection.createIndex(indexSpec, options);
    } catch (error) {
      if (error.code === 85) {
        // Index déjà existant, on ignore
        console.log(`ℹ️ Index ${JSON.stringify(indexSpec)} déjà existant`);
      } else {
        throw error;
      }
    }
  }

  async seedInitialData() {
    console.log('🌱 Insertion des données initiales...');

    // Vérifier si des données existent déjà
    const projectCount = await Project.countDocuments();
    const skillCount = await Skill.countDocuments();

    if (projectCount === 0) {
      await this.seedProjects();
    }

    if (skillCount === 0) {
      await this.seedSkills();
    }

    console.log('✅ Données initiales insérées');
  }

  async seedProjects() {
    const projects = [
      {
        title: "E-commerce React",
        description: "Application e-commerce complète avec React et Node.js",
        image: "/images/projects/ecommerce.jpg",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        category: "Web",
        liveUrl: "https://demo-ecommerce.com",
        githubUrl: "https://github.com/username/ecommerce",
        featured: true
      },
      {
        title: "API REST Node.js",
        description: "API REST sécurisée avec authentification JWT",
        image: "/images/projects/api.jpg",
        technologies: ["Node.js", "Express", "MongoDB", "JWT"],
        category: "Backend",
        githubUrl: "https://github.com/username/api-rest",
        featured: true
      },
      {
        title: "Dashboard Analytics",
        description: "Tableau de bord avec graphiques et métriques en temps réel",
        image: "/images/projects/dashboard.jpg",
        technologies: ["Vue.js", "Chart.js", "Socket.io"],
        category: "Web",
        liveUrl: "https://dashboard-demo.com",
        githubUrl: "https://github.com/username/dashboard",
        featured: false
      }
    ];

    await Project.insertMany(projects);
    console.log('📁 Projets de démonstration créés');
  }

  async seedSkills() {
    const skills = [
      // Frontend
      { name: "React", category: "Frontend", level: 90, icon: "react" },
      { name: "Vue.js", category: "Frontend", level: 85, icon: "vuejs" },
      { name: "JavaScript", category: "Frontend", level: 95, icon: "javascript" },
      { name: "TypeScript", category: "Frontend", level: 80, icon: "typescript" },
      { name: "HTML/CSS", category: "Frontend", level: 95, icon: "html5" },
      { name: "Tailwind CSS", category: "Frontend", level: 90, icon: "tailwindcss" },

      // Backend
      { name: "Node.js", category: "Backend", level: 90, icon: "nodejs" },
      { name: "Express", category: "Backend", level: 85, icon: "express" },
      { name: "Python", category: "Backend", level: 75, icon: "python" },
      { name: "PHP", category: "Backend", level: 70, icon: "php" },

      // Base de données
      { name: "MongoDB", category: "Database", level: 85, icon: "mongodb" },
      { name: "MySQL", category: "Database", level: 80, icon: "mysql" },
      { name: "PostgreSQL", category: "Database", level: 75, icon: "postgresql" },

      // Outils
      { name: "Git", category: "DevOps", level: 90, icon: "git" },
      { name: "Docker", category: "DevOps", level: 70, icon: "docker" },
      { name: "AWS", category: "DevOps", level: 65, icon: "aws" },
      { name: "Figma", category: "Design", level: 80, icon: "figma" }
    ];

    await Skill.insertMany(skills);
    console.log('🛠️ Compétences de démonstration créées');
  }

  async down() {
    console.log('🔄 Annulation de la migration : Configuration initiale');

    // Supprimer les données de démonstration
    await Project.deleteMany({});
    await Skill.deleteMany({});
    
    // Note: On ne supprime pas les index car ils peuvent être utilisés par d'autres migrations

    console.log('✅ Migration 001_initial_setup annulée');
  }
}
