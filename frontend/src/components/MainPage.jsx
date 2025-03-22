import React, { useEffect, useState } from 'react';
import About from './About';
import Testimonials from './Testimonials';
import LoveBookingCards from './LoveBookingCards';
import CareerBookingCards from './CareerBookingCards';
import GeneralBookingCards from './GeneralBookingCards';
import MentorshipBookingCards from './MentorshipBookingCards';
import SameDayCards from './SameDayCards';
import FeedbackForm from './FeedbackForm';
import NewsletterPopup from './NewsletterPopup';
import Footer from './Footer';
import { getAllReview } from '../Api/api';
import { motion } from "framer-motion";

const MainPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleResize = () => {
    const isMobile = window.innerWidth <= 767;
    if (!isMobile) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    getAllReviews();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const handleContactClick = (e) => {
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
      e.preventDefault(); // Prevent the default mailto behavior
      setIsPopupVisible(true);
    } else {
      // For non-mobile screens, continue with the default behavior
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      if (isDesktop && !navigator.userAgent.includes("iPhone") && !navigator.userAgent.includes("iPad")) {
        e.preventDefault();
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=soulsticetarot143@gmail.com`, '_blank');
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
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
              <img src='logo.png' alt='logo'/>
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
            <a href="mailto:soulsticetarot143@gmail.com" onClick={handleContactClick} className="btn border-2 border-white">Contact me</a>
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
          </ul>
        </div>

        {/* HERO SECTION STARTS FROM HERE!! */}
        <div className="container mx-auto flex flex-wrap md:flex-nowrap pl-10 pr-10 md:pt-20 justify-center">
          <div className='pt-10 lg:pt-20 lg:pr-[10rem] lg:flex-col justify-center'>
          <div className="flex items-center mb-4 gap-2">
                  <span className="text-gray-400 text-sm font-medium">Featured in</span>
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="relative group"
                  >
                    <a
                      href="https://www.forbes.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <img src='https://www.regenerativetravel.com/wp-content/uploads/2024/11/forbes-logo.png' alt='forbes' className='w-20'/>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  </motion.div>
                </div>
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
              className='ultra-regular text-4xl lg:text-5xl mb-4 lg:mb-8 text-white'
            >
              The New York <br className='hidden lg:block'/> Oracle<span className='text-[0.48rem] font-mono'>TM</span>
            </motion.div>
            <motion.div initial={{ y: 20}}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }} 
              className='text-white text-sm mb-8 lg:w-[65vh] lg:text-lg'
            >
              Utilizing tarot, intuition, and channeling guides to give clarity and help manifest your best life.
            </motion.div>
            <motion.a 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
              transition={{ delay: 0.5, stiffness: 100 }} 
            href="#newsletter" 
              onClick={() => navigateTo('newsletter')} 
              className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg group hover:scale-105 active:scale-95 mb-8"
            >
              <span className="relative text-white flex items-center gap-2">
                Subscribe for free
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col mb-4 items-start gap-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl p-3 sm:p-4 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                          className="relative w-6 h-6"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-25 animate-pulse"></div>
                          <div className="relative w-full h-full rounded-full border-2 border-purple-500 bg-black flex items-center justify-center overflow-hidden transform hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.7, duration: 0.5 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-white font-semibold">4.9</span>
                        <span className="text-gray-400 text-nowrap text-sm font-medium">(1000+ reviews)</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8, duration: 0.5 }}
                        className="text-purple-400 text-sm font-medium"
                      >
                        Verified people
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.9, duration: 0.5 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-4 py-1.5"
                  >
                    <div className="flex items-center gap-1">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-gray-300 text-sm"> Active Bookings</span>
                    </div>
                  </motion.div>
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className='w-[77vh]'>
            <img src='hero.png' alt='hero'/>
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
            <p></p>
          )}
        </div>
        <div id="services">
          <LoveBookingCards/>
          <CareerBookingCards />
          <GeneralBookingCards />
          <SameDayCards/>
          <MentorshipBookingCards />
        </div>

        <FeedbackForm />
        <div id="newsletter">
          <NewsletterPopup/>
        </div>
           
        <Footer />
      </div>

      {/* Mobile-only popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="relative bg-black border border-white text-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto">
            <button className="absolute top-2 right-2 text-white text-2xl font-bold" onClick={closePopup}>
              &times;
            </button>
            <p className="text-md min-w-4 mr-3">Mail to <strong>soulsticetarot143@gmail.com</strong> for any inquiries.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default MainPage;
