// routes/PriceRoutes.js
import express from 'express';
import Price from '../models/Price.js';

const router = express.Router();

// Get all prices
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find();
    res.status(201).json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new price
router.post('/', async (req, res) => {
    const { title, type, description, price ,img} = req.body;
  
    const newPrice = new Price({
      title,
      type,
      description,
      price,
      img
    });
  
    try {
      const savedPrice = await newPrice.save();
      res.status(201).json(savedPrice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
// Update price
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    const updatedPrice = await Price.findByIdAndUpdate(id, { price }, { new: true });
    if (!updatedPrice) return res.status(404).json({ message: 'Price not found' });
    res.json(updatedPrice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
