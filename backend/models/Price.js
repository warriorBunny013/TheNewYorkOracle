// models/Price.js
import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  title: { type: String, index: true },  // Index to query by title
  type: { type: String, index: true },  // Index to query by type
  description: String,
  price: { type: Number, index: true },  // Index to query by price
  img: String
});


export default mongoose.model('Price', PriceSchema);
