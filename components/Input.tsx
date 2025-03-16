import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'minimal';
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = true,
      icon,
      iconPosition = 'left',
      variant = 'default',
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    // Base input styles
    const baseInputStyles = 'block focus:outline-none text-secondary transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-50';
    
    // Variant styles
    const variantStyles = {
      default: 'border border-gray-300 rounded-lg bg-white px-4 py-2',
      minimal: 'bg-gray-100 rounded-lg px-4 py-2 border-transparent focus:bg-white focus:border focus:border-gray-300',
    };
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Error styles
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
    
    // Icon padding
    const iconPaddingStyles = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label className="block mb-1.5 text-sm font-medium text-secondary-light">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
              } flex items-center pointer-events-none text-gray-400`}
            >
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseInputStyles} ${variantStyles[variant]} ${widthStyles} ${errorStyles} ${iconPaddingStyles} ${className}`}
            {...props}
          />
        </div>
        
        {(helperText || error) && (
          <p
            className={`mt-1.5 text-sm ${
              error ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 