import React, { MouseEventHandler } from 'react';

type Props = {
  onClick?: MouseEventHandler<SVGSVGElement>;
};

const ArrowDownIcon = ({ onClick = () => {} }: Props) => (
  <svg
    onClick={onClick}
    width="100%"
    height="100%"
    viewBox="0 0 12 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L6 6L11 1"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowDownIcon;
