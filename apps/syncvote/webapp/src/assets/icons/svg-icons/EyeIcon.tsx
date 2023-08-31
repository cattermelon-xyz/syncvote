import React from 'react';

interface Props {
  color?: string;
}

const EyeIcon: React.FC<Props> = ({ color = null }) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_203_47928)">
      <path
        d="M1.29004 14C1.29004 14 5.91226 4.75558 14.0012 4.75558C22.09 4.75558 26.7123 14 26.7123 14C26.7123 14 22.09 23.2445 14.0012 23.2445C5.91226 23.2445 1.29004 14 1.29004 14Z"
        stroke={color || 'currentColor'}
        strokeWidth="2.31111"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0008 17.4667C15.9154 17.4667 17.4675 15.9146 17.4675 14C17.4675 12.0854 15.9154 10.5333 14.0008 10.5333C12.0863 10.5333 10.5342 12.0854 10.5342 14C10.5342 15.9146 12.0863 17.4667 14.0008 17.4667Z"
        stroke={color || 'currentColor'}
        strokeWidth="2.31111"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_203_47928">
        <rect
          width="27.7333"
          height="27.7333"
          fill="white"
          transform="translate(0.133789 0.133331)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default EyeIcon;
