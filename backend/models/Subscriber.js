const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: '' },
    projectId: { type: String, required: true },
    projectName: { type: String, required: true }
  },
  { timestamps: true, toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
