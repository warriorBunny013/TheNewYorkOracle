import express from 'express';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  console.log('Dashboard access attempt:', {
    adminId: req.admin?.id,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });
  res.status(200).json({ 
    message: 'Welcome to the admin dashboard',
    adminId: req.admin?.id,
    timestamp: new Date().toISOString()
  });
});

export default router;
