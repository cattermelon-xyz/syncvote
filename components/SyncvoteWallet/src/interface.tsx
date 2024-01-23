import { getValue } from './utils';
import { SVW_STORAGE_KEY } from './utils';

export const getAccount = () => {
  const anyWindow = window as any;
  const chain = getValue('chain');
  // console.log('chain: ', chain);
  // const ethAddress = anyWindow.ethereum?.selectedAddress;
  // const solAddress = anyWindow.solana?.publicKey?.toBase58();
  console.log('anyWindow.ethereum: ', anyWindow.ethereum);
  console.log('anyWindow.solana: ', anyWindow.solana);
  if (chain === 'ethereum') {
    return getValue('account');
  } else if (chain === 'solana') {
    return getValue('account');
  }
  // else {
  //   return ethAddress || solAddress;
  // }
};

export const disconnect = async () => {
  async () => {
    const anyWindow = window as any;
    const chain = getValue('chain');
    switch (chain) {
      case 'ethereum':
        // TODO: disconnect from ethereum
        break;
      case 'solana':
        anyWindow.phantom.solana?.disconnect();
        break;
      default:
    }
  };
};

export const disconnectWallet = () => {
  localStorage.removeItem(SVW_STORAGE_KEY);
};

export const getProvider = () => {
  const anyWindow = window as any;
  const chain = getValue('chain');
  switch (chain) {
    case 'ethereum':
      return anyWindow.ethereum;
    case 'solana':
      return anyWindow.phantom.solana;
    default:
      return anyWindow.ethereum || anyWindow.solana;
  }
};

export const connect = async () => {};
