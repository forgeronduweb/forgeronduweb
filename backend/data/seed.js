const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');

const seedProfile = {
  name: 'Philomé Evrard BAHO',
  role: 'Product Engineer · Fullstack JavaScript',
  location: 'Bingerville, Abidjan · Côte d\'Ivoire',
  yearsOfExperience: 3,
  email: 'forgeronduweb@gmail.com',
  website: '',
  github: 'https://github.com/forgeronduweb',
  linkedin: 'https://www.linkedin.com/in/philomé-evrard',
  instagram: '',
  status: 'Ouvert aux missions',
  availabilityMessage: 'Disponible pour des missions freelance et collaborations',
  bio: [
    'Product Engineer basé à Abidjan, spécialisé en JavaScript fullstack : React, Next.js et Node.js. J\'aide entrepreneurs et développeurs à trouver, construire et rentabiliser leurs apps.',
    'Titulaire d\'une Licence en Informatique spécialité E-Commerce & Marketing Digital de l\'UVCI (mention Bien), je combine une approche technique solide avec une sensibilité produit développée au fil de mes expériences.',
    'Au quotidien, je travaille sur la gestion de portefeuille client chez Lumos CI, tout en développant des projets freelance — du marketplace de chauffeurs KONDUI CI à des dashboards analytiques en Chart.js.'
  ].join('\n'),
  stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Docker']
};

const seedProjects = [
  {
    id: 'kondi-ci',
    name: 'KONDUI CI',
    description: 'Marketplace de mise en relation chauffeurs-employeurs en Côte d\'Ivoire.',
    status: 'En cours',
    tech: ['Next.js', 'React', 'Node.js', 'Prisma'],
    demo: '#',
    github: '#'
  },
  {
    id: 'dashboard-sav',
    name: 'Dashboard SAV — Lumos CI',
    description: 'Tableau de bord interactif de suivi des tickets SAV par ville.',
    status: 'Live',
    tech: ['Chart.js', 'JavaScript', 'Excel'],
    demo: '#',
    github: ''
  },
  {
    id: 'salut',
    name: 'Salut',
    description: 'Ce ci est un test',
    status: 'Live',
    tech: ['Java'],
    demo: '',
    github: ''
  }
];

const seedArticles = [
  {
    id: 'ai-stackoverflow',
    title: 'IA vs Stack Overflow : la fin du copier-coller ou le début d\'une nouvelle dépendance ?',
    excerpt: 'Comment les LLMs transforment la façon dont on cherche et on comprend les solutions.',
    content: '',
    category: 'IA & Dev',
    published: true,
    date: '14 mai 2025'
  },
  {
    id: 'orm-relations',
    title: 'ORM et relations : OneToMany, ManyToMany — quand ça casse et pourquoi',
    excerpt: 'Un retour concret sur les pièges des relations avec Prisma et TypeORM.',
    content: '',
    category: 'Backend',
    published: false,
    date: 'Modifié il y a 3 jours'
  }
];

async function seedIfEmpty() {
  const [profileCount, projectCount, articleCount] = await Promise.all([
    Profile.countDocuments(),
    Project.countDocuments(),
    Article.countDocuments()
  ]);

  if (profileCount === 0) await Profile.create(seedProfile);
  if (projectCount === 0) await Project.insertMany(seedProjects);
  if (articleCount === 0) await Article.insertMany(seedArticles);
}

async function resetToSeed() {
  await Promise.all([
    Project.deleteMany({}),
    Article.deleteMany({}),
    Comment.deleteMany({}),
    Message.deleteMany({})
  ]);
  await Project.insertMany(seedProjects);
  await Article.insertMany(seedArticles);
}

module.exports = { seedIfEmpty, resetToSeed };
