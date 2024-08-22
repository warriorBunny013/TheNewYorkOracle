import mongoose from 'mongoose';

const reviewschema = new mongoose.Schema({
  clientName: { type: String, required: true, index: true },  // Index to query by client name
  rating: { type: Number, required: true, index: true },  // Index to query by rating
  comments: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }  // Index to query reviews by creation date
});


export default mongoose.model("ReviewsModel",reviewschema);