const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'En cours' },
    tech: { type: [String], default: [] },
    demo: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  { timestamps: true, toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Project', projectSchema);
