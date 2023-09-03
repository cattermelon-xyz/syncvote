import React from 'react';

interface Props {
  color?: string;
  w?: string | null;
  h?: string | null;
}

const QuestionCircleIcon: React.FC<Props> = ({ color = '#E3E3E2', w, h }) => (
  <svg
    width={w || '32px'}
    height={h || '32px'}
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.5335 38.8667C31.1065 38.8667 38.8669 31.1063 38.8669 21.5333C38.8669 11.9604 31.1065 4.20001 21.5335 4.20001C11.9606 4.20001 4.2002 11.9604 4.2002 21.5333C4.2002 31.1063 11.9606 38.8667 21.5335 38.8667Z"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.4893 16.3334C16.8968 15.1749 17.7011 14.1981 18.7598 13.5759C19.8186 12.9536 21.0633 12.7262 22.2737 12.9338C23.4841 13.1414 24.5819 13.7707 25.3727 14.7102C26.1636 15.6496 26.5964 16.8387 26.5946 18.0667C26.5946 21.5334 21.3946 23.2667 21.3946 23.2667"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.5332 30.2H21.5505"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default QuestionCircleIcon;
