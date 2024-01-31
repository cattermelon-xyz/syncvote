import { chromeStorageKeys } from '@constants/chrome';
import { PAGE_ROUTER } from '@constants/common';

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

export async function getLastPage(): Promise<string> {
  const lastPage = (await chrome.storage.sync.get(chromeStorageKeys.lastPage))[
    chromeStorageKeys.lastPage
  ];

  if (lastPage !== undefined) {
    return lastPage;
  }

  return PAGE_ROUTER.HOME_PAGE;
}

export async function getLastOrgId(): Promise<string> {
  const lastOrgId = (
    await chrome.storage.sync.get(chromeStorageKeys.lastOrgId)
  )[chromeStorageKeys.lastOrgId];

  return lastOrgId !== null ? lastOrgId : '';
}
