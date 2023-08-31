import React from 'react';

interface Props {
  color?: string;
  onClick?: () => void;
}

const AngleLeftIcon: React.FC<Props> = ({ color = '#898988', onClick = () => {} }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AngleLeftIcon;
