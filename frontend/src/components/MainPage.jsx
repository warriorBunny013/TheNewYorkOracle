// src/components/MainPage.js
import React, { useEffect, useState } from 'react';
// import Home from './Home';
import About from './About';
import Testimonials from './Testimonials';
import LoveBookingCards from './LoveBookingCards';
import CareerBookingCards from './CareerBookingCards';
import GeneralBookingCards from './GeneralBookingCards';
import MentorshipBookingCards from './MentorshipBookingCards';
import FeedbackForm from './FeedbackForm';
import NewsletterPopup from './NewsletterPopup';
import { getAllReview } from '../Api/api';
import { motion } from "framer-motion";
// import { StarsCanvas } from "./canvas"
const MainPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAllReviews();
  }, []);

  const getAllReviews = async () => {
    let response = await getAllReview();
    setReviews(response.data);
    console.log("hello")
  }

  return (
    <>
      <div className="">
      <motion.div initial={{y:-100}}
           animate={{y:0}}
           transition={{delay:1,type: "spring", stiffness: 100 }}  className="navbar lg:text-lg bg-black-variation bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        
        <li><a href="https://www.soulsticetarot.com/#about">About me</a></li>
        <li><a href="https://www.soulsticetarot.com/#services">Services</a></li>
        <li><a href="https://www.soulsticetarot.com/#testimonials">Testimonials</a></li>
       
      </ul>
    </div>
    <button className="w-[15rem]"><img src='https://i.postimg.cc/NFy9qjgS/Group-1991.png' alt='logo'/></button>

  </div>
  <div tabIndex={0}
            className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal text-white px-1">
      
   
        <li><a href="https://www.soulsticetarot.com/#about">About me</a></li>
        <li><a href="https://www.soulsticetarot.com/#services">Services</a></li>
        <li><a href="https://www.soulsticetarot.com/#testimonials">Testimonials</a></li>
    </ul>
  </div>
  <div className="navbar-end ">
    <a href="https://www.soulsticetarot.com/#about"><button className="btn border-2 border-white">Contact me</button></a>
  </div>
      </motion.div>

{/* HERO SECTION STARTS FROM HERE!! */}
<div className="container mx-auto flex flex-wrap md:flex-nowrap pl-10 pr-10 md:pt-20 justify-center ">
  {/* HERO INTRO STARTS */}
  <div  className='pt-10 lg:pt-20 lg:pr-[10rem] lg:flex-col justify-center'>
   <motion.div initial={{y:20}}
           animate={{y:0}}
           transition={{delay:0,type: "spring", stiffness: 100 }} className='rubik-wet-paint-regular mb-2 text-white'>Marina Smargiannakis</motion.div>
   <motion.div initial={{y:40}}
           animate={{y:0}}
           transition={{delay:0.3,type: "spring", stiffness: 100 }} className='ultra-regular text-[3rem] text-4xl lg:text-5xl mb-8 text-white'>The New York <br/> Oracle<span className='text-[0.48rem] font-mono'>TM</span></motion.div>
   <motion.div initial={{y:40}}
           animate={{y:0}}
           transition={{delay:0.5,type: "spring", stiffness: 100 }} className=' text-white mb-8 lg:w-[65vh] lg:text-lg'>Utilizing tarot, intuition, and channeling guides to give clarity, bring you back into alignment and help manifest your best life.</motion.div>
  
    <motion.div initial={{y:60}}
           animate={{y:0}}
           transition={{delay:0.8,type: "spring", stiffness: 100 }}><a href="#newsletter"><button className="btn btn-neutral mb-10 text-white">Subscribe for free</button></a></motion.div>
  </div>
  {/* HERO INTRO ENDS */}
  <div className='w-[77vh]'>
    <img src='https://i.postimg.cc/XN9Cnp3c/image-1-2.png' alt='hero'/>
  </div>
</div>
{/* HERO SECTION ENDS FROM HERE!! */}

    </div>
      <div id="about">
      <About/>
      </div>
      <div id="testimonials">
      {reviews.length > 0 ? (
        <Testimonials reviews={reviews} />
      ) : (
        <p>Loading...</p>
      )}
      </div>
      <div id="services" >
      <LoveBookingCards/>
      <CareerBookingCards />
      <GeneralBookingCards />
      <MentorshipBookingCards />
      </div>
      
      <FeedbackForm />
      <div id="newsletter" >  <NewsletterPopup/></div>
    
      {/* <Footer /> */}
      <footer className="bg-gray-800 dark:bg-gray-800">
        <div className='w-full mx-auto max-w-screen-xl p-4 md:flex gap-3 md:items-center md:justify-between'>
          <div className='max-w-1/2 mb-10 text-sm text-gray-400'><span className='font-bold'>Disclaimer:</span> By purchasing, you are acknowledging and understanding that Marina is a professional tarot reader and not a doctor. This service is for entertainment purposes only, and if you need professional medical help, you will take the proper steps for yourself. You also understand and agree that you will take full responsibility for your actions and cannot hold Marina or Soulstice Tarot accountable for any decisions you make moving forward. Additionally, there are no refunds if a client is dissatisfied with their reading.</div>
        </div>
    <div className="w-full mx-auto  max-w-screen-xl p-4 md:flex gap-3 md:items-center md:justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">© 2024, Marina Smargiannakis | <span className="hover:underline">The New York Oracle™</span>. All Rights Reserved.
    </span>
    <span>
    <ul className="flex flex-wrap gap-y-4 items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        {/* <li>
        <div className="hover:underline me-4 md:me-6">Disclaimer</div>
        </li> */}
        <li>
            <a href="#about" className="hover:underline me-4 cursor-pointer md:me-6">About</a>
        </li>
        <li>
        <a href="#about" className="hover:underline me-4  cursor-pointer md:me-6">Contact</a>
        </li>
        <li>
        <a href="#services" className="hover:underline me-4  cursor-pointer md:me-6">Services</a>
        </li>
        <li>
        <a href="#testimonials" className="hover:underline me-4  cursor-pointer md:me-6">Testimonials</a>
        </li>
        {/* <span> 
        <a className="hover:underline text-[0.7rem] font-normal cursor-pointer" 
           href="https://linktr.ee/UditiDas" 
           target="_blank" 
           rel="noopener noreferrer"
        >
         @Developed by Uditi&Mihir
        </a>
        </span> */}
    </ul>
    </span>
   

    </div>
</footer>

    </>
  );
}

export default MainPage;
