/* eslint-disable max-len */
import React from 'react';

type Props = {
  width?: string;
  height?: string;
};

function DoneIcon(props: Props) {
  const { width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clip-path='url(#clip0_9878_84878)'>
        <path
          d='M14.6654 7.38723V8.00056C14.6645 9.43818 14.199 10.837 13.3383 11.9884C12.4775 13.1399 11.2676 13.9822 9.88894 14.3898C8.51032 14.7974 7.03687 14.7485 5.68835 14.2503C4.33982 13.7521 3.18847 12.8313 2.406 11.6253C1.62354 10.4193 1.25189 8.9926 1.34648 7.5581C1.44107 6.1236 1.99684 4.75811 2.93088 3.66528C3.86493 2.57244 5.12722 1.81082 6.52949 1.49399C7.93176 1.17717 9.39888 1.32212 10.712 1.90723'
          stroke='#29A259'
          stroke-width='1.33333'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M14.6667 2.66602L8 9.33935L6 7.33935'
          stroke='#29A259'
          stroke-width='1.33333'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_9878_84878'>
          <rect width='16' height='16' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default DoneIcon;
