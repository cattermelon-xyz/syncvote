import React from 'react';

interface Props {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

const PlusIcon: React.FC<Props> = ({ className = '', color = null, width = 24, height = 24 }) => (
  <div className={className}>
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19"
        stroke={color || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19"
        stroke={color || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default PlusIcon;
