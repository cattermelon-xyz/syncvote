/* eslint-disable max-len */
import React from 'react';

interface Props {
  width?: string;
  height?: string;
}

const Logo: React.FC<Props> = ({ width = 128, height = 24 }) => (
  <img
    src="/LogoSyncVote.svg"
    alt="logo"
    width={width}
    height={height}
  />
);

export default Logo;
