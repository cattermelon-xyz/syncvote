import React from 'react';

interface Props {
  onClick?: () => void;
}

const OnChainIcon: React.FC<Props> = ({ onClick = () => {} }: Props) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M20 15.4999V7.99988L13.75 4.48438M10.25 4.48438L4 7.99988V15.4999M5.5 17.8439L12 21.4999L16 19.2499L18.5 17.8434M12 8.99988L13.5 9.87488L15 10.7499V14.2499L13.5 15.1249L12 15.9999L10.5 15.1249L9 14.2499V10.7499L10.5 9.87488L12 8.99988ZM12 8.99988V5.49988M15 13.9999L18.5 15.9999M9 13.9999L5.5 15.9999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5.5C12.8284 5.5 13.5 4.82843 13.5 4C13.5 3.17157 12.8284 2.5 12 2.5C11.1716 2.5 10.5 3.17157 10.5 4C10.5 4.82843 11.1716 5.5 12 5.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 18.5C4.82843 18.5 5.5 17.8284 5.5 17C5.5 16.1716 4.82843 15.5 4 15.5C3.17157 15.5 2.5 16.1716 2.5 17C2.5 17.8284 3.17157 18.5 4 18.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 18.5C20.8284 18.5 21.5 17.8284 21.5 17C21.5 16.1716 20.8284 15.5 20 15.5C19.1716 15.5 18.5 16.1716 18.5 17C18.5 17.8284 19.1716 18.5 20 18.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OnChainIcon;
