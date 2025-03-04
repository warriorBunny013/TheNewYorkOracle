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
import authMiddleware from './middleware/auth.js';
import routes from "./routes/ReviewsRoutes.js";
import priceRoutes from './routes/PriceRoutes.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import nodemailer from 'nodemailer';
// import { transporter,sendEmail } from "./controllers/EmailServiceController.js";


dotenv.config();

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
    origin:["https://www.soulsticetarot.com", "http://localhost:3000"],
    methods:["POST","GET","PATCH","PUT","DELETE"],
    credentials:true
  }));

  const frontendapi = process.env.NODE_ENV === "production"
  ? "https://www.soulsticetarot.com"
  : "http://localhost:3000";

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

// Routes
app.use("/api", routes);
app.use("/api/admin", Admin);
app.use("/api/adminpanel", authMiddleware, AdminPanel);



// Stripe Checkout Session Endpoint
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
      <p>Thank you for choosing Marina's service! Your booking has been successfully received, and I’ll get back to you soon with more details. All further communication will happen through this email address.</p>

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
            { status },
            { new: true }
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

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    
    console.log(`Server is running at http://localhost:${PORT}`);
});

