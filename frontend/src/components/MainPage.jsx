import React, { useEffect, useState } from 'react';
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

const MainPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getAllReviews();
  }, []);

  const getAllReviews = async () => {
    let response = await getAllReview();
    setReviews(response.data);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (id) => {
    window.location.hash = `#${id}`;
    setIsMenuOpen(false); // Close the menu after navigating
  };

  return (
    <>
      <div className="relative">
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}  
          className="navbar lg:text-lg bg-black-variation bg-base-100"
        >
          <div className="navbar-start">
            <button onClick={toggleMenu} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button className="w-[15rem]">
              <img src='https://i.postimg.cc/NFy9qjgS/Group-1991.png' alt='logo'/>
            </button>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal text-white px-1">
              <li><a href="#about" onClick={() => navigateTo('about')} className="block py-2 px-4 text-white">About me</a></li>
              <li><a href="#services" onClick={() => navigateTo('services')} className="block py-2 px-4 text-white">Services</a></li>
              <li><a href="#testimonials" onClick={() => navigateTo('testimonials')} className="block py-2 px-4 text-white">Testimonials</a></li>
            </ul>
          </div>
          <div className="navbar-end">
            <a href="mailto:Solsticetarot143@gmail.com"  className="btn border-2 border-white">Contact me</a>
          </div>
        </motion.div>

        {/* Fullscreen Slider Menu */}
        <div className={`fixed top-0 right-0 h-full w-full bg-black-variation transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu} className="text-white text-3xl">
              &times;
            </button>
          </div>
          <ul className="flex flex-col items-center justify-center h-full text-white text-2xl">
            <li className="my-4"><a href="#about" onClick={() => navigateTo('about')} className="block py-2">About me</a></li>
            <li className="my-4"><a href="#services" onClick={() => navigateTo('services')} className="block py-2">Services</a></li>
            <li className="my-4"><a href="#testimonials" onClick={() => navigateTo('testimonials')} className="block py-2">Testimonials</a></li>
            {/* <li className="my-4"><a href="#contact" onClick={() => navigateTo('contact')} className="block py-2">Contact</a></li> */}
          </ul>
        </div>

        {/* HERO SECTION STARTS FROM HERE!! */}
        <div className="container mx-auto flex flex-wrap md:flex-nowrap pl-10 pr-10 md:pt-20 justify-center">
          <div className='pt-10 lg:pt-20 lg:pr-[10rem] lg:flex-col justify-center'>
            <motion.div initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0, type: "spring", stiffness: 100 }} 
              className='rubik-wet-paint-regular mb-2 text-white'
            >
              Marina Smargiannakis
            </motion.div>
            <motion.div initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }} 
              className='ultra-regular text-[3rem] text-4xl lg:text-5xl mb-8 text-white'
            >
              The New York <br/> Oracle<span className='text-[0.48rem] font-mono'>TM</span>
            </motion.div>
            <motion.div initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }} 
              className='text-white mb-8 lg:w-[65vh] lg:text-lg'
            >
              Utilizing tarot, intuition, and channeling guides to give clarity, bring you back into alignment and help manifest your best life.
            </motion.div>
            <a href="#newsletter" onClick={() => navigateTo('newsletter')} className="btn btn-neutral mb-10 text-white">Subscribe for free</a>
          </div>
          <div className='w-[77vh]'>
            <img src='https://i.postimg.cc/XN9Cnp3c/image-1-2.png' alt='hero'/>
          </div>
        </div>
        {/* HERO SECTION ENDS FROM HERE!! */}

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
        <div id="services">
          <LoveBookingCards/>
          <CareerBookingCards />
          <GeneralBookingCards />
          <MentorshipBookingCards />
        </div>

        <FeedbackForm />
        <div id="newsletter">
          <NewsletterPopup/>
        </div>

        <footer className="bg-gray-800 dark:bg-gray-800">
          <div className='w-full mx-auto max-w-screen-xl p-4 md:flex gap-3 md:items-center md:justify-between'>
            <div className='max-w-1/2 mb-10 text-sm text-gray-400'>
              <span className='font-bold'>Disclaimer:</span> By purchasing, you are acknowledging and understanding that Marina is a professional tarot reader and not a doctor. This service is for entertainment purposes only, and if you need professional medical help, you will take the proper steps for yourself. You also understand and agree that you will take full responsibility for your actions and cannot hold Marina or Soulstice Tarot accountable for any decisions you make moving forward. Additionally, there are no refunds if a client is dissatisfied with their reading.
            </div>
          </div>
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex gap-3 md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">© 2024, Marina Smargiannakis | <span className="hover:underline">The New York Oracle™</span>. All Rights Reserved.</span>
            <span>
              <ul className="flex flex-wrap gap-y-4 items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li><a href="#about" onClick={() => navigateTo('about')} className="hover:underline me-4 cursor-pointer md:me-6 block py-2 px-4 text-white">About</a></li>
                <li><a href="mailto:Solsticetarot143@gmail.com" className="hover:underline me-4 cursor-pointer md:me-6 block py-2 px-4 text-white">Contact</a></li>
                <li><a href="#services" onClick={() => navigateTo('services')} className="hover:underline me-4 cursor-pointer md:me-6 block py-2 px-4 text-white">Services</a></li>
                <li><a href="#testimonials" onClick={() => navigateTo('testimonials')} className="hover:underline me-4 cursor-pointer md:me-6 block py-2 px-4 text-white">Testimonials</a></li>
              </ul>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MainPage;
