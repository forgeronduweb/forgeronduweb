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
    imageUrl: { type: String, default: '' },
    status: { type: String, default: 'En cours' },
    tech: { type: [String], default: [] },
    demo: { type: String, default: '' },
    github: { type: String, default: '' },
    downloadType: { type: String, enum: ['none', 'free', 'paid'], default: 'none' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'XOF' },
    paymentLink: { type: String, default: '' },
    downloadFileUrl: { type: String, default: '' },
    downloadFileName: { type: String, default: '' }
  },
  { timestamps: true, toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Project', projectSchema);
