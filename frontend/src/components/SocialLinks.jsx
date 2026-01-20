import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Music2 } from 'lucide-react';

const SocialLinks = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61573211477495',
      icon: Facebook,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-400 to-blue-500',
      glowColor: 'blue-500/30'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/soulstice_tarot/',
      icon: Instagram,
      gradient: 'from-pink-500 via-purple-500 to-orange-500',
      hoverGradient: 'from-pink-400 via-purple-400 to-orange-400',
      glowColor: 'pink-500/30'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@soulsticetarot',
      icon: Music2,
      gradient: 'from-gray-900 to-black',
      hoverGradient: 'from-gray-800 to-gray-900',
      glowColor: 'gray-500/30'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Soulsticetarot',
      icon: Youtube,
      gradient: 'from-red-600 to-red-700',
      hoverGradient: 'from-red-500 to-red-600',
      glowColor: 'red-500/30'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
          >
            <span className="text-purple-300 font-semibold text-xs uppercase tracking-wider">Connect With Me</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            <span className="text-white">Follow My </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Journey</span>
          </h2>
          
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Daily insights, tarot wisdom, and spiritual guidance across all platforms
          </p>
        </motion.div>

        {/* Social Icons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid justify-items-center grid-cols-2 md:flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <motion.div
                key={social.name}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Main Card */}
                <button
                  onClick={() => handleSocialClick(social.url)}
                  className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-950/90 backdrop-blur-2xl rounded-2xl border border-gray-700/30 p-6 transition-all duration-500 hover:border-purple-400/50 hover:shadow-2xl overflow-hidden"
                  style={{ width: '140px', height: '140px' }}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                  
                  {/* Animated Border Gradient */}
                  <div className={`absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-950/90"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${social.glowColor}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-500">
                      {social.name}
                    </span>
                  </div>

                  {/* Floating Particles */}
                  <motion.div
                    animate={{ 
                      x: [0, 15, 0],
                      y: [0, -10, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-4 right-4 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm opacity-0 group-hover:opacity-100`}
                  />
                  <motion.div
                    animate={{ 
                      x: [0, -10, 0],
                      y: [0, 15, 0],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={`absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full blur-sm opacity-0 group-hover:opacity-100`}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialLinks;