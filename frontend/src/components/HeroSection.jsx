import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ navigateTo }) => {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center overflow-hidden relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-[50%] right-[15%] w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8 xl:px-0 pt-28 md:pt-36 xl:pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-0">
          {/* Content Section */}
          <motion.div 
            className="flex flex-col w-full xl:w-1/2 xl:pr-8"
            initial="hidden"
            animate="visible"
          >
            {/* Forbes badge */}
            <motion.div
              variants={contentVariants}
              custom={0}
              className="flex items-center mb-2 gap-2"
            >
              <span className="text-gray-400 text-sm font-medium">Featured in</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <a
                  href="https://www.forbes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <img src='https://www.regenerativetravel.com/wp-content/uploads/2024/11/forbes-logo.png' alt='forbes' className='w-20'/>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </motion.div>
            </motion.div>
            
            {/* Name */}
            <motion.div 
              variants={contentVariants}
              custom={1}
              className='rubik-wet-paint-regular mb-2 text-white text-lg md:text-xl'
            >
              Marina Smargiannakis
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              variants={contentVariants}
              custom={2}
              className='ultra-regular text-5xl sm:text-6xl md:text-7xl mb-6 text-white leading-tight tracking-tight'
            >
              The New York <br className='hidden md:block'/> Oracle<sup className='text-xs font-mono align-super'>TM</sup>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              variants={contentVariants}
              custom={3}
              className='text-gray-300 text-base md:text-lg max-w-xl mb-8'
            >
              Utilizing tarot, intuition, and channeling guides to give clarity and help manifest your best life.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              variants={contentVariants}
              custom={4}
            >
              <motion.a 
                href="#services" 
                onClick={() => navigateTo('newsletter')} 
                className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative text-white flex items-center gap-2">
                 Book Your Reading
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.a>
            </motion.div>
            
            {/* Ratings and Reviews Section */}
            <motion.div
              variants={contentVariants}
              custom={5}
              className="mt-12 mb-8 md:mb-0"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
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
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">4.9</span>
                        <span className="text-gray-400 text-sm font-medium">(1000+ reviews)</span>
                      </div>
                      <div className="text-purple-400 text-sm font-medium">
                        Verified people
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-4 py-1.5 mt-3 sm:mt-0">
                    <div className="flex items-center gap-1">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-gray-300 text-sm">Active Bookings</span>
                    </div>
                  </div>
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Image Section */}
          <motion.div 
            className="w-full xl:w-1/2 flex justify-center xl:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative max-w-md sm:max-w-lg md:max-w-xl xl:max-w-none">
              {/* Image wrapper with responsive sizing */}
              <div className="w-full max-w-lg md:max-w-xl xl:max-w-xl">
                <img 
                  src='/hero.webp'
                  alt='New York Oracle' 
                  className="object-contain h-full rounded-2xl"
                  loading="eager"
                  crossOrigin="anonymous"
                />
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-xl"></div>
                
                {/* Floating animated cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -left-6 top-2 sm:top-1/4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium">Tarot Reading</div>
                      <div className="text-gray-400 text-xs">Spiritual Guidance</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="absolute -right-6 bottom-2 sm:bottom-1/4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium">Intuitive Reading</div>
                      <div className="text-gray-400 text-xs">Clear Guidance</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
