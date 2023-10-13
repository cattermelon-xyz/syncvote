import { MouseEventHandler } from 'react';

type Props = {
  onMouseOver?: MouseEventHandler<SVGSVGElement>;
  w?: string;
  h?: string;
};

const AlertIcon = ({ w = '24', h = '24', onMouseOver = () => {} }: Props) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onMouseOver={onMouseOver}
  >
    <rect width="24" height="24" fill="white" />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AlertIcon;
