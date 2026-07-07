const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Evrard BAHO — Dev Portfolio' },
    seoDescription: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    sectionVisibility: {
      home: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
      contact: { type: Boolean, default: true }
    }
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Settings', settingsSchema);
