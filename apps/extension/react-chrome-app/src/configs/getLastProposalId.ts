import { chromeStorageKeys } from '@constants/chrome';

export async function getLastProposalId(): Promise<null | {
  id: number;
}> {
  const lastProposalId = (
    await chrome.storage.sync.get(chromeStorageKeys.lastProposalId)
  )[chromeStorageKeys.lastProposalId];

  if (lastProposalId !== undefined) {
    return { id: lastProposalId };
  }

  return null;
}
