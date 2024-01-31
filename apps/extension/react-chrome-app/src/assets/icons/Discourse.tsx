/* eslint-disable max-len */
import React from 'react';

type Props = {
  width?: string;
  height?: string;
};

function Discourse(props: Props) {
  const { width = '18', height = '18' } = props;
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 18 18'
      fill='none'
    >
      <g clip-path='url(#clip0_10285_8723)'>
        <path
          d='M9.00262 0.117188C4.17881 0.117188 0.117188 4.02675 0.117188 8.85091V17.8947L9.00086 17.8862C13.8248 17.8862 17.7373 13.8258 17.7373 9.00337C17.7373 4.18097 13.8213 0.117188 9.00262 0.117188Z'
          fill='black'
        />
        <path
          d='M9.09198 3.49609C7.18403 3.49733 5.41745 4.50182 4.44127 6.14066C3.46508 7.7795 3.4233 9.81086 4.33145 11.4885L3.35156 14.6394L6.87027 13.8449C8.88504 14.7522 11.2494 14.3447 12.8439 12.815C14.4383 11.2853 14.9429 8.94051 14.1187 6.89063C13.2946 4.84076 11.307 3.49715 9.09709 3.49609H9.09198Z'
          fill='#FFF9AE'
        />
        <path
          d='M13.3262 12.2585C11.788 14.1983 9.12953 14.8476 6.87027 13.8352L3.35156 14.6401L6.93355 14.2171C9.30809 15.6076 12.3484 14.9958 13.9999 12.7951C15.6513 10.5943 15.3882 7.50506 13.3882 5.61523C14.8899 7.58332 14.8643 10.319 13.3262 12.2585Z'
          fill='#00AEEF'
        />
        <path
          d='M13.0232 11.2307C11.6962 13.3202 9.12018 14.2435 6.7675 13.4725L3.35156 14.6406L6.87027 13.8443C9.37613 14.9758 12.3325 14.0494 13.7441 11.6904C15.1557 9.33136 14.5738 6.28934 12.3912 4.61719C14.0901 6.41783 14.3503 9.14118 13.0232 11.2307Z'
          fill='#00A94F'
        />
        <path
          d='M4.65526 11.609C3.67467 9.24571 4.48269 6.51901 6.59282 5.07141C8.70295 3.62363 11.5388 3.85047 13.3917 5.61516C11.6756 3.36365 8.51399 2.81408 6.1384 4.35422C3.7628 5.89453 2.97523 9.00424 4.33145 11.4891L3.35156 14.6401L4.65526 11.609Z'
          fill='#F15D22'
        />
        <path
          d='M4.34416 11.4898C3.12737 9.24286 3.64789 6.4513 5.59268 4.79342C7.53747 3.13572 10.3768 3.06293 12.4039 4.61911C10.4595 2.57223 7.26796 2.36284 5.07251 4.13792C2.87706 5.91301 2.41453 9.07683 4.01013 11.4057L3.36604 14.6425L4.34416 11.4898Z'
          fill='#D0232B'
        />
      </g>
      <defs>
        <clipPath id='clip0_10285_8723'>
          <rect
            width='17.6223'
            height='17.7775'
            fill='white'
            transform='translate(0.117188 0.117188)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Discourse;
