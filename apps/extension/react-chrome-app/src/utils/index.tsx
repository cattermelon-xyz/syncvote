export const trimTitle = (title: string, len?: number) => {
  const maxLen = len || 30;
  if (!title) return '';
  return title.length > maxLen ? title.slice(0, maxLen) + '...' : title;
};

export const resetLastProposalId = async () => {
  await chrome.runtime.sendMessage({
    action: 'saveLastProposalId',
    payload: -1,
  });
};

export const saveLastProposalId = async (id: number) => {
  await chrome.runtime.sendMessage({
    action: 'saveLastProposalId',
    payload: id,
  });
};

export const extractCurrentCheckpointId = (inputStr: string) => {
  const parts = inputStr.split('-');
  if (parts.length <= 1) {
    return null;
  }
  parts.shift();
  return parts.join('-');
};

export const createIdString = (title: String, id: String) => {
  let result = '';
  result = title.toLocaleLowerCase().replace(/([^\w ]|_)/g, '');
  result = result.split(' ').join('-');
  return `${result}-${id}`;
};
