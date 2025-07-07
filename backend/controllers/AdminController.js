import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for email:', email);
  console.log('Request headers:', req.headers);
  console.log('Request cookies:', req.cookies);
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Admin found, comparing password...');
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Password match successful, generating token...');
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set cookie based on environment
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    };

    // Configure based on environment
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
      cookieOptions.sameSite = 'None';
      cookieOptions.domain = '.soulsticetarot.com';
    } else {
      cookieOptions.sameSite = 'Lax';
    }

    console.log('Setting cookie with options:', cookieOptions);
    res.cookie('token', token, cookieOptions);
    console.log('Login successful for email:', email);
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set cookie based on environment
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: 'None'
    };

    // Only set secure for production
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }

    res.cookie('token', token, cookieOptions);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
    try {
      console.log('Logout request received');
      
      // Clear the token cookie with multiple approaches to ensure it's removed
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.soulsticetarot.com' : undefined
      });
      
      // Also clear with different options to ensure it's removed
      res.clearCookie('token', {
        httpOnly: true,
        path: '/'
      });
      
      // Set an expired cookie to override any existing one
      res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.soulsticetarot.com' : undefined,
        maxAge: 0,
        expires: new Date(0)
      });
      
      console.log('Logout successful - cookies cleared');
      res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };