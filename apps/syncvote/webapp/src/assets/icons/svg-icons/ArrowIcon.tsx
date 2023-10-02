import React from 'react';

interface Props {
  width?: string;
  height?: string;
  color?: string;
}

const ArrowIcon: React.FC<Props> = ({ width = 24, height = 24, color = '#E3E3E2' }) => (
  <div>
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default ArrowIcon;
