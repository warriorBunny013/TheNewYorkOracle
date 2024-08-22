import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },  // Unique and indexed for fast lookups
    sessionId: { type: String, required: true, index: true },  // Index for session-based queries
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, index: true },  // Index for querying by email
    userPhone: { type: String, required: true },
    products: [
        {
            alt: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: String, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },  // Index for status-based queries
    createdAt: { type: Date, default: Date.now, index: true },  // Index for date-based queries
});


const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
