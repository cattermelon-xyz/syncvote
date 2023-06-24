import React from 'react';

interface Props {
  color?: string;
}

const CheckCircleIcon: React.FC<Props> = ({ color = '#898988' }) => (
  <svg width={24} height={24} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M38.8664 19.9387V21.5333C38.8642 25.2711 37.6539 28.9081 35.4159 31.9018C33.1779 34.8955 30.0321 37.0856 26.4477 38.1454C22.8633 39.2052 19.0323 39.0779 15.5261 37.7826C12.02 36.4873 9.02644 34.0932 6.99204 30.9576C4.95764 27.8219 3.99135 24.1126 4.23728 20.3829C4.48322 16.6532 5.9282 13.103 8.35673 10.2616C10.7853 7.4202 14.0672 5.43998 17.7131 4.61624C21.359 3.79249 25.1735 4.16937 28.5877 5.69065"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38.8663 7.66669L21.533 25.0174L16.333 19.8174"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckCircleIcon;
