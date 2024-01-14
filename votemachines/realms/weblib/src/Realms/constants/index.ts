import { PublicKey } from '@solana/web3.js';

export type EndpointTypes = 'mainnet' | 'devnet' | 'localnet';

export const tryParseKey = (key: string): PublicKey | null => {
  try {
    return new PublicKey(key);
  } catch (error) {
    return null;
  }
};

export type TokenProgramAccount<T> = {
  publicKey: PublicKey;
  account: T;
};
