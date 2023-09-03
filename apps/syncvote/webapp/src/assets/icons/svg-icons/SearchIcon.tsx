import React from 'react';

type Props = {
  color?: string;
  width?: number;
  height?: number;
};

const SearchIcon = ({ color = '#5D23BB', width = 24, height = 24 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 17.5L13.875 13.875"
      stroke={color}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;
