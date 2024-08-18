import express from "express";
import {getReviews,saveReviews,deleteReview} from "../controllers/ReviewsController.js"
// import Stripe from 'stripe';
// const stripe = new Stripe("sk_test_51PgSjjCzHvMOKeKHsUmXhQyWcCZvSggF1bJ2hIDJm232DuqvBegEm7tbn7i9f7HhWT3VZc9Ct8ymnQxJIB6pAoE300xq0BzZbv");
const router=express.Router();

router.get("/getreviews",getReviews);
router.post("/savereview",saveReviews);
router.delete("/deletereview/:id",deleteReview);
// router.post("/create-checkout-session",async(req,res)=>{

//     const {products}=req.body;

//     const lineItems=products.map((product)=>({
//         price_data:{
//             currency:"usd",
//             product_data:{
//                 name: product.name,
//                 email: product.email,
//                 phone: product.phone,
//                 alt: product.alt,
//                 title: product.title,
//             },
//             unit_amount:Math.round(product.price*100)
//         },
//         quantity: 1,
//     }));

//     const session=await stripe.checkout.sessions.create({
//         payment_method_types:["cards"],
//         line_items:lineItems,
//         mode:"payment",
//         success_url:"https://www.google.com/",
//         cancel_url:"https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
//     })

//     res.json({id:session.id})
// })

export default router;