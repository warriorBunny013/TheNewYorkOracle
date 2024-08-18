// models/Price.js
import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  price: Number,
  img:String
});

export default mongoose.model('Price', PriceSchema);
