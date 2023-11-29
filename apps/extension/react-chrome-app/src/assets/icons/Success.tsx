/* eslint-disable max-len */
import React from 'react';

type Props = {
  width?: string;
  height?: string;
};

function Success(props: Props) {
  const { width = '20', height = '20' } = props;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
    >
      <path
        d='M16.6654 5.00195L7.4987 14.1686L3.33203 10.002'
        stroke='#29A259'
        stroke-width='1.62963'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
}

export default Success;
