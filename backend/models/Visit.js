const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    referrer: { type: String, default: '' },
    country: { type: String, default: '' },
    device: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
    // Empreinte du jour (IP + user-agent + date, hachée) : sert à compter les visiteurs
    // uniques sans jamais stocker l'IP en clair.
    visitorHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 } // purge auto après 90 jours
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

visitSchema.index({ createdAt: -1 });
visitSchema.index({ visitorHash: 1, createdAt: -1 });

module.exports = mongoose.model('Visit', visitSchema);
