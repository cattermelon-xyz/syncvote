import { getValue } from './utils';

export const getAccount = () => {
  const anyWindow = window as any;
  const chain = getValue('chain');
  console.log('chain: ', chain);
  const ethAddress = anyWindow.ethereum?.selectedAddress;
  const solAddress = anyWindow.solana?.publicKey?.toBase58();
  if (chain === 'ethereum') {
    return ethAddress;
  } else if (chain === 'solana') {
    return solAddress;
  } else {
    return ethAddress || solAddress;
  }
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
