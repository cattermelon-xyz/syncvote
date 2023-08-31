import { SVGProps } from 'react';

interface UseProps extends SVGProps<SVGUseElement> {
  xlinkHref?: string;
  xmlnsXlink?: string;
}

function WalletConnect({ xlinkHref, xmlnsXlink }: UseProps) {
  return <img alt="WalletConnect" src="/assets/images/walletconnectW.png" />;
}

export default WalletConnect;
