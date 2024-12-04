import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },  // Unique and indexed for fast lookups
    sessionId: { type: String, required: true, index: true },  // Index for session-based queries
    productName: { type: String, required: true},  // Index for session-based queries
    userPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },  // Index for status-based queries
    createdAt: { type: Date, default: Date.now, index: true },  // Index for date-based queries
});


const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
