import React from 'react';

interface Props {
  color?: string;
}

const BarChartIcon: React.FC<Props> = ({ color = '#898988' }) => (
  <svg width={24} height={24} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.5332 35.4V18.0667"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.9331 35.4V7.66669"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.1333 35.4V28.4667"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BarChartIcon;
