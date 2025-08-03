import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
    tipId: { type: String, required: true, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    message: { type: String, default: '' }, // Optional message field
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
TipSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Tip = mongoose.model('Tip', TipSchema);

export default Tip; 