import React from 'react';

interface ButtonProps {
  children: string | React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  rounded?: boolean;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button: React.FC<ButtonProps> = ({
  onClick = () => {},
  startIcon = '',
  rounded = false,
  endIcon = '',
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  id = '',
  children,
}) => {
  const variantObject = {
    primary: 'primary-button',
    secondary: 'secondary-button',
    outline: 'outline-button',
    text: 'text-button',
  };

  const disabledClass = disabled
    ? 'bg-grey-version-3 cursor-not-allowed text-[#BBBBBA] hover:text-[#BBBBBA]'
    : '';

  const roundedClass = rounded ? 'rounded-full' : '';

  const sizeObject = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <button
      className={`button ${variantObject[variant]} ${sizeObject[size]} ${roundedClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      id={id}
    >
      <div className="flex gap-1 justify-center items-center select-none">
        {startIcon}
        {children}
        {endIcon}
      </div>
    </button>
  );
};

export default Button;
