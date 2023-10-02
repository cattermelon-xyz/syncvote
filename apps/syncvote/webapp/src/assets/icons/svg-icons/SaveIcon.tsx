/* eslint-disable max-len */
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
  classes?: string;
  svgClasses?: string;
}

const SaveIcon: React.FC<Props> = ({
  width = 24,
  height = 24,
  color = null,
  classes = '',
  svgClasses = '',
}) => (
  <div className={classes}>
    <svg
      className={svgClasses}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.8229 24.4H6.6451C6.03215 24.4 5.44431 24.1565 5.01089 23.7231C4.57748 23.2897 4.33398 22.7018 4.33398 22.0889V5.91112C4.33398 5.29817 4.57748 4.71033 5.01089 4.27691C5.44431 3.8435 6.03215 3.60001 6.6451 3.60001H19.3562L25.134 9.37778V22.0889C25.134 22.7018 24.8905 23.2897 24.4571 23.7231C24.0237 24.1565 23.4358 24.4 22.8229 24.4Z"
        stroke={color || 'currentColor'}
        strokeWidth="2.31111"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5126 24.4V15.1556H8.95703V24.4"
        stroke={color || 'currentColor'}
        strokeWidth="2.31111"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.95703 3.60001V9.37778H18.2015"
        stroke={color || 'currentColor'}
        strokeWidth="2.31111"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default SaveIcon;
