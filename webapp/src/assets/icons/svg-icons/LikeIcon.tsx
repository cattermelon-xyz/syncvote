import React from 'react';

interface Props {
  color?: string;
}

const LikeIcon: React.FC<Props> = ({ color = '#898988' }) => (
  <svg width={24} height={24} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.8664 38.8669H7.66637C6.74696 38.8669 5.8652 38.5016 5.21507 37.8515C4.56494 37.2014 4.19971 36.3196 4.19971 35.4002V23.2669C4.19971 22.3474 4.56494 21.4657 5.21507 20.8156C5.8652 20.1654 6.74696 19.8002 7.66637 19.8002H12.8664M24.9997 16.3335V9.4002C24.9997 8.02107 24.4519 6.69843 23.4767 5.72324C22.5015 4.74805 21.1788 4.2002 19.7997 4.2002L12.8664 19.8002V38.8669H32.4184C33.2544 38.8763 34.0657 38.5833 34.7027 38.0418C35.3398 37.5003 35.7597 36.7468 35.885 35.9202L38.277 20.3202C38.3525 19.8233 38.3189 19.316 38.1788 18.8334C38.0387 18.3508 37.7954 17.9044 37.4656 17.5252C37.1358 17.146 36.7276 16.843 36.2691 16.6372C35.8106 16.4315 35.3129 16.3278 34.8104 16.3335H24.9997Z"
      stroke={color}
      strokeWidth="3.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LikeIcon;