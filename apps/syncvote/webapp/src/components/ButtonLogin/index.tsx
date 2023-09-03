import React from 'react';

type Pops = {
  title?: string;
  Icon?: any;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  disabled?: boolean;
};

function ButtonLogin({
    title,
    Icon,
    className,
    onClick,
    disabled = false,
  }
  : Pops) {
  return (
    <div
      className={`flex bg-[#FFF] text-[20px] gap-[15px] items-center py-[14px] pl-[37px] border border-solid border-[#E3E3E2] rounded-[10px] leading-[25px] ${disabled ? 'text-[#BBBBBA]' : 'cursor-pointer hover:bg-violet-100'} ${className}`}
      onClick={onClick || undefined}
    >
      {Icon}
      {title}
    </div>
  );
}

export default ButtonLogin;
