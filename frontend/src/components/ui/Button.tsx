import React from 'react';
import Icon, { LucideIconName } from './Icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary' | 'danger' | 'warning';
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: LucideIconName;
  rightIcon?: LucideIconName;
  children: React.ReactNode;
};

const Button = (props: ButtonProps) => {
  const {
    tone = 'primary',
    variant = 'solid',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...rest // Only HTML button attributes
  } = props;

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const toneClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
  };

  const variantClasses = {
    solid: '',
    outline: 'border border-current bg-transparent hover:bg-current hover:text-white',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  const classes = `${baseClasses} ${toneClasses[tone]} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...rest}>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <Icon name={leftIcon} className="w-4 h-4 mr-2" />
      ) : null}
      {children}
      {rightIcon && !isLoading && <Icon name={rightIcon} className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button;
