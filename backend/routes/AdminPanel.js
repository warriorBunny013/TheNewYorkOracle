import express from 'express';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard' });
});

export default router;
