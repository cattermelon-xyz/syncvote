import React from 'react';

interface Props {
  color?: string;
}

const ZapOffIcon: React.FC<Props> = ({ color = '#898988' }) => (
  <svg width={24} height={24} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1170_8855)">
      <path
        d="M22.2445 12.4335L23.2672 4.2002L19.0552 9.26153"
        stroke={color}
        strokeWidth="3.46667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.9214 23.1109L37.1334 18.0669H27.8774"
        stroke={color}
        strokeWidth="3.46667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5998 14.6001L5.93311 25.0001H21.5331L19.7998 38.8668L28.4664 28.4668"
        stroke={color}
        strokeWidth="3.46667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.46631 2.4668L40.5996 40.6001"
        stroke={color}
        strokeWidth="3.46667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1170_8855">
        <rect width="41.6" height="41.6" fill="white" transform="translate(0.733398 0.733398)" />
      </clipPath>
    </defs>
  </svg>
);

export default ZapOffIcon;
