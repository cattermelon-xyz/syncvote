import React from 'react';

interface Props {
  color?: string;
}

const XOctagonIcon: React.FC<Props> = ({ color = '#898988' }) => (
  <svg width={24} height={24} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.3575 4.19995H28.7095L38.8669 14.3573V28.7093L28.7095 38.8666H14.3575L4.2002 28.7093V14.3573L14.3575 4.19995Z"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.733 16.3334L16.333 26.7334"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.333 16.3334L26.733 26.7334"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default XOctagonIcon;
