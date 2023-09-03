type Props = {
  width?: string;
  height?: string;
};

function ButtonRight(props: Props) {
  const { width = '24', height = '24' } = props;
  return (
    <svg
      width='60'
      height='60'
      viewBox='0 0 60 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M27 36L33 30L27 24'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <rect x='0.5' y='0.5' width='59' height='59' rx='29.5' stroke='#E3E3E2' />
    </svg>
  );
}

export default ButtonRight;
