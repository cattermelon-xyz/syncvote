import React, { useEffect } from "react";

interface HomeButtonProps {
  startIcon?: JSX.Element;
  children: string | React.ReactNode;
  onClick?: () => void;
  isFocused?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  startIcon = "",
  children,
  onClick,
  isFocused = false,
}) => {
  const hoverClasses =
    "hover:bg-[#F4F0FA] hover:text-[#6F00FF] hover:border-r-2 hover:border-purple-500 hover:rounded-l-lg";
  const focusedStateClasses = isFocused
    ? "bg-[#F4F0FA] text-[#6F00FF] border-r-2 border-purple-500 rounded-l-lg"
    : "";

  return (
    <button
      className={`flex justify-start items-center gap-3 px-[16px] py-[12px] ${hoverClasses} ${focusedStateClasses} transition-colors duration-200`}
      onClick={onClick}
    >
      {startIcon}
      {children}
    </button>
  );
};

export default HomeButton;
