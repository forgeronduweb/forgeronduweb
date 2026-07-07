const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    email: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    website: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    status: { type: String, default: '' },
    availabilityMessage: { type: String, default: '' },
    bio: { type: String, default: '' },
    stack: { type: [String], default: [] }
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Profile', profileSchema);
