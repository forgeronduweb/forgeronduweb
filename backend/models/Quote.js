const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    projectType: { type: String, default: '' },
    budget: { type: String, default: '' },
    description: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Quote', quoteSchema);
