const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    category: { type: String, default: 'Général' },
    published: { type: Boolean, default: false },
    date: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  { timestamps: true, toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Article', articleSchema);
