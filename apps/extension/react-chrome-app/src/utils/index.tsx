import axios from 'axios';
const serverUrl = process.env.BACKEND_URL as string;
const frontEndUrl = process.env.FRONTEND_URL as string;

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

export const vote = async (data: any) => {
  const apiUrl = `${serverUrl}/vote/create`;
  try {
    const response = await axios.post(apiUrl, data);
    if (response.status === 200) {
      return { data: response.data, error: null };
    } else {
      return { data: null, error: response };
    }
  } catch (error) {
    return { data: null, error: error };
  }
};

export const openMissionPage = (orgId: string, proposalId: string) => {
  chrome.runtime.sendMessage({
    action: 'openUrl',
    payload: { url: `${frontEndUrl}/${orgId}/${proposalId}?view=full` },
  });
};

export const openWorkflowPage = (
  orgId: string,
  workflowId: string,
  wvId: string
) => {
  chrome.runtime.sendMessage({
    action: 'openUrl',
    payload: { url: `${frontEndUrl}/public/${orgId}/${workflowId}/${wvId}` },
  });
};
