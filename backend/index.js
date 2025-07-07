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
// app.use((req, res, next) => {
//     if (req.originalUrl === '/webhook') {
//         next();
//     } else {
//         express.json()(req, res, next);
//     }
// });

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
  ? "https://www.soulsticetarot.com"
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
      res.status(200).json({message:'Booking founded!'});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Webhook to handle payment success
// app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//     console.log("POST WEBHOOK MEIN HOON!!!")
//     const signature = req.headers['stripe-signature'];
  
//     try {
//       const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  
//       if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;
  
//         // Extract metadata (input fields)
//         // const { userName, userEmail, userMessage,productName  } = session.metadata;
  

//         // Send email
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false, // true for 465, false for 587
//           auth: {
//             user: 'mona23sonai@gmail.com',
//             pass: 'bgxmnblfaimvysze',
//           },
//         });
//         transporter.verify((error, success) => {
//             if (error) console.error(error);
//             else console.log("Server is ready to send emails");
//         });
        
//         const mailOptions = {
//           from: 'mona23sonai@gmail.com',
//           to: 'uditi013@gmail.com',
//           subject: `New Booking Request of`,
//           text: `Name: Email: Message: `,
//         };
  
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully.");
        
//       }
  
//       res.status(200).send('Webhook received');
//     } catch (error) {
//       console.error('Webhook error:', error.message);
//       res.status(400).send('Webhook Error');
//     }
//   });
  


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
        subject: "Booking Confirmation with Marina",
        html: `
         <div style="background-color: #000; color: #fff; font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 600px; margin: auto; border-radius: 10px;">
      <!-- Logo -->
      <div style="margin-bottom: 20px;">
        <img src="https://i.postimg.cc/NFy9qjgS/Group-1991.png" alt="Marina's Logo" style="max-width: 150px; margin: auto;">
      </div>

       <!-- Booking Confirmation -->
      <h1 style="color: #4CAF50; font-size: 32px; margin: 20px 0;">Booking Confirmed!</h1>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for choosing Marina's service! Your booking has been successfully received, and I'll get back to you soon with more details. All further communication will happen through this email address.</p>

      <!-- Booking Details -->
      <div style="background-color: #1c1c1c; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <h3 style="margin-bottom: 10px; font-size: 18px; ">Booking Details:</h3>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px; line-height: 1.8;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
          <li><strong>Message:</strong> ${message}</li>
          <li><strong>Reading Type:</strong> ${readingtype}</li>
          </ul>
      </div>

      <!-- Additional Info -->
      <p>If you have any questions or need to make changes to your booking, feel free to reply to this email.</p>
      <p>Visit our website: <a href="https://www.soulsticetarot.com" style="text-decoration: none;">https://www.soulsticetarot.com</a></p>

      <!-- Footer -->
      <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px; font-size: 14px;">
        <p>© 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.</p>
      </div>
    </div>
        `,
      };


      //Email content to Marina(Service provider)
      const mailOptions1 = {
        from: `${email}`,
        to: process.env.EMAIL_USER, // Recipient email
        subject: `New Booking of Same Day Express with your client: ${name}`,
        html: `
         <div style="background-color: #000; color: #fff; font-family: Arial, sans-serif; padding: 20px; text-align: center; max-width: 600px; margin: auto; border-radius: 10px;">
      <!-- Logo -->
      <div style="margin-bottom: 20px;">
        <img src="https://i.postimg.cc/NFy9qjgS/Group-1991.png" alt="Marina's Logo" style="max-width: 150px; margin: auto;">
      </div>

       <!-- Booking Confirmation -->
      <h1 style="color: #4CAF50; font-size: 32px; margin: 20px 0;">New Booking Confirmed!</h1>
      <!-- Booking Details -->
      <div style="background-color: #1c1c1c; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <h3 style="margin-bottom: 10px; font-size: 18px; ">Order Details:</h3>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px; line-height: 1.8;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
           <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
          <li><strong>Message:</strong> ${message}</li>
          <li><strong>Reading Type:</strong> ${readingtype}</li>
          </ul>
      </div>

      <p></p>
    
      <!-- Footer -->
      <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px; font-size: 14px;">
        <p>© 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.</p>
      </div>
    </div>
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

// PayPal OAuth token management
let paypalAccessToken = null;
let tokenExpiry = null;

async function getPayPalAccessToken() {
    // Check if we have a valid token
    if (paypalAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return paypalAccessToken;
    }

    try {
        console.log('Getting new PayPal access token...');
        
        const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID_LIVE}:${process.env.PAYPAL_CLIENT_SECRET_LIVE}`).toString('base64')}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`PayPal OAuth failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        paypalAccessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
        
        console.log('PayPal access token obtained successfully');
        return paypalAccessToken;
    } catch (error) {
        console.error('PayPal OAuth error:', error);
        throw error;
    }
}

// PayPal Checkout Session Endpoint (Express reading payment)
app.post('/api/create-paypal-order', async (req, res) => {
    const { productName, userPrice } = req.body;
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    try {
        console.log('Creating PayPal order for:', productName, userPrice);
        
        // Check if PayPal credentials are set
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            console.error('PayPal credentials not configured');
            return res.status(500).json({ error: 'PayPal not configured' });
        }

        const accessToken = await getPayPalAccessToken();
        console.log('PayPal access token obtained');

        const requestBody = {
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: bookingId,
                description: productName,
                amount: {
                    currency_code: 'USD',
                    value: userPrice.toString()
                }
            }],
            application_context: {
                return_url: `${backendapi}/api/paypal-capture`,
                cancel_url: `${frontendapi}/cancelpayment`,
                brand_name: 'The New York Oracle',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                shipping_preference: 'NO_SHIPPING'
            }
        };

        console.log('PayPal request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('PayPal API response status:', response.status);
        
        const order = await response.json();
        console.log('PayPal API response:', JSON.stringify(order, null, 2));

        if (order.id) {
            await Booking.create({
                bookingId,
                sessionId: order.id,
                productName,
                userPrice,
                currency: 'usd',
                status: 'pending',
                paymentMethod: 'paypal'
            });

            const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;
            
            if (!approvalUrl) {
                console.error('No approval URL found in PayPal response:', order);
                throw new Error('PayPal order created but no approval URL received');
            }
            
            res.status(200).json({ 
                id: order.id,
                approvalUrl: approvalUrl
            });
            console.log("PayPal order created successfully!");
        } else {
            console.error('PayPal order creation failed:', order);
            
            // Handle specific PayPal errors
            if (order.error) {
                if (order.error.name === 'CURRENCY_NOT_SUPPORTED') {
                    throw new Error('Currency not supported. Please contact support.');
                } else if (order.error.name === 'INVALID_REQUEST') {
                    throw new Error('Invalid payment request. Please try again.');
                } else {
                    throw new Error(`PayPal error: ${order.error.message || order.error.name}`);
                }
            }
            
            throw new Error(`Failed to create PayPal order: ${JSON.stringify(order)}`);
        }
    } catch (error) {
        console.error('PayPal order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PayPal Checkout Session Endpoint (Tip payment)
app.post('/api/create-paypal-order-tip', async (req, res) => {
    const { productName, userPrice } = req.body;
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    try {
        console.log('Creating PayPal tip order for:', productName, userPrice);
        
        // Check if PayPal credentials are set
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            console.error('PayPal credentials not configured');
            return res.status(500).json({ error: 'PayPal not configured' });
        }

        const accessToken = await getPayPalAccessToken();
        console.log('PayPal access token obtained for tip');

        const requestBody = {
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: bookingId,
                description: productName,
                amount: {
                    currency_code: 'USD',
                    value: userPrice.toString()
                }
            }],
            application_context: {
                return_url: `${backendapi}/api/paypal-tip-capture`,
                cancel_url: `${frontendapi}/cancelpayment`,
                brand_name: 'The New York Oracle',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                shipping_preference: 'NO_SHIPPING'
            }
        };

        console.log('PayPal tip request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('PayPal tip API response status:', response.status);
        
        const order = await response.json();
        console.log('PayPal tip API response:', JSON.stringify(order, null, 2));

        if (order.id) {
            await Booking.create({
                bookingId,
                sessionId: order.id,
                productName,
                userPrice,
                currency: 'usd',
                status: 'pending',
                paymentMethod: 'paypal'
            });

            const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;
            
            if (!approvalUrl) {
                console.error('No approval URL found in PayPal tip response:', order);
                throw new Error('PayPal tip order created but no approval URL received');
            }
            
            res.status(200).json({ 
                id: order.id,
                approvalUrl: approvalUrl
            });
            console.log("PayPal tip order created successfully!");
        } else {
            console.error('PayPal tip order creation failed:', order);
            
            // Handle specific PayPal errors
            if (order.error) {
                if (order.error.name === 'CURRENCY_NOT_SUPPORTED') {
                    throw new Error('Currency not supported. Please contact support.');
                } else if (order.error.name === 'INVALID_REQUEST') {
                    throw new Error('Invalid payment request. Please try again.');
                } else {
                    throw new Error(`PayPal error: ${order.error.message || order.error.name}`);
                }
            }
            
            throw new Error(`Failed to create PayPal tip order: ${JSON.stringify(order)}`);
        }
    } catch (error) {
        console.error('PayPal tip order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PayPal payment capture endpoint
app.get('/api/paypal-capture', async (req, res) => {
    const { token, PayerID } = req.query;
    
    try {
        console.log('PayPal capture request:', { token, PayerID });
        
        if (!token) {
            console.error('No token provided for PayPal capture');
            return res.redirect(`${frontendapi}/cancelpayment?error=no_token`);
        }

        const accessToken = await getPayPalAccessToken();
        
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('PayPal capture response status:', response.status);
        
        const result = await response.json();
        console.log('PayPal capture result:', JSON.stringify(result, null, 2));

        if (result.status === 'COMPLETED') {
            // Find the booking by PayPal order ID
            const booking = await Booking.findOne({ sessionId: token });
            
            if (booking) {
                // Update booking status
                booking.status = 'completed';
                booking.paymentMethod = 'paypal';
                await booking.save();
                
                console.log('PayPal payment completed successfully for booking:', booking.bookingId);
                
                // Redirect to booking form for express readings
                res.redirect(`${frontendapi}/book/${booking.bookingId}`);
            } else {
                console.error('Booking not found for PayPal order:', token);
                res.redirect(`${frontendapi}/cancelpayment?error=booking_not_found`);
            }
        } else {
            console.error('PayPal capture failed:', result);
            res.redirect(`${frontendapi}/cancelpayment?error=capture_failed`);
        }
    } catch (error) {
        console.error('PayPal capture error:', error);
        res.redirect(`${frontendapi}/cancelpayment?error=capture_error`);
    }
});

// PayPal tip payment capture endpoint
app.get('/api/paypal-tip-capture', async (req, res) => {
    const { token, PayerID } = req.query;
    
    try {
        console.log('PayPal tip capture request:', { token, PayerID });
        
        if (!token) {
            console.error('No token provided for PayPal tip capture');
            return res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=no_token`);
        }

        const accessToken = await getPayPalAccessToken();
        
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('PayPal tip capture response status:', response.status);
        
        const result = await response.json();
        console.log('PayPal tip capture result:', JSON.stringify(result, null, 2));

        if (result.status === 'COMPLETED') {
            // Find the booking by PayPal order ID
            const booking = await Booking.findOne({ sessionId: token });
            
            if (booking) {
                // Update booking status
                booking.status = 'completed';
                booking.paymentMethod = 'paypal';
                await booking.save();
                
                console.log('PayPal tip payment completed successfully for booking:', booking.bookingId);
                
                // Redirect to frontend with success parameters
                res.redirect(`${frontendapi}/?payment=success&method=paypal&type=tip&amount=${booking.userPrice}`);
            } else {
                console.error('Booking not found for PayPal tip order:', token);
                res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=booking_not_found`);
            }
        } else {
            console.error('PayPal tip capture failed:', result);
            res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=capture_failed`);
        }
    } catch (error) {
        console.error('PayPal tip capture error:', error);
        res.redirect(`${frontendapi}/?payment=failed&method=paypal&type=tip&error=capture_error`);
    }
});

// PayPal test endpoint
app.get('/api/test-paypal', async (req, res) => {
    try {
        // Check if PayPal credentials are set
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            console.error('PayPal credentials not configured');
            return res.status(500).json({ success: false, error: 'PayPal credentials not configured' });
        }

        // Try to get an access token
        const accessToken = await getPayPalAccessToken();
        
        if (accessToken) {
            console.log('PayPal configuration is working');
            res.json({ success: true, message: 'PayPal is configured and working' });
        } else {
            console.error('Failed to get PayPal access token');
            res.status(500).json({ success: false, error: 'Failed to get PayPal access token' });
        }
    } catch (error) {
        console.error('PayPal test error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    
    console.log(`Server is running at http://localhost:${PORT}`);
});

