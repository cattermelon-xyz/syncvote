type Props = {
  width?: string;
  height?: string;
};

function ConnectWallet(props: Props) {
  const { width = '24', height = '24' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        width='28'
        height='28'
        rx='4'
        fill='url(#paint0_linear_6283_61429)'
      />
      <path
        d='M4.66699 8.8665H6.06699C13.2835 8.8665 19.1337 14.7166 19.1337 21.9332V23.3332H21.9337C22.7069 23.3332 23.3337 22.7064 23.3337 21.9332C23.3337 12.3971 15.6031 4.6665 6.06699 4.6665C5.29379 4.6665 4.66699 5.29331 4.66699 6.0665V8.8665Z'
        fill='url(#paint1_radial_6283_61429)'
      />
      <path
        d='M19.6006 21.9331H23.3339C23.3339 22.7063 22.7071 23.3331 21.9339 23.3331H19.6006V21.9331Z'
        fill='url(#paint2_linear_6283_61429)'
      />
      <path
        d='M6.06699 4.6665L6.06699 8.39984H4.66699L4.66699 6.0665C4.66699 5.29331 5.29379 4.6665 6.06699 4.6665Z'
        fill='url(#paint3_linear_6283_61429)'
      />
      <path
        d='M4.66699 8.3999H6.06699C13.5412 8.3999 19.6003 14.459 19.6003 21.9332V23.3332H15.4003V21.9332C15.4003 16.7786 11.2217 12.5999 6.06699 12.5999H4.66699V8.3999Z'
        fill='url(#paint4_radial_6283_61429)'
      />
      <path
        d='M15.8672 21.9331H19.6005V23.3331H15.8672V21.9331Z'
        fill='url(#paint5_linear_6283_61429)'
      />
      <path
        d='M4.66699 12.1332L4.66699 8.3999L6.06699 8.3999L6.06699 12.1332H4.66699Z'
        fill='url(#paint6_linear_6283_61429)'
      />
      <path
        d='M4.66699 14.4666C4.66699 15.2398 5.29379 15.8666 6.06699 15.8666C9.41752 15.8666 12.1337 18.5828 12.1337 21.9333C12.1337 22.7065 12.7605 23.3333 13.5337 23.3333H15.867V21.9333C15.867 16.5209 11.4794 12.1333 6.06699 12.1333H4.66699V14.4666Z'
        fill='url(#paint7_radial_6283_61429)'
      />
      <path
        d='M12.1338 21.9331H15.8671V23.3331H13.5338C12.7606 23.3331 12.1338 22.7063 12.1338 21.9331Z'
        fill='url(#paint8_radial_6283_61429)'
      />
      <path
        d='M6.06699 15.8666C5.29379 15.8666 4.66699 15.2398 4.66699 14.4666L4.66699 12.1333L6.06699 12.1333L6.06699 15.8666Z'
        fill='url(#paint9_radial_6283_61429)'
      />
      <defs>
        <linearGradient
          id='paint0_linear_6283_61429'
          x1='14'
          y1='0'
          x2='14'
          y2='28'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#174299' />
          <stop offset='1' stopColor='#001E59' />
        </linearGradient>
        <radialGradient
          id='paint1_radial_6283_61429'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(6.06699 21.9332) rotate(-90) scale(17.2667)'
        >
          <stop offset='0.770277' stopColor='#FF4000' />
          <stop offset='1' stopColor='#8754C9' />
        </radialGradient>
        <linearGradient
          id='paint2_linear_6283_61429'
          x1='19.3673'
          y1='22.6331'
          x2='23.3339'
          y2='22.6331'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FF4000' />
          <stop offset='1' stopColor='#8754C9' />
        </linearGradient>
        <linearGradient
          id='paint3_linear_6283_61429'
          x1='5.36699'
          y1='4.6665'
          x2='5.36699'
          y2='8.63317'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#8754C9' />
          <stop offset='1' stopColor='#FF4000' />
        </linearGradient>
        <radialGradient
          id='paint4_radial_6283_61429'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(6.06699 21.9332) rotate(-90) scale(13.5333)'
        >
          <stop offset='0.723929' stopColor='#FFF700' />
          <stop offset='1' stopColor='#FF9901' />
        </radialGradient>
        <linearGradient
          id='paint5_linear_6283_61429'
          x1='15.8672'
          y1='22.6331'
          x2='19.6005'
          y2='22.6331'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFF700' />
          <stop offset='1' stopColor='#FF9901' />
        </linearGradient>
        <linearGradient
          id='paint6_linear_6283_61429'
          x1='5.36699'
          y1='12.1332'
          x2='5.36699'
          y2='8.3999'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFF700' />
          <stop offset='1' stopColor='#FF9901' />
        </linearGradient>
        <radialGradient
          id='paint7_radial_6283_61429'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(6.06699 21.9333) rotate(-90) scale(9.8)'
        >
          <stop offset='0.59513' stopColor='#00AAFF' />
          <stop offset='1' stopColor='#01DA40' />
        </radialGradient>
        <radialGradient
          id='paint8_radial_6283_61429'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(11.9005 22.6331) scale(3.96667 10.5778)'
        >
          <stop stopColor='#00AAFF' />
          <stop offset='1' stopColor='#01DA40' />
        </radialGradient>
        <radialGradient
          id='paint9_radial_6283_61429'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(5.36699 16.1) rotate(-90) scale(3.96667 75.2197)'
        >
          <stop stopColor='#00AAFF' />
          <stop offset='1' stopColor='#01DA40' />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default ConnectWallet;
