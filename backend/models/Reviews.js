import mongoose from 'mongoose';

const reviewschema=new mongoose.Schema({
    clientName: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  })

export default mongoose.model("ReviewsModel",reviewschema);