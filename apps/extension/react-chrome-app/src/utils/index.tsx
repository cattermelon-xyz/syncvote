export const trimTitle = (title: string) => {
  if (!title) return '';
  return title.length > 30 ? title.slice(0, 30) + '...' : title;
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
