import React from 'react';
import Metamask from '../assets/Metamask';
import Phantom from '../assets/Phantom';
import { FaEthereum } from 'react-icons/fa6';
import Solana from '../assets/Solana';
import { setValue } from './utils';

const wallets = [
  {
    name: 'Metamask',
    icon: <Metamask />,
    chains: [
      {
        name: 'Ethereum',
        icon: <FaEthereum />,
        chain: 'ethereum',
        // rpc: 'https://mainnet.infura.io/v3/',
        connect: async () => {
          const anyWindow = window as any;
          const res = await anyWindow.ethereum?.request({
            method: 'wallet_requestPermissions',
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
          console.log('res', res);
          setValue('wallet', 'metamask');
          setValue('chain', 'ethereum');
          setValue('account', res[0]?.caveats[0]?.value[0]);
          return {
            account: res[0]?.caveats[0]?.value[0],
            chain: 'ethereum',
            wallet: 'metamask',
          };
        },
      },
    ],
    available:
      ((window as any).ethereum?.isMetaMask &&
        !(window as any).ethereum?.isPhantom) ||
      false,
    title: !(window as any).ethereum?.isMetaMask
      ? 'No Metamask'
      : (window as any).ethereum?.isPhantom
      ? 'Conflict with Phantom'
      : '',
  },
  {
    name: 'Phantom',
    icon: <Phantom />,
    chains: [
      {
        name: 'Ethereum',
        icon: <FaEthereum />,
        chain: 'ethereum',
        // rpc: 'https://mainnet.infura.io/v3/',
        connect: async () => {
          const anyWindow = window as any;
          console.log(anyWindow.ethereum);
          const accounts = await anyWindow.ethereum?.request({
            method: 'eth_requestAccounts',
          });
          setValue('wallet', 'phantom');
          setValue('chain', 'ethereum');
          setValue('account', accounts[0]);
          return { account: accounts[0], chain: 'ethereum', wallet: 'phantom' };
        },
      },
      {
        name: 'Solana',
        icon: <Solana />,
        chain: 'solana',
        // rpc: 'https://api.mainnet-beta.solana.com',
        connect: async () => {
          const anywindow = window as any;
          const result = await anywindow.phantom?.solana.connect();
          setValue('wallet', 'phantom');
          setValue('chain', 'solana');
          setValue('account', result?.publicKey?.toBase58());
          console.log(result?.publicKey?.toBase58());
          return {
            account: result?.publicKey?.toBase58(),
            chain: 'solana',
            wallet: 'phantom',
          };
        },
      },
    ],
    available: (window as any).phantom?.solana || false,
  },
];

export default wallets;
