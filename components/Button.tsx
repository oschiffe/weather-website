import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  glowEffect?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  isLoading = false,
  isDisabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  glowEffect = false,
}) => {
  // Base styles for all buttons
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size variations
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
  };
  
  // Rounded variations
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary-light',
    success: 'bg-success hover:bg-success/90 text-white focus:ring-success/50',
    warning: 'bg-warning hover:bg-warning/90 text-white focus:ring-warning/50',
    error: 'bg-error hover:bg-error/90 text-white focus:ring-error/50',
    ghost: 'bg-transparent hover:bg-gray-100 text-secondary focus:ring-gray-300 border border-gray-300',
    glass: 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 focus:ring-white/30',
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md';
  
  // Glow effect
  const glowStyles = glowEffect ? 'glow-effect' : '';
  
  // Button animation
  const buttonAnimation = {
    tap: { scale: isDisabled ? 1 : 0.95 },
  };
  
  return (
    <motion.button
      type={type}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${variantStyles[variant]}
        ${widthStyle}
        ${disabledStyles}
        ${glowStyles}
        ${className}
      `}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled || isLoading}
      whileTap={buttonAnimation.tap}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button; 