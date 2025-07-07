import React from 'react';
import { motion } from "framer-motion";
import { ExternalLink, Star, TrendingUp, Award } from 'lucide-react';

const Press = () => {
  const articles = [
    {
      id: 1,
      title: "The Rise of the TikTok Psychic",
      publication: "Forbes",
      author: "Jessica Ourisman",
      date: "September 26, 2024",
      url: "https://www.forbes.com/sites/jessicaourisman/2024/09/26/the-rise-of-the-tiktok-psychic-and-their-insidious-online-scammers/?fbclid=PAQ0xDSwLVHINleHRuA2FlbQIxMQABp7xRbrYWkfHvLZgzztXn76PAkXEEckAIv2BEgvWt3D_FpRse_38nwu3-9TQ__aem_WRKFtMDWXkhWK9xe6GxDgA",
      logo: "https://www.regenerativetravel.com/wp-content/uploads/2024/11/forbes-logo.png",
      category: "Business & Technology",
      excerpt: "Exploring the growing trend of social media psychics and the importance of authentic spiritual guidance in the digital age."
    },
    {
      id: 2,
      title: "Calmcation Travel Trend Review",
      publication: "PopSugar",
      author: "PopSugar Team",
      date: "June 17, 2025",
      url: "https://www.popsugar.com/travel/calmcation-travel-trend-review-49445886?fbclid=PAQ0xDSwLVHNJleHRuA2FlbQIxMAABp-oHGJLnUa-qfMxNQK-XWKDUQQH09YWy8dXPneWgeS6jPaOv2PMmMPGimC4y_aem_lO3S1y8rduwowFesV5u3fA",
      logo: "https://www.popsugar.com.au/wp-content/themes/popsugar/dist/images/logo/primary-logo/ps-2024-orange.svg",
      category: "Lifestyle & Travel",
      excerpt: "Discovering the latest wellness travel trends and the intersection of spiritual practices with modern lifestyle choices."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const handleArticleClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="press" className="py-12 min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
          >
            <Award className="w-4 h-4 text-red-400" />
            <span className="text-red-300 font-semibold text-xs uppercase tracking-wider">Featured In</span>
            <Award className="w-4 h-4 text-pink-400" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-white">Press & </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">Media</span>
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Discover how The New York Oracle is making waves in the spiritual community and beyond, 
            featured in leading publications worldwide.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-950/90 backdrop-blur-2xl rounded-3xl border border-gray-700/30 p-4 sm:p-6 md:p-8 h-full transition-all duration-500 hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-500/20 overflow-hidden group/card">
                
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/10 via-pink-500/5 to-purple-500/10 opacity-0 group-hover/card:opacity-100 transition-all duration-500"></div>
                
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-red-500/50 via-pink-500/30 to-purple-500/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-950/90"></div>
                </div>
                
                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <motion.div
                    animate={{ 
                      x: [0, 20, 0],
                      y: [0, -15, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 right-8 w-2 h-2 bg-red-400 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      x: [0, -15, 0],
                      y: [0, 20, 0],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      x: [0, 25, 0],
                      y: [0, -10, 0],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 right-4 w-1 h-1 bg-purple-400 rounded-full blur-sm"
                  />
                </div>
                
                {/* Publication Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4 relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                        <img 
                          src={article.logo} 
                          alt={article.publication}
                          className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-red-500/20 via-pink-500/15 to-purple-500/20 opacity-0 group-hover/card:opacity-100 transition-all duration-500 blur-sm"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{article.publication}</h3>
                      <p className="text-gray-300 text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">{article.category}</p>
                    </div>
                  </div>
                  <motion.div 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="hidden sm:flex items-center w-28 md:w-100 gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm shadow-lg"
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current" />
                    <span className="text-yellow-200 text-xs font-semibold">Featured</span>
                  </motion.div>
                </div>

                {/* Article Content */}
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover/card:from-red-200 group-hover/card:via-pink-200 group-hover/card:to-purple-200 transition-all duration-500 leading-tight">
                    {article.title}
                  </h4>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 sm:pt-6 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <span className="font-semibold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">{article.author}</span>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                      <span className="text-gray-400 font-medium">{article.date}</span>
                    </div>
                    
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleArticleClick(article.url)}
                      className="cursor-pointer flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:via-pink-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:shadow-red-500/30 text-xs sm:text-sm max-w-[140px] sm:max-w-none hover:scale-105 active:scale-95 relative z-20 backdrop-blur-sm border border-white/10"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.cursor = 'pointer'}
                      onMouseLeave={(e) => e.target.style.cursor = 'pointer'}
                    >
                      <span className='text-nowrap'>Read Article</span>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/card:translate-x-1" />
                    </motion.button>
                  </div>
                </div>

                {/* Subtle Corner Glow Effects */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full blur-sm opacity-40"
                />
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-2 left-2 w-2 h-2 bg-pink-400 rounded-full blur-sm opacity-40"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </motion.div>
            <span className="text-red-300 font-medium text-xs sm:text-sm md:text-base">More coming soon</span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Press; 