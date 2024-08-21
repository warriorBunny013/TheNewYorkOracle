import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from 'stripe';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import crypto from 'crypto';
import Booking from './models/Booking.js';
import Admin from './routes/Admin.js';
import AdminPanel from './routes/AdminPanel.js';
import authMiddleware from './middleware/auth.js';
import routes from "./routes/ReviewsRoutes.js";
import priceRoutes from './routes/PriceRoutes.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin:["https://newyorkfrontend.vercel.app"],
    methods:["POST","GET","PATCH","PUT","DELETE"],
    credentials:true
  }));



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
   
app.get("/home", (req, res) => {
    res.status(200).json({ message: "I requested for home", success: true });
});

// Routes
app.use("/api", routes);
app.use("/api/admin", Admin);
app.use("/api/adminpanel", authMiddleware, AdminPanel);



// Stripe Checkout Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    const { products, userName, userEmail, userPhone } = req.body;

    // Validate the presence of required fields
    if (!userName || !userEmail || !userPhone) {
        return res.status(400).json({ error: "userName, userEmail, and userPhone are required" });
    }
    
    const bookingId = crypto.randomBytes(16).toString('hex');

    // Extract appointmentid with improved error handling
    let appointmentid;
    try {
        if (products[0].alt === 'mentorship') {
            appointmentid = 4;
        } else {
            const title = products[0].title;
            const durationMatch = title.match(/\d+/);

            if (!durationMatch) {
                throw new Error(`No numeric value found in title: ${title}`);
            }

            const duration = parseInt(durationMatch[0], 10);
            switch (duration) {
                case 10:
                    appointmentid = 1;
                    break;
                case 30:
                    appointmentid = 2;
                    break;
                case 45:
                    appointmentid = 3;
                    break;
                default:
                    throw new Error(`Unexpected duration value: ${duration}`);
            }
        }
    } catch (error) {
        console.error(`Error extracting appointmentid: ${error.message}`);
        return res.status(400).json({ error: `Invalid product title format: ${products[0].title}` });
    }

    const lineItems = products.map(product => ({
        price_data: {
            currency: 'usd',
            product_data: { name: product.title },
            unit_amount: Math.round(parseFloat(product.price * 100)), // Stripe expects amounts in cents
        },
        quantity: 1,
    }));
    const totalAmount = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount, 0);

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `https://newyorkfrontend.vercel.app/booking/${bookingId}/${appointmentid}`,
            cancel_url: 'https://newyorkfrontend.vercel.app/cancelpayment',
        });

        await Booking.create({
            bookingId,
            sessionId: session.id,
            userName,
            userEmail,
            userPhone,
            products,
            totalAmount,
            currency: 'usd',
            status: 'pending'
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
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
    connectToMongoDB();
    console.log(`Server is running at http://localhost:${PORT}`);
});

