import { chromeStorageKeys } from '@constants/chrome';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'signInWithGoogle': {
      // remove any old listener if exists
      chrome.tabs.onUpdated.removeListener(setTokens);
      const url = request.payload.url;

      // create new tab with that url
      chrome.tabs.create({ url: url, active: true }, (tab) => {
        // add listener to that url and watch for access_token and refresh_token query string params
        chrome.tabs.onUpdated.addListener(setTokens);
        sendResponse(request.action + ' executed');
      });

      break;
    }

    case 'handlePostDiscourse': {
      const url = request.payload.url;

      chrome.tabs.create({ url: url, active: true }, (tab) => {
        sendResponse(request.action + ' executed');
      });
      break;
    }

    case 'handleCreateSnapshot': {
      const url = request.payload.url;

      chrome.tabs.create({ url: url, active: true }, (tab) => {
        sendResponse(request.action + ' executed');
      });
      break;
    }

    default:
      break;
  }

  return true;
});

const setTokens = async (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  // once the tab is loaded
  if (tab.status === 'complete') {
    if (!tab.url) return;
    const url = new URL(tab.url);

    // at this point user is logged-in to the web app
    // parse access_token and refresh_token from query string params
    if (url.origin === 'https://app.syncvote.com') {
      const hashParams = new URLSearchParams(url.hash.slice(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        if (!tab.id) return;

        await chrome.tabs.remove(tab.id);

        // store access_token and refresh_token in storage as these will be used to authenticate user in chrome extension
        await chrome.storage.sync.set({
          [chromeStorageKeys.gauthAccessToken]: accessToken,
        });

        await chrome.storage.sync.set({
          [chromeStorageKeys.gauthRefreshToken]: refreshToken,
        });

        // remove tab listener as tokens are set
        chrome.tabs.onUpdated.removeListener(setTokens);
      }
    }
  }
};
export {};
