import React, { useState, useEffect } from 'react';

// Lightweight animation utilities to replace framer-motion
export const useIntersectionObserver = (callback, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          callback?.(entry);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, callback, options]);

  return [setRef, isIntersecting];
};

// Simple fade-in animation component
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Simple slide-in animation component
export const SlideIn = ({ children, direction = 'left', delay = 0, duration = 0.5, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-20px)';
      case 'right': return 'translateX(20px)';
      case 'up': return 'translateY(20px)';
      case 'down': return 'translateY(-20px)';
      default: return 'translateX(-20px)';
    }
  };
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${getTransform()}`
      } ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Simple scale animation component
export const ScaleIn = ({ children, delay = 0, duration = 0.3, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Modal animation wrapper
export const AnimatedModal = ({ children, isOpen, onClose, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm ${className}`}
      onClick={onClose}
    >
      <div 
        className="transition-all duration-300 ease-out animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-in {
    animation: animate-in 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
