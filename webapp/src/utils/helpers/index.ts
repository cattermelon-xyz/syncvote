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

export const sliceAddressToken = (addressToken: string, tokenLength: number = 4) => {
  if (addressToken.length <= 8) {
    return addressToken;
  }
  return `${addressToken.slice(0, tokenLength)}...${addressToken.slice(-tokenLength)}`;
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
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

export const createIdString = (title:String, id:String) => {
  let result = '';
  result = title.toLocaleLowerCase().replace(/([^\w ]|_)/g, '');
  result = result.split(' ').join('-');
  return `${result}-${id}`;
};

export const extractIdFromIdString = (idString:String | undefined) => {
  if (!idString) return -1;
  const id = idString?.split('-').pop();
  if (id === undefined) return -1;
  return parseInt(id, 10);
};

export const getImageUrl = ({ filePath = '', isPreset, type }: {
  filePath?: string,
  isPreset: boolean,
  type: string
}):string => {
  if (filePath === null || filePath === 'null') {
    return '';
  }
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  let str = '';
  if (isPreset) {
    str = `${supabaseUrl}/storage/v1/object/public/preset_images/${type}/${filePath}`;
  } else if (filePath) {
    str = `${supabaseUrl}/storage/v1/object/public/public_images/${filePath}`;
  }
  return str;
};

export const shouldUseCachedData = (lastFetch: number) => {
  const now = new Date().getTime();
  if (!lastFetch || lastFetch < 0) {
    return false;
  }
  if (now - lastFetch < cacheTime) {
    return true;
  }
  console.log('should reload');
  return false;
};
