export const SVW_STORAGE_KEY = 'svw-1.0.0';

export interface SVW {
  network?: string; // mainnet, testnet
  chain?: string; // ethereum, solana
  account?: string;
  wallet?: string; // metamask, phantom
}

export const setValue = (key: keyof SVW, value: any) => {
  const str = localStorage.getItem(SVW_STORAGE_KEY);
  let data: any = {};
  try {
    data = str ? JSON.parse(str) : {};
  } catch (e) {}
  data[key] = value;
  localStorage.setItem(SVW_STORAGE_KEY, JSON.stringify(data));
};

export const getValue = (key: keyof SVW) => {
  const str = localStorage.getItem(SVW_STORAGE_KEY);
  let data: any = {};
  try {
    data = str ? JSON.parse(str) : {};
  } catch (e) {}
  return data[key];
};
