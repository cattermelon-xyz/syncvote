import React from 'react';

type Props = {
  onClick?: () => void;
  className?: string;
};

const XButton: React.FC<Props> = ({ onClick = () => {}, className = '' }) => (
  <div className={className} onClick={onClick}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26.2986 15.3555L14.9899 26.6642"
        stroke="currentColor"
        strokeWidth="1.88479"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9899 15.3555L26.2986 26.6642"
        stroke="currentColor"
        strokeWidth="1.88479"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default XButton;
