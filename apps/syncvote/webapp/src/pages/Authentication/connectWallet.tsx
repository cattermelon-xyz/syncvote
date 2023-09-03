import Metamask from '@assets/icons/svg-icons/Metamask';
import WalletConnect from '@assets/icons/svg-icons/WalletConnect';
import Coinbase from '@assets/icons/svg-icons/Coinbase';
import Zengo from '@assets/icons/svg-icons/Zengo';
import BlockWallet from '@assets/icons/svg-icons/BlockWallet';
import Binance from '@assets/icons/svg-icons/Binance';
import MathWallet from '@assets/icons/svg-icons/MathWallet';
import Phantom from '@assets/icons/svg-icons/Phantom';
import Solfare from '@assets/icons/svg-icons/Solfare';
import Protocol from '@assets/icons/svg-icons/Protocol';
import Polygon from '@assets/icons/svg-icons/Polygon';
import BSC from '@assets/icons/svg-icons/BSC';
import Solana from '@assets/icons/svg-icons/Solana';

export interface ListOptionsConnectWallet {
  id: number;
  value: string;
  label: string;
  icon: any;
}

export const listOptionsConnectWallet: ListOptionsConnectWallet[] = [
  {
    id: 1,
    value: 'Ethereum',
    label: 'Ethereum',
    icon: <Protocol />,
  },
  {
    id: 2,
    value: 'Polygon',
    label: 'Polygon',
    icon: <Polygon />,
  },
  {
    id: 3,
    value: 'BSC',
    label: 'BSC',
    icon: <BSC />,
  },
  {
    id: 4,
    value: 'Solana',
    label: 'Solana',
    icon: <Solana />,
  },
];

export interface ListConnectWallet {
  id: number;
  optionId: number;
  label: string;
  icon: any;
}

export const listConnectWallet: ListConnectWallet[] = [
  {
    id: 1,
    optionId: 1,
    label: 'Metamask',
    icon: <Metamask />,
  },
  {
    id: 2,
    optionId: 1,
    label: 'Wallet Connect',
    icon: <WalletConnect />,
  },
  {
    id: 3,
    optionId: 1,
    label: 'Coinbase',
    icon: <Coinbase />,
  },
  {
    id: 4,
    optionId: 2,
    label: 'Zengo',
    icon: <Zengo />,
  },
  {
    id: 5,
    optionId: 2,
    label: 'Block Wallet',
    icon: <BlockWallet />,
  },
  {
    id: 6,
    optionId: 2,
    label: 'Binance',
    icon: <Binance />,
  },
  {
    id: 7,
    optionId: 3,
    label: 'Metamask',
    icon: <Metamask />,
  },
  {
    id: 8,
    optionId: 3,
    label: 'Wallet Connect',
    icon: <WalletConnect />,
  },
  {
    id: 9,
    optionId: 3,
    label: 'Math wallet',
    icon: <MathWallet />,
  },
  {
    id: 10,
    optionId: 4,
    label: 'Phantom',
    icon: <Phantom />,
  },
  {
    id: 11,
    optionId: 4,
    label: 'Solfare',
    icon: <Solfare />,
  },
  {
    id: 12,
    optionId: 4,
    label: 'Math wallet',
    icon: <MathWallet />,
  },
];
