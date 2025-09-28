import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from 'stripe';
import mongoose, { isValidObjectId } from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import crypto from 'crypto';
import Booking from './models/Booking.js';
import Tip from './models/Tip.js';
import Admin from './routes/Admin.js';
import AdminPanel from './routes/AdminPanel.js';
import AdminModel from './models/Admin.js';
import authMiddleware from './middleware/auth.js';
import routes from "./routes/ReviewsRoutes.js";
import priceRoutes from './routes/PriceRoutes.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { getClientEmailTemplate, getMarinaEmailTemplate } from './emailTemplates.js';
// import { transporter,sendEmail } from "./controllers/EmailServiceController.js";

dotenv.config();

// Environment detection for test vs production mode
const isTestMode = process.env.NODE_ENV === 'development' || 
                   process.env.RENDER_APP_NAME?.includes('test') ||
                   process.env.STRIPE_SECRET_KEY?.startsWith('sk_test') ||
                   process.env.NODE_ENV === 'test';

console.log('=== ENVIRONMENT CONFIGURATION ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RENDER_APP_NAME:', process.env.RENDER_APP_NAME);
console.log('Running in TEST MODE:', isTestMode);
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'NOT SET');
console.log('STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? 'Set' : 'NOT SET');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'NOT SET');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');


// Initialize Resend with error handling
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set! Email functionality will not work.');
  } else {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Resend:', error);
}

// Set fallback JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-for-development-only';
  console.log('WARNING: Using fallback JWT_SECRET. Set JWT_SECRET in production!');
}

// Initialize Stripe with environment-specific keys
const stripeKey = isTestMode ? process.env.STRIPE_SECRET_KEY : process.env.STRIPE_SECRET;
const stripe = new Stripe(stripeKey);

console.log('Stripe initialized with key:', stripeKey?.substring(0, 12) + '...');
const app = express();

// Middleware setup
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
      ? ["https://www.soulsticetarot.com", "https://soulsticetarot.com","the-new-york-oracle-development-mod.vercel.app,https://the-new-york-oracle-develo-git-224dce-warriorbunny013s-projects.vercel.app"]
      : ["http://localhost:3000", "http://localhost:8080","the-new-york-oracle-development-mod.vercel.app","https://the-new-york-oracle-develo-git-224dce-warriorbunny013s-projects.vercel.app"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  }));

  const frontendapi = process.env.NODE_ENV === "production"
  ? "https://www.soulsticetarot.com"
  : "http://localhost:3000";

  const backendapi = process.env.NODE_ENV === "production"
  ? "https://api.soulsticetarot.com"
  : "http://localhost:8080";

  const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

// MongoDB connection
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); // Simplified connection without deprecated options
        console.log("Connected to MongoDB");

    } catch (err) {
        console.log("Can't connect to MongoDB", err);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

connectToMongoDB()


   
app.get("/home", (req, res) => {
    res.status(200).json({ message: "I requested for home", success: true });
});

// Test webhook endpoint
app.get('/webhook', (req, res) => {
  console.log('Webhook GET request received');
  res.status(200).json({ message: 'Webhook endpoint is accessible' });
});

// Test endpoint for debugging
app.get("/api/test-auth", (req, res) => {
    console.log('Test auth endpoint - Request cookies:', req.cookies);
    console.log('Test auth endpoint - Request headers:', req.headers);
    res.status(200).json({ 
        message: "Auth test endpoint", 
        cookies: req.cookies,
        hasToken: !!req.cookies.token,
        env: process.env.NODE_ENV,
        jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
    });
});

// Create admin user endpoint (for development only)
app.post("/api/create-admin", async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'Not allowed in production' });
    }
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        
        // Create new admin
        const admin = new AdminModel({ email, password });
        await admin.save();
        
        res.status(201).json({ message: 'Admin created successfully', email });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Routes
app.use("/api", routes);
app.use("/api/admin", Admin);
app.use("/api/adminpanel", authMiddleware, AdminPanel);



// Stripe Checkout Session Endpoint (Elite reading payment)
app.post('/api/create-checkout-session', async (req, res) => {
    const { productName,userPrice } = req.body;
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // line_items: lineItems,
            mode: 'payment',
            success_url: `${frontendapi}/book/${bookingId}`,
            cancel_url: `${frontendapi}/cancelpayment`,
            line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: productName,
                    },
                    unit_amount: userPrice*100, // Price in cents
                  },
                  quantity: 1,
                },
              ],
              metadata: { productName, userPrice },
        });

        await Booking.create({
            bookingId,
            sessionId: session.id,
            productName,
            userPrice,
            currency: 'usd',
            status: 'pending'
        });

        res.status(200).json({ id: session.id });
        console.log("payment done!!!")
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Stripe Checkout Session Endpoint (premium reading payment)
app.post('/api/create-checkout-session-premium', async (req, res) => {
    const { productName,userPrice } = req.body;
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // line_items: lineItems,
            mode: 'payment',
            success_url: `${frontendapi}/book-premium/${bookingId}`,
            cancel_url: `${frontendapi}/cancelpayment`,
            line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: productName,
                    },
                    unit_amount: userPrice*100, // Price in cents
                  },
                  quantity: 1,
                },
              ],
              metadata: { productName, userPrice },
        });

        await Booking.create({
            bookingId,
            sessionId: session.id,
            productName,
            userPrice,
            currency: 'usd',
            status: 'pending'
        });

        res.status(200).json({ id: session.id });
        console.log("payment done!!!")
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Stripe Checkout Session Endpoint (tip payment)
app.post('/api/create-checkout-session-tip', async (req, res) => {
  const { productName, userPrice, message } = req.body;

  const tipId = crypto.randomBytes(16).toString('hex');

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          success_url: `${frontendapi}`,
          cancel_url: `${frontendapi}/cancelpayment`,
          line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: productName,
                  },
                  unit_amount: userPrice*100, // Price in cents
                },
                quantity: 1,
              },
            ],
            metadata: { productName, userPrice, message: message || '' },
      });

      const newTip = await Tip.create({
          tipId,
          sessionId: session.id,
          amount: userPrice,
          currency: 'usd',
          message: message || '',
          status: 'pending'
      });

      res.status(200).json({ id: session.id });
      console.log("tip payment created!!!", newTip.tipId);
      
      // For development/testing, also send email immediately
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode - sending email immediately');
        setTimeout(async () => {
          try {
            await sendTipNotificationEmail(newTip);
          } catch (error) {
            console.error('Development email error:', error);
          }
        }, 2000); // Wait 2 seconds to simulate webhook delay
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to get all tips for admin dashboard
app.get('/api/tips', authMiddleware, async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tips });
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tips' });
  }
});

// Test endpoint to manually trigger tip email (for debugging)
app.post('/api/test-tip-email', async (req, res) => {
  try {
    const testTip = {
      tipId: 'test-tip-123',
      amount: 25,
      message: 'Test message from debugging',
      createdAt: new Date(),
      status: 'completed'
    };
    
    console.log('Testing tip email function...');
    await sendTipNotificationEmail(testTip);
    
    res.status(200).json({ success: true, message: 'Test email sent' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manual webhook trigger for testing
app.post('/api/trigger-webhook', async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log('Manually triggering webhook for session:', sessionId);
    
    // Simulate webhook event
    const tip = await Tip.findOne({ sessionId });
    if (tip) {
      tip.status = 'completed';
      await tip.save();
      console.log(`Tip ${tip.tipId} marked as completed`);
      
      await sendTipNotificationEmail(tip);
      res.status(200).json({ success: true, message: 'Webhook triggered successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Tip not found for session' });
    }
  } catch (error) {
    console.error('Manual webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple email test endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('Testing basic email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'NOT SET');
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "Solsticetarot143@gmail.com",
      subject: "Email Test - Soulstice Tarot",
      html: `
        <h2>Email Test Successful! ✅</h2>
        <p>Your email configuration is working properly.</p>
        <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to validate payment
// Route to get booking details by booking ID
app.get('/api/booking/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const booking = await Booking.findOne({ bookingId: id });
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }
      // Allow access for both pending and completed bookings
      if (booking.status === 'pending' || booking.status === 'completed') {
          res.status(200).json({ message: 'Booking found!', status: booking.status });
      } else {
          return res.status(404).json({ message: 'Booking not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Webhook to handle payment success
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("POST WEBHOOK MEIN HOON!!!")
    console.log("Webhook headers:", req.headers);
    console.log("Webhook body length:", req.body ? req.body.length : 'No body');
    console.log("Webhook URL:", req.originalUrl);
    console.log("Webhook method:", req.method);
    const signature = req.headers['stripe-signature'];
  
    try {
      const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  
      console.log('Webhook event type:', event.type);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Processing completed checkout session:', session.id);
  
        // Find and update the booking status
        const booking = await Booking.findOne({ sessionId: session.id });
        if (booking) {
          booking.status = 'completed';
          await booking.save();
          console.log(`Booking ${booking.bookingId} marked as completed`);
        }

        // Find and update the tip status
        const tip = await Tip.findOne({ sessionId: session.id });
        console.log('Looking for tip with sessionId:', session.id);
        console.log('Found tip:', tip ? tip.tipId : 'No tip found');
        
        if (tip) {
          tip.status = 'completed';
          await tip.save();
          console.log(`Tip ${tip.tipId} marked as completed`);
          
          // Send email notification for tip
          console.log('Calling sendTipNotificationEmail...');
          await sendTipNotificationEmail(tip);
        } else {
          console.log('No tip found for sessionId:', session.id);
        }
        
      }
  
      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send('Webhook Error');
    }
  });
  

// Function to send tip notification email
const sendTipNotificationEmail = async (tip) => {
  console.log('Starting email notification for tip:', tip.tipId);
  console.log('Email config - USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
  console.log('Email config - PASS:', process.env.EMAIL_PASS ? 'Set' : 'NOT SET');
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "konceept.contact@gmail.com",
      subject: "New Tip Received! 💝",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Tip Received</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #1a1a1a; 
                    background-color: #f8f9fa;
                }
                .email-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    padding: 40px 30px; 
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0.1;
                }
                .header h1 { 
                    color: white; 
                    font-size: 28px; 
                    font-weight: bold; 
                    margin-bottom: 10px;
                    position: relative;
                    z-index: 1;
                }
                .content { 
                    padding: 40px 30px; 
                }
                .success-section { 
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                    border-radius: 12px; 
                    padding: 30px; 
                    margin-bottom: 30px;
                    border-left: 5px solid #28a745;
                }
                .tip-amount {
                    font-size: 32px;
                    font-weight: bold;
                    color: #28a745;
                    text-align: center;
                    margin: 20px 0;
                }
                .message-section {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 5px solid #17a2b8;
                }
                .message-text {
                    font-style: italic;
                    color: #6c757d;
                    margin-top: 10px;
                }
                .footer { 
                    background: #343a40; 
                    color: white; 
                    text-align: center; 
                    padding: 20px; 
                }
                .cta-button { 
                    display: inline-block; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold; 
                    margin-top: 20px; 
                    transition: transform 0.3s ease;
                }
                .cta-button:hover { 
                    transform: translateY(-2px); 
                }
                .copyright { 
                    font-size: 12px; 
                    opacity: 0.8; 
                    margin-top: 20px; 
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>New Tip Received! 💝</h1>
                </div>
                
                <div class="content">
                    <div class="success-section">
                        <h2 style="color: #28a745; margin-bottom: 15px;">Someone just tipped you!</h2>
                        <div class="tip-amount">$${tip.amount}</div>
                        <p style="color: #155724; margin-bottom: 0;">Thank you for your amazing work! This tip shows how much people value your guidance.</p>
                    </div>
                    
                    ${tip.message ? `
                    <div class="message-section">
                        <h3 style="color: #17a2b8; margin-bottom: 10px;">Message from the tipper:</h3>
                        <div class="message-text">"${tip.message}"</div>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #6c757d; margin-bottom: 20px;">Tip received on: ${new Date(tip.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        
                        <a href="https://www.soulsticetarot.com" class="cta-button">Visit Your Website</a>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="copyright">
                        © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
                    </div>
                </div>
            </div>
        </body>
        </html>
      `
    };

    console.log('Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Tip notification email sent successfully:', result);
  } catch (error) {
    console.error('Error sending tip notification email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
  }
};

// SENDING EMAILS

// POST route for sending emails

// app.post("/sendemail", async (req, res) => {
    
// const { name, email, phone, message,readingtype } = req.body;
// //    console.log("check!");
// // Input validation (example: you can customize this as needed)
// if (!name || !email || !message || !readingtype) {
//   return res.status(400).send({ success: false, message: "All fields are required." });
// }
//     try {
//       // Nodemailer transport configuration
    
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER, // Your Gmail address
//           pass: process.env.EMAIL_PASS, // Your Gmail app password
//         },
// //         port: 25, // Postfix uses port 25
// //   host: 'localhost',
//   tls: {
//     rejectUnauthorized: false
//   },
//       });
        
//       // Email content to the client
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: `${email}`, // Recipient email
//         cc: "dawn@soulsticetarot.com", // CC recipient
//         subject: "Booking Confirmation with Marina",
//         html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Booking Confirmation</title>
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { 
//                     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//                     line-height: 1.6; 
//                     color: #1a1a1a; 
//                     background-color: #f8f9fa;
//                 }
//                 .email-container { 
//                     max-width: 600px; 
//                     margin: 0 auto; 
//                     background: #ffffff;
//                     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//                 }
//                 .header { 
//                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                     padding: 40px 30px; 
//                     text-align: center;
//                     position: relative;
//                     overflow: hidden;
//                 }
//                 .header::before {
//                     content: '';
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     bottom: 0;
//                     opacity: 0.3;
//                 }
//                 .header-content { position: relative; z-index: 1; }
//                 .header h1 { 
//                     color: white; 
//                     margin: 0; 
//                     font-size: 32px; 
//                     font-weight: 300;
//                     letter-spacing: 1px;
//                 }
//                 .logo { 
//                     max-width: 120px; 
//                     margin-bottom: 20px;
//                     filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
//                 }
//                 .content { 
//                     padding: 50px 40px; 
//                     background: #ffffff;
//                 }
//                 .success-section {
//                     text-align: center;
//                     margin-bottom: 40px;
//                 }
//                 .success-icon { 
//                     width: 80px; 
//                     height: 80px; 
//                     background: linear-gradient(135deg, #28a745, #20c997); 
//                     border-radius: 50%; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     margin: 0 auto 25px;
//                     box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
//                 }
//                 .success-icon svg { 
//                     width: 35px; 
//                     height: 35px; 
//                     color: white;
//                     filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
//                 }
//                 .main-title {
//                     color: #2c3e50;
//                     font-size: 28px;
//                     font-weight: 600;
//                     margin-bottom: 10px;
//                     text-align: center;
//                 }
//                 .subtitle {
//                     color: #6c757d;
//                     font-size: 16px;
//                     text-align: center;
//                     margin-bottom: 30px;
//                 }
//                 .greeting {
//                     color: #2c3e50;
//                     font-size: 18px;
//                     margin-bottom: 25px;
//                     line-height: 1.6;
//                 }
//                 .info-box { 
//                     background: linear-gradient(135deg, #e3f2fd, #f3e5f5); 
//                     border-left: 4px solid #667eea; 
//                     padding: 20px; 
//                     margin: 25px 0; 
//                     border-radius: 8px;
//                     box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
//                 }
//                 .info-box strong {
//                     color: #495057;
//                     font-weight: 600;
//                 }
//                 .booking-details { 
//                     background: #f8f9fa; 
//                     border-radius: 12px; 
//                     padding: 30px; 
//                     margin: 30px 0;
//                     border: 1px solid #e9ecef;
//                 }
//                 .booking-details h3 { 
//                     color: #2c3e50; 
//                     margin-bottom: 20px; 
//                     font-size: 20px;
//                     font-weight: 600;
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                 }
//                 .detail-row { 
//                     display: flex; 
//                     margin-bottom: 15px;
//                     padding: 12px 0;
//                     border-bottom: 1px solid #e9ecef;
//                 }
//                 .detail-row:last-child {
//                     border-bottom: none;
//                     margin-bottom: 0;
//                 }
//                 .detail-label { 
//                     font-weight: 600; 
//                     color: #495057; 
//                     min-width: 140px;
//                     font-size: 14px;
//                 }
//                 .detail-value { 
//                     color: #6c757d;
//                     font-size: 14px;
//                     flex: 1;
//                 }
//                 .next-steps {
//                     margin: 35px 0;
//                 }
//                 .next-steps h3 {
//                     color: #2c3e50;
//                     font-size: 20px;
//                     font-weight: 600;
//                     margin-bottom: 20px;
//                 }
//                 .steps-list {
//                     list-style: none;
//                     padding: 0;
//                 }
//                 .steps-list li {
//                     color: #6c757d;
//                     line-height: 1.8;
//                     margin-bottom: 12px;
//                     padding-left: 25px;
//                     position: relative;
//                     font-size: 15px;
//                 }
//                 .steps-list li::before {
//                     content: '✓';
//                     position: absolute;
//                     left: 0;
//                     color: #28a745;
//                     font-weight: bold;
//                     font-size: 16px;
//                 }
//                 .cta-section {
//                     text-align: center;
//                     margin: 40px 0;
//                     padding: 30px;
//                     background: linear-gradient(135deg, #f8f9fa, #e9ecef);
//                     border-radius: 12px;
//                 }
//                 .cta-button { 
//                     display: inline-block; 
//                     background: linear-gradient(135deg, #667eea, #764ba2); 
//                     color: white; 
//                     padding: 15px 30px; 
//                     text-decoration: none; 
//                     border-radius: 8px; 
//                     margin: 20px 0;
//                     font-weight: 600;
//                     font-size: 16px;
//                     transition: all 0.3s ease;
//                     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
//                 }
//                 .cta-button:hover {
//                     transform: translateY(-2px);
//                     box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
//                 }
//                 .footer { 
//                     background: #2c3e50; 
//                     padding: 30px; 
//                     text-align: center;
//                     color: #ffffff;
//                 }
//                 .footer p { 
//                     margin: 8px 0; 
//                     color: #bdc3c7;
//                     font-size: 14px;
//                 }
//                 .footer a {
//                     color: #667eea;
//                     text-decoration: none;
//                 }
//                 .footer a:hover {
//                     text-decoration: underline;
//                 }
//                 .copyright {
//                     margin-top: 20px;
//                     padding-top: 20px;
//                     border-top: 1px solid #34495e;
//                     font-size: 12px;
//                     color: #95a5a6;
//                 }
//                 @media (max-width: 600px) {
//                     .content { padding: 30px 20px; }
//                     .header { padding: 30px 20px; }
//                     .detail-row { flex-direction: column; gap: 5px; }
//                     .detail-label { min-width: auto; }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="email-container">
//                 <div class="header">
//                     <div class="header-content">
//                         <h1>Booking Confirmation</h1>
//                     </div>
//       </div>

//                 <div class="content">
//                     <div class="success-section">
//                         <h2 class="main-title">Booking Confirmed!</h2>
//                         <p class="subtitle">Your spiritual journey with Marina begins now</p>
//                     </div>
                    
//                     <p class="greeting">Dear <strong>${name}</strong>,</p>
                    
//                     <p class="greeting">Thank you for choosing Marina's professional tarot reading services! Your booking has been successfully received and confirmed. I'm excited to work with you on your spiritual journey and provide you with the guidance you seek.</p>
                    
//                     <div class="info-box">
//                         <strong>📧 Important:</strong> All further communication regarding your reading will be sent to this email address. Please ensure you check your inbox regularly and add our email to your contacts to avoid missing important updates.
//                     </div>
                    
//                     <div class="booking-details">
//                         <h3>📋 Booking Details</h3>
//                         <div class="detail-row">
//                             <span class="detail-label">Name:</span>
//                             <span class="detail-value">${name}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Email:</span>
//                             <span class="detail-value">${email}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Phone:</span>
//                             <span class="detail-value">${phone || "Not provided"}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Reading Type:</span>
//                             <span class="detail-value">${readingtype}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Your Message:</span>
//                             <span class="detail-value">${message}</span>
//                         </div>
//                     </div>
                    
//                     <div class="next-steps">
//                         <h3>🌟 What to Expect Next</h3>
//                         <ul class="steps-list">
//                             <li>You'll receive a detailed email within 5-7 days with specific instructions for your reading</li>
//                             <li>For live readings: Scheduling information will be provided based on Marina's availability</li>
//                             <li>For pre-recorded readings: Your personalized reading will be delivered to this email address</li>
//                             <li>If you have any questions, feel free to reply to this email</li>
//           </ul>
//       </div>

//                     <div class="cta-section">
//                         <a href="https://www.soulsticetarot.com" class="cta-button">Visit Our Website</a>
//                     </div>
//                 </div>
                
//                 <div class="footer">
//                     <p><strong>Marina Smargiannakis</strong></p>
//                     <p>The New York Oracle™</p>
//                     <p>Email: info@soulsticetarot.com</p>
//                     <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
//                     <div class="copyright">
//                         © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
//       </div>
//     </div>
//             </div>
//         </body>
//         </html>
//         `,
//       };


//       //Email content to Marina(Service provider)
//       const mailOptions1 = {
//         from: `${email}`,
//         to: process.env.EMAIL_USER, // Recipient email
//         cc: "dawn@soulsticetarot.com", // CC recipient
//         subject: `New Booking of Same Day Express with your client: ${name}`,
//         html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>New Booking Notification</title>
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { 
//                     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//                     line-height: 1.6; 
//                     color: #1a1a1a; 
//                     background-color: #f8f9fa;
//                 }
//                 .email-container { 
//                     max-width: 600px; 
//                     margin: 0 auto; 
//                     background: #ffffff;
//                     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//                 }
//                 .header { 
//                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                     padding: 40px 30px; 
//                     text-align: center;
//                     position: relative;
//                     overflow: hidden;
//                 }
//                 .header::before {
//                     content: '';
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     bottom: 0;
//                     opacity: 0.3;
//                 }
//                 .header-content { position: relative; z-index: 1; }
//                 .header h1 { 
//                     color: white; 
//                     margin: 0; 
//                     font-size: 32px; 
//                     font-weight: 300;
//                     letter-spacing: 1px;
//                 }
//                 .logo { 
//                     max-width: 120px; 
//                     margin-bottom: 20px;
//                     filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
//                 }
//                 .content { 
//                     padding: 50px 40px; 
//                     background: #ffffff;
//                 }
//                 .notification-section {
//                     text-align: center;
//                     margin-bottom: 40px;
//                 }
//                 .notification-icon { 
//                     width: 80px; 
//                     height: 80px; 
//                     background: linear-gradient(135deg, #ffc107, #ff9800); 
//                     border-radius: 50%; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     margin: 0 auto 25px;
//                     box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
//                 }
//                 .notification-icon svg { 
//                     width: 35px; 
//                     height: 35px; 
//                     color: white;
//                     filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
//                 }
//                 .main-title {
//                     color: #2c3e50;
//                     font-size: 28px;
//                     font-weight: 600;
//                     margin-bottom: 10px;
//                     text-align: center;
//                 }
//                 .subtitle {
//                     color: #6c757d;
//                     font-size: 16px;
//                     text-align: center;
//                     margin-bottom: 30px;
//                 }
//                 .priority-box { 
//                     background: linear-gradient(135deg, #fff3cd, #ffeaa7); 
//                     border-left: 4px solid #ffc107; 
//                     padding: 20px; 
//                     margin: 25px 0; 
//                     border-radius: 8px;
//                     box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
//                 }
//                 .priority-box strong {
//                     color: #495057;
//                     font-weight: 600;
//                 }
//                 .booking-details { 
//                     background: #f8f9fa; 
//                     border-radius: 12px; 
//                     padding: 30px; 
//                     margin: 30px 0;
//                     border: 1px solid #e9ecef;
//                 }
//                 .booking-details h3 { 
//                     color: #2c3e50; 
//                     margin-bottom: 20px; 
//                     font-size: 20px;
//                     font-weight: 600;
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                 }
//                 .detail-row { 
//                     display: flex; 
//                     margin-bottom: 15px;
//                     padding: 12px 0;
//                     border-bottom: 1px solid #e9ecef;
//                 }
//                 .detail-row:last-child {
//                     border-bottom: none;
//                     margin-bottom: 0;
//                 }
//                 .detail-label { 
//                     font-weight: 600; 
//                     color: #495057; 
//                     min-width: 140px;
//                     font-size: 14px;
//                 }
//                 .detail-value { 
//                     color: #6c757d;
//                     font-size: 14px;
//                     flex: 1;
//                 }
//                 .next-steps {
//                     margin: 35px 0;
//                 }
//                 .next-steps h3 {
//                     color: #2c3e50;
//                     font-size: 20px;
//                     font-weight: 600;
//                     margin-bottom: 20px;
//                 }
//                 .steps-list {
//                     list-style: none;
//                     padding: 0;
//                 }
//                 .steps-list li {
//                     color: #6c757d;
//                     line-height: 1.8;
//                     margin-bottom: 12px;
//                     padding-left: 25px;
//                     position: relative;
//                     font-size: 15px;
//                 }
//                 .steps-list li::before {
//                     content: '→';
//                     position: absolute;
//                     left: 0;
//                     color: #667eea;
//                     font-weight: bold;
//                     font-size: 16px;
//                 }
//                 .status-box {
//                     background: linear-gradient(135deg, #d4edda, #c3e6cb);
//                     border-left: 4px solid #28a745;
//                     padding: 20px;
//                     margin: 25px 0;
//                     border-radius: 8px;
//                     box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
//                 }
//                 .status-box strong {
//                     color: #155724;
//                     font-weight: 600;
//                 }
//                 .footer { 
//                     background: #2c3e50; 
//                     padding: 30px; 
//                     text-align: center;
//                     color: #ffffff;
//                 }
//                 .footer p { 
//                     margin: 8px 0; 
//                     color: #bdc3c7;
//                     font-size: 14px;
//                 }
//                 .footer a {
//                     color: #667eea;
//                     text-decoration: none;
//                 }
//                 .footer a:hover {
//                     text-decoration: underline;
//                 }
//                 .copyright {
//                     margin-top: 20px;
//                     padding-top: 20px;
//                     border-top: 1px solid #34495e;
//                     font-size: 12px;
//                     color: #95a5a6;
//                 }
//                 @media (max-width: 600px) {
//                     .content { padding: 30px 20px; }
//                     .header { padding: 30px 20px; }
//                     .detail-row { flex-direction: column; gap: 5px; }
//                     .detail-label { min-width: auto; }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="email-container">
//                 <div class="header">
//                     <div class="header-content">
//                         <h1>New Booking Notification</h1>
//                     </div>
//       </div>

//                 <div class="content">
//                     <div class="notification-section">
//                         <div class="notification-icon">
//                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//                             </svg>
//                         </div>
                        
//                         <h2 class="main-title">New Booking INFO</h2>
//                         <p class="subtitle">A new client has completed their booking</p>
//                     </div>
                    
//                     <div class="priority-box">
//                         <strong>⚡ Action Required:</strong> A new client has completed their booking and form submission. Please review the details below and process their reading request within 24-72 hours.
//                     </div>
                    
//                     <div class="booking-details">
//                         <h3>📋 Client Information</h3>
//                         <div class="detail-row">
//                             <span class="detail-label">Client Name:</span>
//                             <span class="detail-value">${name}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Email Address:</span>
//                             <span class="detail-value">${email}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Phone Number:</span>
//                             <span class="detail-value">${phone || "Not provided"}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Reading Type:</span>
//                             <span class="detail-value">${readingtype}</span>
//                         </div>
//                         <div class="detail-row">
//                             <span class="detail-label">Client Message:</span>
//                             <span class="detail-value">${message}</span>
//                         </div>
//                     </div>
                    
//                     <div class="next-steps">
//                         <h3>🎯 Next Steps</h3>
//                         <ul class="steps-list">
//                             <li>Review the client's message and reading type carefully</li>
//                             <li>For pre-recorded readings: Prepare and deliver within 24-72 hours</li>
//                             <li>For live readings: Contact client to schedule the session</li>
//                             <li>Send confirmation email to client with specific instructions</li>
//                             <li>Update booking status in your system</li>
//           </ul>
//       </div>

//                     <div class="status-box">
//                         <strong>✅ Status:</strong> This booking has been automatically confirmed. The client has already received a confirmation email with their booking details.
//                     </div>
//                 </div>
                
//                 <div class="footer">
//                     <p><strong>Marina Smargiannakis</strong></p>
//                     <p>The New York Oracle™</p>
//                     <p>Email: info@soulsticetarot.com</p>
//                     <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
//                     <div class="copyright">
//                         © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
//       </div>
//     </div>
//             </div>
//         </body>
//         </html>
//         `,
//       };
      
//       // Send the email
//        // Send both emails
//     await Promise.all([
//       transporter.sendMail(mailOptions),
//       transporter.sendMail(mailOptions1),
//     ]);
//       res.status(200).send({ success: true, message: "Email sent successfully!" });
//       console.log("check Try hainn!");
//     } catch (error) {
//         console.log("check catch!");
//       res.status(500).send({ success: false, message: "Failed to send email.", error });
//     }
//   });
  

//RESEND EMAILS

// 5. Create a helper function to send emails with Resend (supports CC)
const sendEmailWithResend = async (to, subject, html, from = process.env.EMAIL_USER, cc = null) => {
  try {
    if (!resend) {
      throw new Error('Resend is not initialized. Check RESEND_API_KEY environment variable.');
    }

    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER environment variable is not set.');
    }

    const emailData = {
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
      replyTo: process.env.EMAIL_USER
    };

    // Add CC if provided
    if (cc) {
      emailData.cc = Array.isArray(cc) ? cc : [cc];
    }

    console.log('Sending email with Resend:', { to, subject, from, cc });
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully with Resend:', data);
    return data;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    throw error;
  }
};

// 6. Create a function to send tip notification emails using Resend
const sendTipNotificationEmailWithResend = async (tip) => {
  console.log('Starting Resend email notification for tip:', tip.tipId);
  
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Tip Received</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                  line-height: 1.6; 
                  color: #1a1a1a; 
                  background-color: #f8f9fa;
              }
              .email-container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: #ffffff;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header { 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  padding: 40px 30px; 
                  text-align: center;
                  position: relative;
                  overflow: hidden;
              }
              .header h1 { 
                  color: white; 
                  font-size: 28px; 
                  font-weight: bold; 
                  margin-bottom: 10px;
                  position: relative;
                  z-index: 1;
              }
              .content { 
                  padding: 40px 30px; 
              }
              .success-section { 
                  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                  border-radius: 12px; 
                  padding: 30px; 
                  margin-bottom: 30px;
                  border-left: 5px solid #28a745;
              }
              .tip-amount {
                  font-size: 32px;
                  font-weight: bold;
                  color: #28a745;
                  text-align: center;
                  margin: 20px 0;
              }
              .message-section {
                  background: #f8f9fa;
                  border-radius: 12px;
                  padding: 20px;
                  margin: 20px 0;
                  border-left: 5px solid #17a2b8;
              }
              .message-text {
                  font-style: italic;
                  color: #6c757d;
                  margin-top: 10px;
              }
              .footer { 
                  background: #343a40; 
                  color: white; 
                  text-align: center; 
                  padding: 20px; 
              }
              .copyright { 
                  font-size: 12px; 
                  opacity: 0.8; 
                  margin-top: 20px; 
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>New Tip Received! 💝</h1>
              </div>
              
              <div class="content">
                  <div class="success-section">
                      <h2 style="color: #28a745; margin-bottom: 15px;">Someone just tipped you!</h2>
                      <div class="tip-amount">$${tip.amount}</div>
                      <p style="color: #155724; margin-bottom: 0;">Thank you for your amazing work! This tip shows how much people value your guidance.</p>
                  </div>
                  
                  ${tip.message ? `
                  <div class="message-section">
                      <h3 style="color: #17a2b8; margin-bottom: 10px;">Message from the tipper:</h3>
                      <div class="message-text">"${tip.message}"</div>
                  </div>
                  ` : ''}
                  
                  <div style="text-align: center; margin-top: 30px;">
                      <p style="color: #6c757d; margin-bottom: 20px;">Tip received on: ${new Date(tip.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                      })}</p>
                  </div>
              </div>
              
              <div class="footer">
                  <div class="copyright">
                      © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    const result = await sendEmailWithResend(
      'dawn@soulsticetarot.com',
      'New Tip Received! 💝',
      html,
      process.env.EMAIL_USER, // Use your main email address
      'info@soulsticetarot.com' // CC to info email
    );

    console.log('Tip notification email sent successfully with Resend:', result);
    return result;
  } catch (error) {
    console.error('Error sending tip notification email with Resend:', error);
    throw error;
  }
};

// 7. Update your existing sendemail route to use Resend with full HTML templates
app.post("/sendemail", async (req, res) => {
    const { name, email, phone, message, readingtype } = req.body;
    
    console.log('=== BOOKING FORM SUBMISSION ===');
    console.log('Form data received:', { name, email, phone, message, readingtype });

    // Input validation
    if (!name || !email || !message || !readingtype) {
        console.log('Validation failed - missing required fields');
        return res.status(400).send({ success: false, message: "All fields are required." });
    }

    try {
        // Client confirmation email HTML (complete template from Nodemailer)
        const clientEmailHtml = getClientEmailTemplate(name, email, phone, message, readingtype);

        // Marina notification email HTML (complete template from Nodemailer)
        const marinaEmailHtml = getMarinaEmailTemplate(name, email, phone, message, readingtype);

        // Send emails using Resend with CC functionality
        await Promise.all([
            // Client confirmation email with CC to dawn@soulsticetarot.com
            sendEmailWithResend(
                email, 
                'Booking Confirmation with Marina',
                clientEmailHtml,
                process.env.EMAIL_USER,
                'dawn@soulsticetarot.com'
            ),
            // Marina notification email with CC to dawn@soulsticetarot.com
            sendEmailWithResend(
                'info@soulsticetarot.com', 
                `New Booking of Same Day Express with your client: ${name}`,
                marinaEmailHtml,
                process.env.EMAIL_USER,
                'dawn@soulsticetarot.com'
            )
        ]);

        res.status(200).send({ success: true, message: "Email sent successfully with Resend!" });
        console.log("Emails sent successfully with Resend!");
    } catch (error) {
        console.error("Error sending emails with Resend:", error);
        res.status(500).send({ success: false, message: "Failed to send email.", error: error.message });
    }
});

// 8. Update the webhook to use Resend for tip notifications
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("=== WEBHOOK RECEIVED ===");
    const signature = req.headers['stripe-signature'];
  
    try {
      const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  
      console.log('Webhook event type:', event.type);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Processing completed checkout session:', session.id);
  
        // Find and update the booking status
        const booking = await Booking.findOne({ sessionId: session.id });
        if (booking) {
          booking.status = 'completed';
          await booking.save();
          console.log(`Booking ${booking.bookingId} marked as completed`);
          
          // Note: Emails are sent when customer fills out the booking form
          // The webhook only updates the booking status to 'completed'
          console.log('Booking status updated to completed. Customer will receive emails after filling out the form.');
        }

        // Find and update the tip status
        const tip = await Tip.findOne({ sessionId: session.id });
        console.log('Looking for tip with sessionId:', session.id);
        
        if (tip) {
          tip.status = 'completed';
          await tip.save();
          console.log(`Tip ${tip.tipId} marked as completed`);
          
          // Send email notification for tip using Resend
          console.log('Calling sendTipNotificationEmailWithResend...');
          await sendTipNotificationEmailWithResend(tip);
        } else {
          console.log('No tip found for sessionId:', session.id);
        }
      }
  
      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send('Webhook Error');
    }
});

// 9. Add environment debug endpoint
app.get('/api/debug-env', (req, res) => {
  res.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      RENDER_APP_NAME: process.env.RENDER_APP_NAME,
      isTestMode: isTestMode,
      stripeKey: stripeKey?.substring(0, 12) + '...',
      resendConfigured: !!process.env.RESEND_API_KEY,
      emailUser: process.env.EMAIL_USER,
      mongoConfigured: !!process.env.MONGO_URL
    }
  });
});

// 10. Add a test endpoint for Resend
app.post('/api/test-resend', async (req, res) => {
  try {
    console.log('Testing Resend email configuration...');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'NOT SET');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    
    const result = await sendEmailWithResend(
      'test@soulsticetarot.com',
      'Resend Test Email',
      '<h1>Resend Test Successful!</h1><p>Your Resend integration is working properly.</p>',
      process.env.EMAIL_USER,
      'dawn@soulsticetarot.com'
    );

    res.status(200).json({ success: true, message: 'Resend test email sent successfully!', data: result });
  } catch (error) {
    console.error('Resend test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Add a simple emergency booking test endpoint
app.post('/api/test-emergency-booking', async (req, res) => {
  try {
    console.log('Testing Emergency Booking email...');
    
    const testBooking = {
      name: 'Test User',
      email: 'test@soulsticetarot.com',
      phone: '555-1234',
      message: 'This is a test emergency booking',
      readingType: 'Emergency Reading'
    };

    const clientEmailHtml = getClientEmailTemplate(
      testBooking.name, 
      testBooking.email, 
      testBooking.phone, 
      testBooking.message, 
      testBooking.readingType
    );
    
    const marinaEmailHtml = getMarinaEmailTemplate(
      testBooking.name, 
      testBooking.email, 
      testBooking.phone, 
      testBooking.message, 
      testBooking.readingType
    );

    // Send test emails
    await Promise.all([
      sendEmailWithResend(
        testBooking.email, 
        'Test Emergency Booking Confirmation',
        clientEmailHtml,
        process.env.EMAIL_USER,
        'dawn@soulsticetarot.com'
      ),
      sendEmailWithResend(
        'info@soulsticetarot.com', 
        'Test Emergency Booking Notification',
        marinaEmailHtml,
        process.env.EMAIL_USER,
        'dawn@soulsticetarot.com'
      )
    ]);

    res.status(200).json({ success: true, message: 'Emergency booking test emails sent successfully!' });
  } catch (error) {
    console.error('Emergency booking test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Add a test endpoint for the complete email templates
app.post('/api/test-email-templates', async (req, res) => {
  try {
    console.log('Testing complete email templates with Resend...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      message: 'This is a test message for email template testing.',
      readingtype: 'General Reading'
    };

    const clientEmailHtml = getClientEmailTemplate(
      testData.name, 
      testData.email, 
      testData.phone, 
      testData.message, 
      testData.readingtype
    );

    const marinaEmailHtml = getMarinaEmailTemplate(
      testData.name, 
      testData.email, 
      testData.phone, 
      testData.message, 
      testData.readingtype
    );

    // Send test emails
    await Promise.all([
      sendEmailWithResend(
        testData.email,
        'Test Client Email Template',
        clientEmailHtml,
        process.env.EMAIL_USER,
        'dawn@soulsticetarot.com'
      ),
      sendEmailWithResend(
        'info@soulsticetarot.com',
        'Test Marina Email Template',
        marinaEmailHtml,
        process.env.EMAIL_USER,
        'dawn@soulsticetarot.com'
      )
    ]);

    res.status(200).json({ 
      success: true, 
      message: 'Email templates test completed successfully!',
      testData 
    });
  } catch (error) {
    console.error('Email templates test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Update your tip notification tests to use Resend
app.post('/api/test-tip-email', async (req, res) => {
  try {
    const testTip = {
      tipId: 'test-tip-123',
      amount: 25,
      message: 'Test message from debugging',
      createdAt: new Date(),
      status: 'completed'
    };
    
    console.log('Testing tip email function with Resend...');
    await sendTipNotificationEmailWithResend(testTip);
    
    res.status(200).json({ success: true, message: 'Test email sent with Resend' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get booking details by booking ID
app.get('/api/booking/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findOne({ bookingId: id });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to get all bookings
app.get('/api/bookings', async (req, res) => {

    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update booking status
app.patch('/api/booking/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await Booking.findOneAndUpdate(
            { bookingId: id },
            { status },        { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//price routes for getall and update prices
app.use('/api/prices', priceRoutes);


//mailjet integration for newsletter

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_V3_KEY;  // Use your Brevo API key here

const apiInstance = new SibApiV3Sdk.ContactsApi();

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;

    apiInstance.createContact(createContact).then(data => {
        res.status(200).json({ message: 'Successfully subscribed!' });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Subscription failed.' });
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    
    console.log(`Server is running at http://localhost:${PORT}`);
});

