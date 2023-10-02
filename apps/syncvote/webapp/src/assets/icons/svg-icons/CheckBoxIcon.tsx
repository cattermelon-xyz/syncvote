import React from 'react';

interface Props {
  width?: string;
  height?: string;
  color?: string;
}

const CheckBoxIcon: React.FC<Props> = ({ width = 24, height = 24, color = '#E3E3E2' }) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        d="M7.5 9.66659L10 12.1666L18.3333 3.83325"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10.5V16.3333C17.5 16.7754 17.3244 17.1993 17.0118 17.5118C16.6993 17.8244 16.2754 18 15.8333 18H4.16667C3.72464 18 3.30072 17.8244 2.98816 17.5118C2.67559 17.1993 2.5 16.7754 2.5 16.3333V4.66667C2.5 4.22464 2.67559 3.80072 2.98816 3.48816C3.30072 3.17559 3.72464 3 4.16667 3H13.3333"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default CheckBoxIcon;
