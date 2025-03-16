import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient';
  gradientColor?: 'primary' | 'success' | 'info' | 'warning' | 'error';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  gradientColor = 'primary',
  padding = 'md',
  className = '',
  onClick,
  hoverEffect = true,
  glowEffect = false,
}) => {
  // Base styles for all cards
  const baseStyles = 'rounded-xl overflow-hidden';
  
  // Padding variations
  const paddingStyles = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  
  // Variant styles
  const variantStyles = {
    default: 'bg-white/80 backdrop-blur-sm border border-white/30 shadow-sm',
    glass: 'bg-white/50 backdrop-blur-md border border-white/30 shadow-sm',
    elevated: 'bg-white shadow-lg',
    gradient: `bg-gradient-to-br ${getGradientColors(gradientColor)} text-white`,
  };
  
  // Interactive styles
  const interactiveStyles = onClick ? 'cursor-pointer' : '';
  
  // Glow effect class
  const glowClass = glowEffect ? 'glow-effect' : '';
  
  // Get gradient colors based on the selected color
  function getGradientColors(color: string): string {
    switch (color) {
      case 'primary':
        return 'from-purple-500 to-indigo-600';
      case 'success':
        return 'from-green-400 to-emerald-500';
      case 'info':
        return 'from-blue-400 to-cyan-500';
      case 'warning':
        return 'from-yellow-400 to-amber-500';
      case 'error':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-purple-500 to-indigo-600';
    }
  }
  
  return (
    <motion.div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${interactiveStyles} ${glowClass} ${className}`}
      onClick={onClick}
      whileHover={
        hoverEffect && onClick 
          ? { 
              y: -5, 
              scale: 1.02, 
              boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)' 
            } 
          : {}
      }
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        bounce: 0.2
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card; 