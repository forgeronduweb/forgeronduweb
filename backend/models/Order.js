const mongoose = require('mongoose');
const crypto = require('crypto');

function stripInternalFields(_doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

const orderSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'XOF' },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, default: '' },
    proofMethod: { type: String, enum: ['transaction', 'receipt'], required: true },
    waveNumber: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    receiptFileUrl: { type: String, default: '' },
    receiptFileName: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    downloadToken: { type: String, default: '' },
    paidAt: { type: Date, default: null }
  },
  { timestamps: true, toJSON: { transform: stripInternalFields }, toObject: { transform: stripInternalFields } }
);

orderSchema.statics.generateDownloadToken = function generateDownloadToken() {
  return crypto.randomBytes(24).toString('hex');
};

module.exports = mongoose.model('Order', orderSchema);
