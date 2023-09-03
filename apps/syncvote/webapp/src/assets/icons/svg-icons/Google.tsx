/* eslint-disable max-len */
import React from 'react';

type Props = {
  width?: string;
  height?: string;
};

function Google(props: Props) {
  const { width = '24', height = '24' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" transform="translate(0 0.5)" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.04 12.7615C23.04 11.946 22.9668 11.1619 22.8309 10.4092H12V14.8576H18.1891C17.9225 16.2951 17.1123 17.513 15.8943 18.3285V21.214H19.6109C21.7855 19.2119 23.04 16.2637 23.04 12.7615Z"
        fill="#4285F4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9995 23.9996C15.1045 23.9996 17.7077 22.9698 19.6104 21.2134L15.8938 18.328C14.864 19.018 13.5467 19.4257 11.9995 19.4257C9.00425 19.4257 6.46902 17.4028 5.5647 14.6846H1.72266V17.6641C3.61493 21.4225 7.50402 23.9996 11.9995 23.9996Z"
        fill="#34A853"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.56523 14.6855C5.33523 13.9955 5.20455 13.2584 5.20455 12.5005C5.20455 11.7425 5.33523 11.0055 5.56523 10.3155V7.33594H1.72318C0.944318 8.88844 0.5 10.6448 0.5 12.5005C0.5 14.3562 0.944318 16.1125 1.72318 17.665L5.56523 14.6855Z"
        fill="#FBBC05"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9995 5.57386C13.6879 5.57386 15.2038 6.15409 16.3956 7.29364L19.694 3.99523C17.7024 2.13955 15.0992 1 11.9995 1C7.50402 1 3.61493 3.57705 1.72266 7.33545L5.5647 10.315C6.46902 7.59682 9.00425 5.57386 11.9995 5.57386Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default Google;
