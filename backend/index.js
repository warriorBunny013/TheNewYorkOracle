import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from 'stripe';
import mongoose, { isValidObjectId } from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import crypto from 'crypto';
import Booking from './models/Booking.js';
import Admin from './routes/Admin.js';
import AdminPanel from './routes/AdminPanel.js';
import AdminModel from './models/Admin.js';
import authMiddleware from './middleware/auth.js';
import routes from "./routes/ReviewsRoutes.js";
import priceRoutes from './routes/PriceRoutes.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import nodemailer from 'nodemailer';
// import { transporter,sendEmail } from "./controllers/EmailServiceController.js";


dotenv.config();

// Debug environment variables
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'NOT SET');
console.log('STRIPE_SECRET:', process.env.STRIPE_SECRET ? 'Set' : 'NOT SET');

// Set fallback JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-for-development-only';
  console.log('WARNING: Using fallback JWT_SECRET. Set JWT_SECRET in production!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET);
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
      ? ["https://www.soulsticetarot.com", "https://soulsticetarot.com"]
      : ["http://localhost:3000", "http://localhost:8080"],
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



// Stripe Checkout Session Endpoint (Express reading payment)
app.post('/api/create-checkout-session', async (req, res) => {
    const { productName,userPrice } = req.body;

    // Validate the presence of required fields
    // if (!userName || !userEmail) {
    //     return res.status(400).json({ error: "userName and userEmail are required" });
    // }
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    // Extract appointmentid with improved error handling
    // let appointmentid;
    // try {
    //     if (products[0].alt === 'mentorship') {
    //         appointmentid = 4;
    //     } else {
    //         const title = products[0].title;
    //         const durationMatch = title.match(/\d+/);

    //         if (!durationMatch) {
    //             throw new Error(`No numeric value found in title: ${title}`);
    //         }

    //         const duration = parseInt(durationMatch[0], 10);
    //         switch (duration) {
    //             case 10:
    //                 appointmentid = 1;
    //                 break;
    //             case 30:
    //                 appointmentid = 2;
    //                 break;
    //             case 45:
    //                 appointmentid = 3;
    //                 break;
    //             default:
    //                 throw new Error(`Unexpected duration value: ${duration}`);
    //         }
    //     }
    // } catch (error) {
    //     console.error(`Error extracting appointmentid: ${error.message}`);
    //     return res.status(400).json({ error: `Invalid product title format: ${products[0].title}` });
    // }

    // const lineItems = products.map(product => ({
    //     price_data: {
    //         currency: 'usd',
    //         product_data: { name: product.title },
    //         unit_amount: Math.round(parseFloat(product.price * 100)), // Stripe expects amounts in cents
    //     },
    //     quantity: 1,
    // }));
    // const totalAmount = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount, 0);

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

app.post('/api/create-checkout-session-tip', async (req, res) => {
  const { productName,userPrice } = req.body;

  // Validate the presence of required fields
  // if (!userName || !userEmail) {
  //     return res.status(400).json({ error: "userName and userEmail are required" });
  // }
  
  const bookingId = crypto.randomBytes(16).toString('hex');

  // Extract appointmentid with improved error handling
  // let appointmentid;
  // try {
  //     if (products[0].alt === 'mentorship') {
  //         appointmentid = 4;
  //     } else {
  //         const title = products[0].title;
  //         const durationMatch = title.match(/\d+/);

  //         if (!durationMatch) {
  //             throw new Error(`No numeric value found in title: ${title}`);
  //         }

  //         const duration = parseInt(durationMatch[0], 10);
  //         switch (duration) {
  //             case 10:
  //                 appointmentid = 1;
  //                 break;
  //             case 30:
  //                 appointmentid = 2;
  //                 break;
  //             case 45:
  //                 appointmentid = 3;
  //                 break;
  //             default:
  //                 throw new Error(`Unexpected duration value: ${duration}`);
  //         }
  //     }
  // } catch (error) {
  //     console.error(`Error extracting appointmentid: ${error.message}`);
  //     return res.status(400).json({ error: `Invalid product title format: ${products[0].title}` });
  // }

  // const lineItems = products.map(product => ({
  //     price_data: {
  //         currency: 'usd',
  //         product_data: { name: product.title },
  //         unit_amount: Math.round(parseFloat(product.price * 100)), // Stripe expects amounts in cents
  //     },
  //     quantity: 1,
  // }));
  // const totalAmount = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount, 0);

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          // line_items: lineItems,
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
    console.log("POST WEBHOOK MEIN HOON!!!")
    const signature = req.headers['stripe-signature'];
  
    try {
      const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
  
        // Find and update the booking status
        const booking = await Booking.findOne({ sessionId: session.id });
        if (booking) {
          booking.status = 'completed';
          await booking.save();
          console.log(`Booking ${booking.bookingId} marked as completed`);
        }
        
      }
  
      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send('Webhook Error');
    }
  });
  


// SENDING EMAILS

// POST route for sending emails

app.post("/sendemail", async (req, res) => {
    
    const { name, email, phone, message,readingtype } = req.body;
//    console.log("check!");
// Input validation (example: you can customize this as needed)
if (!name || !email || !message || !readingtype) {
  return res.status(400).send({ success: false, message: "All fields are required." });
}
    try {
      // Nodemailer transport configuration
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS, // Your Gmail app password
        },
//         port: 25, // Postfix uses port 25
//   host: 'localhost',
  tls: {
    rejectUnauthorized: false
  },
      });
        
      // Email content to the client
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`, // Recipient email
        cc: "dawn@soulsticetarot.com", // CC recipient
        subject: "Booking Confirmation with Marina",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
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
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                .header-content { position: relative; z-index: 1; }
                .header h1 { 
                    color: white; 
                    margin: 0; 
                    font-size: 32px; 
                    font-weight: 300;
                    letter-spacing: 1px;
                }
                .logo { 
                    max-width: 120px; 
                    margin-bottom: 20px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                }
                .content { 
                    padding: 50px 40px; 
                    background: #ffffff;
                }
                .success-section {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .success-icon { 
                    width: 80px; 
                    height: 80px; 
                    background: linear-gradient(135deg, #28a745, #20c997); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin: 0 auto 25px;
                    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                }
                .success-icon svg { 
                    width: 35px; 
                    height: 35px; 
                    color: white;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
                }
                .main-title {
                    color: #2c3e50;
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .subtitle {
                    color: #6c757d;
                    font-size: 16px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .greeting {
                    color: #2c3e50;
                    font-size: 18px;
                    margin-bottom: 25px;
                    line-height: 1.6;
                }
                .info-box { 
                    background: linear-gradient(135deg, #e3f2fd, #f3e5f5); 
                    border-left: 4px solid #667eea; 
                    padding: 20px; 
                    margin: 25px 0; 
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
                }
                .info-box strong {
                    color: #495057;
                    font-weight: 600;
                }
                .booking-details { 
                    background: #f8f9fa; 
                    border-radius: 12px; 
                    padding: 30px; 
                    margin: 30px 0;
                    border: 1px solid #e9ecef;
                }
                .booking-details h3 { 
                    color: #2c3e50; 
                    margin-bottom: 20px; 
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .detail-row { 
                    display: flex; 
                    margin-bottom: 15px;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-row:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }
                .detail-label { 
                    font-weight: 600; 
                    color: #495057; 
                    min-width: 140px;
                    font-size: 14px;
                }
                .detail-value { 
                    color: #6c757d;
                    font-size: 14px;
                    flex: 1;
                }
                .next-steps {
                    margin: 35px 0;
                }
                .next-steps h3 {
                    color: #2c3e50;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .steps-list {
                    list-style: none;
                    padding: 0;
                }
                .steps-list li {
                    color: #6c757d;
                    line-height: 1.8;
                    margin-bottom: 12px;
                    padding-left: 25px;
                    position: relative;
                    font-size: 15px;
                }
                .steps-list li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: #28a745;
                    font-weight: bold;
                    font-size: 16px;
                }
                .cta-section {
                    text-align: center;
                    margin: 40px 0;
                    padding: 30px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 12px;
                }
                .cta-button { 
                    display: inline-block; 
                    background: linear-gradient(135deg, #667eea, #764ba2); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    margin: 20px 0;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                .footer { 
                    background: #2c3e50; 
                    padding: 30px; 
                    text-align: center;
                    color: #ffffff;
                }
                .footer p { 
                    margin: 8px 0; 
                    color: #bdc3c7;
                    font-size: 14px;
                }
                .footer a {
                    color: #667eea;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                .copyright {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #34495e;
                    font-size: 12px;
                    color: #95a5a6;
                }
                @media (max-width: 600px) {
                    .content { padding: 30px 20px; }
                    .header { padding: 30px 20px; }
                    .detail-row { flex-direction: column; gap: 5px; }
                    .detail-label { min-width: auto; }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="header-content">
                        <img src="https://i.ibb.co/wNrZWpRs/logo.png" alt="Marina's Logo" class="logo">
                        <h1>Booking Confirmation</h1>
                    </div>
                </div>
                
                <div class="content">
                    <div class="success-section">
                        <h2 class="main-title">Booking Confirmed!</h2>
                        <p class="subtitle">Your spiritual journey with Marina begins now</p>
                    </div>
                    
                    <p class="greeting">Dear <strong>${name}</strong>,</p>
                    
                    <p class="greeting">Thank you for choosing Marina's professional tarot reading services! Your booking has been successfully received and confirmed. I'm excited to work with you on your spiritual journey and provide you with the guidance you seek.</p>
                    
                    <div class="info-box">
                        <strong>📧 Important:</strong> All further communication regarding your reading will be sent to this email address. Please ensure you check your inbox regularly and add our email to your contacts to avoid missing important updates.
                    </div>
                    
                    <div class="booking-details">
                        <h3>📋 Booking Details</h3>
                        <div class="detail-row">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value">${name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${phone || "Not provided"}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Reading Type:</span>
                            <span class="detail-value">${readingtype}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Your Message:</span>
                            <span class="detail-value">${message}</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>🌟 What to Expect Next</h3>
                        <ul class="steps-list">
                            <li>You'll receive a detailed email within 24-72 hours with specific instructions for your reading</li>
                            <li>For live readings: Scheduling information will be provided based on Marina's availability</li>
                            <li>For pre-recorded readings: Your personalized reading will be delivered to this email address</li>
                            <li>If you have any questions, feel free to reply to this email</li>
                        </ul>
                    </div>
                    
                    <div class="cta-section">
                        <a href="https://www.soulsticetarot.com" class="cta-button">Visit Our Website</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Marina Smargiannakis</strong></p>
                    <p>The New York Oracle™</p>
                    <p>Email: info@soulsticetarot.com</p>
                    <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
                    <div class="copyright">
                        © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
      };


      //Email content to Marina(Service provider)
      const mailOptions1 = {
        from: `${email}`,
        to: process.env.EMAIL_USER, // Recipient email
        cc: "dawn@soulsticetarot.com", // CC recipient
        subject: `New Booking of Same Day Express with your client: ${name}`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking Notification</title>
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
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                .header-content { position: relative; z-index: 1; }
                .header h1 { 
                    color: white; 
                    margin: 0; 
                    font-size: 32px; 
                    font-weight: 300;
                    letter-spacing: 1px;
                }
                .logo { 
                    max-width: 120px; 
                    margin-bottom: 20px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                }
                .content { 
                    padding: 50px 40px; 
                    background: #ffffff;
                }
                .notification-section {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .notification-icon { 
                    width: 80px; 
                    height: 80px; 
                    background: linear-gradient(135deg, #ffc107, #ff9800); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin: 0 auto 25px;
                    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
                }
                .notification-icon svg { 
                    width: 35px; 
                    height: 35px; 
                    color: white;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
                }
                .main-title {
                    color: #2c3e50;
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .subtitle {
                    color: #6c757d;
                    font-size: 16px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .priority-box { 
                    background: linear-gradient(135deg, #fff3cd, #ffeaa7); 
                    border-left: 4px solid #ffc107; 
                    padding: 20px; 
                    margin: 25px 0; 
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
                }
                .priority-box strong {
                    color: #495057;
                    font-weight: 600;
                }
                .booking-details { 
                    background: #f8f9fa; 
                    border-radius: 12px; 
                    padding: 30px; 
                    margin: 30px 0;
                    border: 1px solid #e9ecef;
                }
                .booking-details h3 { 
                    color: #2c3e50; 
                    margin-bottom: 20px; 
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .detail-row { 
                    display: flex; 
                    margin-bottom: 15px;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-row:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }
                .detail-label { 
                    font-weight: 600; 
                    color: #495057; 
                    min-width: 140px;
                    font-size: 14px;
                }
                .detail-value { 
                    color: #6c757d;
                    font-size: 14px;
                    flex: 1;
                }
                .next-steps {
                    margin: 35px 0;
                }
                .next-steps h3 {
                    color: #2c3e50;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .steps-list {
                    list-style: none;
                    padding: 0;
                }
                .steps-list li {
                    color: #6c757d;
                    line-height: 1.8;
                    margin-bottom: 12px;
                    padding-left: 25px;
                    position: relative;
                    font-size: 15px;
                }
                .steps-list li::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: #667eea;
                    font-weight: bold;
                    font-size: 16px;
                }
                .status-box {
                    background: linear-gradient(135deg, #d4edda, #c3e6cb);
                    border-left: 4px solid #28a745;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
                }
                .status-box strong {
                    color: #155724;
                    font-weight: 600;
                }
                .footer { 
                    background: #2c3e50; 
                    padding: 30px; 
                    text-align: center;
                    color: #ffffff;
                }
                .footer p { 
                    margin: 8px 0; 
                    color: #bdc3c7;
                    font-size: 14px;
                }
                .footer a {
                    color: #667eea;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                .copyright {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #34495e;
                    font-size: 12px;
                    color: #95a5a6;
                }
                @media (max-width: 600px) {
                    .content { padding: 30px 20px; }
                    .header { padding: 30px 20px; }
                    .detail-row { flex-direction: column; gap: 5px; }
                    .detail-label { min-width: auto; }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="header-content">
                        <img src="https://i.postimg.cc/NFy9qjgS/Group-1991.png" alt="Marina's Logo" class="logo">
                        <h1>New Booking Notification</h1>
                    </div>
                </div>
                
                <div class="content">
                    <div class="notification-section">
                        <div class="notification-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        
                        <h2 class="main-title">New Same Day Express Booking</h2>
                        <p class="subtitle">A new client has completed their booking</p>
                    </div>
                    
                    <div class="priority-box">
                        <strong>⚡ Action Required:</strong> A new client has completed their booking and form submission. Please review the details below and process their reading request within 24-72 hours.
                    </div>
                    
                    <div class="booking-details">
                        <h3>📋 Client Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Client Name:</span>
                            <span class="detail-value">${name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email Address:</span>
                            <span class="detail-value">${email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone Number:</span>
                            <span class="detail-value">${phone || "Not provided"}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Reading Type:</span>
                            <span class="detail-value">${readingtype}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Client Message:</span>
                            <span class="detail-value">${message}</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>🎯 Next Steps</h3>
                        <ul class="steps-list">
                            <li>Review the client's message and reading type carefully</li>
                            <li>For pre-recorded readings: Prepare and deliver within 24-72 hours</li>
                            <li>For live readings: Contact client to schedule the session</li>
                            <li>Send confirmation email to client with specific instructions</li>
                            <li>Update booking status in your system</li>
                        </ul>
                    </div>
                    
                    <div class="status-box">
                        <strong>✅ Status:</strong> This booking has been automatically confirmed. The client has already received a confirmation email with their booking details.
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Marina Smargiannakis</strong></p>
                    <p>The New York Oracle™</p>
                    <p>Email: info@soulsticetarot.com</p>
                    <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
                    <div class="copyright">
                        © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
      };
      
      // Send the email
       // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(mailOptions1),
    ]);
      res.status(200).send({ success: true, message: "Email sent successfully!" });
      console.log("check Try hainn!");
    } catch (error) {
        console.log("check catch!");
      res.status(500).send({ success: false, message: "Failed to send email.", error });
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

// const mailjetClient = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

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

    
    // const request = mailjetClient
    //     .post('contact', { version: 'v3' })
    //     .request({
    //         Email: email,
    //         IsExcludedFromCampaigns: false,
    //     });
        
    // request.then(result => {
    //     res.status(200).json({ message: 'Successfully subscribed!' });
    // })
    // .catch(err => {
    //     console.log(err.statusCode);
    //     res.status(500).json({ message: 'Subscription failed.' });
    // });
});

// PayPal OAuth token management - TEMPORARILY DISABLED
// let paypalAccessToken = null;
// let tokenExpiry = null;

// async function getPayPalAccessToken() {
//     // Check if we have a valid token
//     if (paypalAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
//         return paypalAccessToken;
//     }

//     try {
//         console.log('Getting new PayPal access token...');
        
//         const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID_LIVE}:${process.env.PAYPAL_CLIENT_SECRET_LIVE}`).toString('base64')}`
//             },
//             body: 'grant_type=client_credentials'
//         });

//         if (!response.ok) {
//             throw new Error(`PayPal OAuth failed: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();
//         paypalAccessToken = data.access_token;
//         tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
        
//         console.log('PayPal access token obtained successfully');
//         return paypalAccessToken;
//     } catch (error) {
//         console.error('PayPal OAuth error:', error);
//         throw error;
//     }
// }

// PayPal Checkout Session Endpoint (Express reading payment) - TEMPORARILY DISABLED
// app.post('/api/create-paypal-order', async (req, res) => {
//     const { productName, userPrice } = req.body;
    
//     const bookingId = crypto.randomBytes(16).toString('hex');

//     try {
//         console.log('Creating PayPal order for:', productName, userPrice);
        
//         // Check if PayPal credentials are set
//         if (!process.env.PAYPAL_CLIENT_ID_LIVE || !process.env.PAYPAL_CLIENT_SECRET_LIVE) {
//             console.error('PayPal credentials not configured');
//             return res.status(500).json({ error: 'PayPal not configured' });
//         }

//         const accessToken = await getPayPalAccessToken();
//         console.log('PayPal access token obtained');

//         const requestBody = {
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 reference_id: bookingId,
//                 description: productName,
//                 amount: {
//                     currency_code: 'USD',
//                     value: userPrice.toString()
//                 }
//             }],
//             application_context: {
//                 return_url: `${backendapi}/api/paypal-capture`,
//                 cancel_url: `${frontendapi}/cancelpayment`,
//                 brand_name: 'The New York Oracle',
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 shipping_preference: 'NO_SHIPPING'
//             }
//         };

//         console.log('PayPal request body:', JSON.stringify(requestBody, null, 2));

//         const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(requestBody)
//         });

//         console.log('PayPal API response status:', response.status);
        
//         const order = await response.json();
//         console.log('PayPal API response:', JSON.stringify(order, null, 2));

//         if (order.id) {
//             await Booking.create({
//                 bookingId,
//                 sessionId: order.id,
//                 productName,
//                 userPrice,
//                 currency: 'usd',
//                 status: 'pending',
//                 paymentMethod: 'paypal'
//             });

//             const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;
            
//             if (!approvalUrl) {
//                 console.error('No approval URL found in PayPal response:', order);
//                 throw new Error('PayPal order created but no approval URL received');
//             }
            
//             res.status(200).json({ 
//                 id: order.id,
//                 approvalUrl: approvalUrl
//             });
//             console.log("PayPal order created successfully!");
//         } else {
//             console.error('PayPal order creation failed:', order);
            
//             // Handle specific PayPal errors
//             if (order.error) {
//                 if (order.error.name === 'CURRENCY_NOT_SUPPORTED') {
//                     throw new Error('Currency not supported. Please contact support.');
//                 } else if (order.error.name === 'INVALID_REQUEST') {
//                     throw new Error('Invalid payment request. Please try again.');
//                 } else {
//                     throw new Error(`PayPal error: ${order.error.message || order.error.name}`);
//                 }
//             }
            
//             throw new Error(`Failed to create PayPal order: ${JSON.stringify(order)}`);
//         }
//     } catch (error) {
//         console.error('PayPal order creation error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// PayPal Checkout Session Endpoint (Tip payment) - TEMPORARILY DISABLED
// app.post('/api/create-paypal-order-tip', async (req, res) => {
//     const { productName, userPrice } = req.body;
    
//     const bookingId = crypto.randomBytes(16).toString('hex');

//     try {
//         console.log('Creating PayPal tip order for:', productName, userPrice);
        
//         // Check if PayPal credentials are set
//         if (!process.env.PAYPAL_CLIENT_ID_LIVE || !process.env.PAYPAL_CLIENT_SECRET_LIVE) {
//             console.error('PayPal credentials not configured');
//             return res.status(500).json({ error: 'PayPal not configured' });
//         }

//         const accessToken = await getPayPalAccessToken();
//         console.log('PayPal access token obtained for tip');

//         const requestBody = {
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 reference_id: bookingId,
//                 description: productName,
//                 amount: {
//                     currency_code: 'USD',
//                     value: userPrice.toString()
//                 }
//             }],
//             application_context: {
//                 return_url: `${backendapi}/api/paypal-tip-capture`,
//                 cancel_url: `${frontendapi}/cancelpayment`,
//                 brand_name: 'The New York Oracle',
//                 landing_page: 'BILLING',
//                 user_action: 'PAY_NOW',
//                 shipping_preference: 'NO_SHIPPING'
//             }
//         };

//         console.log('PayPal tip request body:', JSON.stringify(requestBody, null, 2));

//         const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(requestBody)
//         });

//         console.log('PayPal tip API response status:', response.status);
        
//         const order = await response.json();
//         console.log('PayPal tip API response:', JSON.stringify(order, null, 2));

//         if (order.id) {
//             await Booking.create({
//                 bookingId,
//                 sessionId: order.id,
//                 productName,
//                 userPrice,
//                 currency: 'usd',
//                 status: 'pending',
//                 paymentMethod: 'paypal'
//             });

//             const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;
            
//             if (!approvalUrl) {
//                 console.error('No approval URL found in PayPal tip response:', order);
//                 throw new Error('PayPal tip order created but no approval URL received');
//             }
            
//             res.status(200).json({ 
//                 id: order.id,
//                 approvalUrl: approvalUrl
//             });
//             console.log("PayPal tip order created successfully!");
//         } else {
//             console.error('PayPal tip order creation failed:', order);
            
//             // Handle specific PayPal errors
//             if (order.error) {
//                 if (order.error.name === 'CURRENCY_NOT_SUPPORTED') {
//                     throw new Error('Currency not supported. Please contact support.');
//                 } else if (order.error.name === 'INVALID_REQUEST') {
//                     throw new Error('Invalid payment request. Please try again.');
//                 } else {
//                     throw new Error(`PayPal error: ${order.error.message || order.error.name}`);
//                 }
//             }
            
//             throw new Error(`Failed to create PayPal tip order: ${JSON.stringify(order)}`);
//         }
//     } catch (error) {
//         console.error('PayPal tip order creation error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// PayPal payment capture endpoint - TEMPORARILY DISABLED
// app.get('/api/paypal-capture', async (req, res) => {
//     const { token, PayerID } = req.query;
    
//     try {
//         console.log('PayPal capture request:', { token, PayerID });
        
//         if (!token) {
//             console.error('No token provided for PayPal capture');
//             return res.redirect(`${frontendapi}/cancelpayment?error=no_token`);
//         }

//         const accessToken = await getPayPalAccessToken();
        
//         const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });

//         console.log('PayPal capture response status:', response.status);
        
//         const result = await response.json();
//         console.log('PayPal capture result:', JSON.stringify(result, null, 2));

//         if (result.status === 'COMPLETED') {
//             // Find the booking by PayPal order ID
//             const booking = await Booking.findOne({ sessionId: token });
            
//             if (booking) {
//                 // Update booking status
//                 booking.status = 'completed';
//                 booking.paymentMethod = 'paypal';
//                 await booking.save();
                
//                 console.log('PayPal payment completed successfully for booking:', booking.bookingId);
                
//                 // Redirect to booking form for express readings
//                 res.redirect(`${frontendapi}/book/${booking.bookingId}`);
//             } else {
//                 console.error('Booking not found for PayPal order:', token);
//                 res.redirect(`${frontendapi}/cancelpayment?error=booking_not_found`);
//             }
//         } else {
//             console.error('PayPal capture failed:', result);
//             res.redirect(`${frontendapi}/cancelpayment?error=capture_failed`);
//         }
//     } catch (error) {
//         console.error('PayPal capture error:', error);
//         res.redirect(`${frontendapi}/cancelpayment?error=capture_error`);
//     }
// });

// PayPal tip payment capture endpoint - TEMPORARILY DISABLED
// app.get('/api/paypal-tip-capture', async (req, res) => {
//     const { token, PayerID } = req.query;
    
//     try {
//         console.log('PayPal tip capture request:', { token, PayerID });
        
//         if (!token) {
//             console.error('No token provided for PayPal tip capture');
//             return res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=no_token`);
//         }

//         const accessToken = await getPayPalAccessToken();
        
//         const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });

//         console.log('PayPal tip capture response status:', response.status);
        
//         const result = await response.json();
//         console.log('PayPal tip capture result:', JSON.stringify(result, null, 2));

//         if (result.status === 'COMPLETED') {
//             // Find the booking by PayPal order ID
//             const booking = await Booking.findOne({ sessionId: token });
            
//             if (booking) {
//                 // Update booking status
//                 booking.status = 'completed';
//                 booking.paymentMethod = 'paypal';
//                 await booking.save();
                
//                 console.log('PayPal tip payment completed successfully for booking:', booking.bookingId);
                
//                 // Redirect to frontend with success parameters
//                 res.redirect(`${frontendapi}/?payment=success&method=paypal&type=tip&amount=${booking.userPrice}`);
//             } else {
//                 console.error('Booking not found for PayPal tip order:', token);
//                 res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=booking_not_found`);
//             }
//         } else {
//             console.error('PayPal tip capture failed:', result);
//             res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=capture_failed`);
//         }
//     } catch (error) {
//         console.error('PayPal tip capture error:', error);
//         res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=capture_error`);
//     }
// });

// PayPal test endpoint - TEMPORARILY DISABLED
// app.get('/api/test-paypal', async (req, res) => {
//     try {
//         // Check if PayPal credentials are set
//         if (!process.env.PAYPAL_CLIENT_ID_LIVE || !process.env.PAYPAL_CLIENT_SECRET_LIVE) {
//             console.error('PayPal credentials not configured');
//             return res.status(500).json({ success: false, error: 'PayPal credentials not configured' });
//         }

//         // Try to get an access token
//         const accessToken = await getPayPalAccessToken();
        
//         if (accessToken) {
//             console.log('PayPal configuration is working');
//             res.json({ success: true, message: 'PayPal is configured and working' });
//         } else {
//             console.error('Failed to get PayPal access token');
//             res.status(500).json({ success: false, error: 'Failed to get PayPal access token' });
//         }
//     } catch (error) {
//         console.error('PayPal test error:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    
    console.log(`Server is running at http://localhost:${PORT}`);
});

