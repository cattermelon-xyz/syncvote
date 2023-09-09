import copy from 'copy-to-clipboard';
import { AlertMessage } from 'types/common';

const cacheTime = import.meta.env.VITE_CACHED_TIME;
export const isSelected = (item: any, listSelected: Array<any>) =>
  listSelected &&
  listSelected?.length > 0 &&
  listSelected.findIndex((element) => element?.id === item?.id) > -1;

export const prependZero = (number: number) => {
  if (number < 9) return `0${number}`;
  return number;
};

export const randomIcon = () => {
  const icons = [
    'love.svg',
    'cat.svg',
    'money.svg',
    'angel.svg',
    'dribble.svg',
  ];
  return `${icons[Math.floor(Math.random() * icons.length)]}`;
};

export const createRootLink = (paths: Array<string> = []) => {
  const root = '/';
  let result = '';

  if (paths?.length === 0) {
    return '/';
  }

  paths.map((path) => {
    if (!path.includes(root)) {
      result += `${root}${path}`;
    }
    return path;
  });
  return result;
};

export interface OutletContext {
  params: {
    [key: string]: string;
  };
}

export const sliceAddressToken = (
  addressToken: string,
  tokenLength: number = 4
) => {
  if (addressToken.length <= 8) {
    return addressToken;
  }
  return `${addressToken.slice(0, tokenLength)}...${addressToken.slice(
    -tokenLength
  )}`;
};

export function getRouteId({
  parentId = '',
  id,
}: {
  parentId: string | number | null;
  id: string | number;
}) {
  return `${parentId}-${id}`;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function unsecuredCopyToClipboard(text: string) {
  copy(text);
}

export const generateId = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const renderValidateStatus = (condition: AlertMessage | null) => {
  if (!condition) return '';
  if (condition.type === 'ERROR') {
    return 'border-red-version-5';
  }
  if (condition.type === 'WARN') {
    return 'border-yellow-version-5';
  }
  if (condition.type === 'SUCCESS') {
    return 'border-green-version-5';
  }
  return '';
};

export const shouldUseCachedData = (lastFetch: number) => {
  const now = new Date().getTime();
  if (!lastFetch || lastFetch < 0) {
    return false;
  }
  if (now - lastFetch < cacheTime) {
    return true;
  }
  return false;
};

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;

    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * 13 - 4 = 9; 13: minuend, 4: substrahend, 9: difference
 * @param minuend: number[]
 * @param subtrahend: number[]
 * @returns number[] of which elements are in minuend but not in substrahend
 */
