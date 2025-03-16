import React, { useRef, useEffect, ReactNode } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'fade' | 'none';
export type AnimationEasing = 'spring' | 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

interface ScrollRevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
  stagger?: boolean;
  staggerChildren?: number;
  easing?: AnimationEasing;
  damping?: number;
  stiffness?: number;
}

// Create a properly typed variants function for Framer Motion
const createVariants = (type: AnimationType, distance: number): Variants => {
  const hidden: any = { opacity: 0 };
  const visible: any = { opacity: 1 };
  
  // Add transform properties based on animation type
  switch (type) {
    case 'fade-up':
      hidden.y = distance;
      visible.y = 0;
      break;
    case 'fade-down':
      hidden.y = -distance;
      visible.y = 0;
      break;
    case 'fade-left':
      hidden.x = distance;
      visible.x = 0;
      break;
    case 'fade-right':
      hidden.x = -distance;
      visible.x = 0;
      break;
    case 'zoom-in':
      hidden.scale = 0.9;
      visible.scale = 1;
      break;
    case 'zoom-out':
      hidden.scale = 1.1;
      visible.scale = 1;
      break;
    case 'fade':
      // Only opacity changes, which is already set
      break;
    case 'none':
      hidden.opacity = 1; // No animation
      break;
  }
  
  return {
    hidden,
    visible
  };
};

// Create the CSS animation name based on animation type
const getCSSAnimationClass = (type: AnimationType): string => {
  switch (type) {
    case 'fade-up': return 'scroll-reveal-up';
    case 'fade-down': return 'scroll-reveal-down';
    case 'fade-left': return 'scroll-reveal-left';
    case 'fade-right': return 'scroll-reveal-right';
    case 'zoom-in': return 'scroll-reveal-zoom-in';
    case 'zoom-out': return 'scroll-reveal-zoom-out';
    case 'fade': return 'scroll-reveal-fade';
    case 'none': return '';
    default: return 'scroll-reveal-up';
  }
};

// Get transition config based on easing type
const getTransitionConfig = (
  easing: AnimationEasing,
  duration: number,
  delay: number,
  damping: number,
  stiffness: number
) => {
  if (easing === 'spring') {
    return {
      type: 'spring',
      damping,
      stiffness,
      delay
    };
  }
  
  return {
    duration,
    delay,
    ease: easing
  };
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  once = true,
  className = '',
  threshold = 0.2,
  stagger = false,
  staggerChildren = 0.1,
  easing = 'spring',
  damping = 25,
  stiffness = 200,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element is in view
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once]);

  // Get CSS animation class for CSS-based animations
  const cssAnimationClass = getCSSAnimationClass(type);
  
  // CSS-based animation as an alternative to Framer Motion
  // This enables the smoother Apple-style animations
  const getCSSClass = () => {
    let cssClass = 'scroll-reveal';
    
    if (stagger) {
      cssClass += ' scroll-reveal-stagger';
    }
    
    if (cssAnimationClass) {
      cssClass += ` ${cssAnimationClass}`;
    }
    
    if (inView) {
      cssClass += ' scroll-reveal-visible';
    }
    
    return cssClass;
  };

  // Use environment variable to choose between CSS and Framer Motion animations
  const useCSS = process.env.NEXT_PUBLIC_USE_CSS_ANIMATIONS === 'true';
  
  // Use CSS classes instead of Framer Motion for smoother animations
  if (useCSS) {
    return (
      <div 
        ref={ref}
        className={`${getCSSClass()} ${className}`}
        style={{ 
          transitionDelay: `${delay}s`,
          transitionDuration: `${duration}s`,
          transitionTimingFunction: easing === 'spring' ? 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' : easing
        }}
      >
        {children}
      </div>
    );
  }

  // Framer Motion animation with properly typed variants
  const variants = createVariants(type, distance);
  const transition = getTransitionConfig(easing, duration, delay, damping, stiffness);
  
  // If stagger is enabled, we need to add staggerChildren to the container
  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren,
              delayChildren: delay
            }
          }
        }}
        className={className}
      >
        {React.Children.map(children, (child) => (
          <motion.div variants={variants} transition={transition}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  // Standard animation without staggering
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;