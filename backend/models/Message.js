const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Message', messageSchema);
