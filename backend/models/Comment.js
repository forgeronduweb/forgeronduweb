const mongoose = require('mongoose');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const commentSchema = new mongoose.Schema(
  {
    articleId: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

module.exports = mongoose.model('Comment', commentSchema);
