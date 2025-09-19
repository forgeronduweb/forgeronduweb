import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Design', 'Mobile', 'Other']
  },
  icon: {
    type: String,
    default: 'Code'
  },
  description: {
    type: String,
    default: ''
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour le tri et les recherches
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ featured: -1, level: -1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
