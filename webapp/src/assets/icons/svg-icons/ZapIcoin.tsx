import React from 'react';
type Props = {
  color?: string;
  width?: number;
  height?: number;
};

const ZapIcon = ({ color = '#252422', width = 20, height = 22 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 20 22"
    fill="none"
  >
    <path
      d="M11 1L1 13H10L9 21L19 9H10L11 1Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ZapIcon;
