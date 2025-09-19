import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    url: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Développement Web',
      'JavaScript',
      'React',
      'Node.js',
      'CSS',
      'Design',
      'Tutoriels',
      'Actualités Tech',
      'Outils',
      'Autres'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  author: {
    name: {
      type: String,
      default: 'Forgeron du Web'
    },
    email: {
      type: String,
      default: 'admin@forgeron.dev'
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  readingTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les recherches
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ slug: 1 });

// Middleware pour générer le slug automatiquement
articleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculer le temps de lecture (environ 200 mots par minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Mettre à jour publishedAt si l'article passe en published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Méthode pour obtenir l'URL de l'article
articleSchema.methods.getUrl = function() {
  return `/blog/${this.slug}`;
};

// Méthode pour obtenir un extrait du contenu
articleSchema.methods.getExcerpt = function(length = 150) {
  if (this.excerpt) return this.excerpt;
  
  const plainText = this.content.replace(/<[^>]*>/g, '');
  return plainText.length > length 
    ? plainText.substring(0, length) + '...'
    : plainText;
};

const Article = mongoose.model('Article', articleSchema);

export default Article;
