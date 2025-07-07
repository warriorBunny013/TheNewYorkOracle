import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  console.log('Auth middleware - Request cookies:', req.cookies);
  console.log('Auth middleware - Request headers:', req.headers);
  
  const token = req.cookies.token;
  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('Auth middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token verified successfully:', decoded);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('Auth middleware - Token expired');
      // Clear the expired token
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/'
      });
      return res.status(401).json({ message: 'Token expired' });
    }
    
    req.admin = decoded;
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification failed:', err.message);
    // Clear invalid token
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/'
    });
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default auth;
