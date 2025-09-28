import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },  // Unique and indexed for fast lookups
    sessionId: { type: String, index: true },  // Index for session-based queries, now optional for temp bookings
    productName: { type: String, required: true},  // Index for session-based queries
    userPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['temp', 'pending', 'completed', 'failed'], default: 'pending', index: true },  // Index for status-based queries
    formData: {  // New field for storing form data before payment
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        message: { type: String },
        readingtype: { type: String }
    },
    productType: { type: String, enum: ['premium', 'elite'], default: 'premium' },  // Track product type
    createdAt: { type: Date, default: Date.now, index: true },  // Index for date-based queries
});


const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
