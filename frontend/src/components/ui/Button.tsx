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

  const getVariantClasses = () => {
    if (variant === 'ghost') {
      const ghostColors = {
        primary: 'text-blue-600 hover:bg-blue-50',
        secondary: 'text-gray-600 hover:bg-gray-50',
        danger: 'text-red-600 hover:bg-red-50',
        warning: 'text-orange-600 hover:bg-orange-50',
      };
      const focusRings = {
        primary: 'focus:ring-blue-500',
        secondary: 'focus:ring-gray-500',
        danger: 'focus:ring-red-500',
        warning: 'focus:ring-orange-500',
      };
      return `bg-transparent ${ghostColors[tone]} ${focusRings[tone]}`;
    }

    if (variant === 'outline') {
      const outlineColors = {
        primary:
          'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
        secondary:
          'border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
        danger: 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500',
        warning:
          'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white focus:ring-orange-500',
      };
      return `border bg-transparent ${outlineColors[tone]}`;
    }

    // solid variant (default)
    const solidColors = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    };
    return solidColors[tone];
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  const classes = `${baseClasses} ${getVariantClasses()} ${sizeClasses[size]} ${className}`;

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
