import React, { useState, useEffect } from 'react';
import { StringLiteral } from 'typescript';
import WF_Icon from '../assets/WF Icon.png';
import Member_Icon from '../assets/Member Icon.png';
import Calender from '../assets/Calendar Icon.png';
import Globe from '../assets/Globe Icon.png';
import Identity_Blank from '../assets/Blank.png';
import Mail from '../assets/mail.png';
import { supabase, getImageUrl } from 'utils';
import { useDispatch } from 'react-redux';
import { setSelectedWorkspace } from '../slices/workspaceSlice';
import { useNavigate } from 'react-router-dom';

export type { User, Workspace, Workflow };

type User = {
  id: number;
  icon_url: string;
  full_name: string;
  email: string;
  confirm_email_at: string;
};

type UsersTableProps = {
  users: User[];
};

type Workspace = {
  id: number;
  icon_url: string;
  title: string;
  workflows: number;
  members: number;
};

type WorkspaceTableProps = {
  workspace: Workspace[];
};

type Workflow = {
  id: number;
  title: string;
  icon_url: string;
  workspacename: string;
  owner_org_id: string;
  created_at: string;
};

type WorkflowTableProps = {
  workflow: Workflow[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString('en-US', options);
}

function UsersTable({ users }: UsersTableProps) {
  const ITEMS_PER_PAGE = 10;
  const [numItemsToShow, setNumItemsToShow] = useState(ITEMS_PER_PAGE);

  const handleShowMore = () => {
    // Increase the number of items to show
    setNumItemsToShow(numItemsToShow + ITEMS_PER_PAGE);
  };

  return (
    <div className=' text-[#BBBBBA] rounded-2xl border border-gray-700 bg-[#0b0b0b] border-separate border-spacing-1 py-5 px-3'>
      <table className='min-w-full'>
        <tbody>
          {users.slice(0, numItemsToShow).map((user: User) => (
            <tr key={user.id} className='h-12'>
              <td className='py-3 px-5 w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={user.icon_url ? user.icon_url : Identity_Blank}
                    alt='user-profile-picture'
                    className='inline-block mr-2 w-6 h-6 rounded-full'
                  />
                  {user.full_name ? (
                    user.full_name
                  ) : (
                    <span className='text-gray-500 italic'>Not available</span>
                  )}
                </div>
              </td>
              <td className='py-3 px-5 w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={Calender}
                    alt='sign-up date'
                    className='inline-block mr-2'
                  />
                  {formatDate(user.confirm_email_at)}
                </div>
              </td>
              <td className='py-3 px-5 w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={Mail}
                    alt='user mail'
                    className='inline-block mr-2'
                  />
                  {user.email ? (
                    user.email
                  ) : (
                    <span className='text-gray-500 italic'>Not available</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {numItemsToShow < users.length && (
        <div className='text-center'>
          <button
            onClick={handleShowMore}
            className='px-6 py-3  text-[#BBBBBA] rounded-full border  border-gray-700 mt-4'
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

function Workspaces({ workspace }: WorkspaceTableProps) {
  const ITEMS_PER_PAGE = 10;
  const [numItemsToShow, setNumItemsToShow] = useState(ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchWorkflows(workspaceId: number) {
    const { data, error } = await supabase
      .from('workflow')
      .select('*', { count: 'exact' })
      .eq('owner_org_id', workspaceId);

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  }
  async function fetchMembers(workspaceId: number) {
    const { data, error } = await supabase
      .from('user_org')
      .select('*', { count: 'exact' })
      .eq('org_id', workspaceId);

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  }

  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [workflowsCounts, setWorkflowsCounts] = useState<
    Record<number, number>
  >({});
  const [membersCounts, setMembersCounts] = useState<Record<number, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startIdx = currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;

    async function fetchData() {
      const wfCounts: Record<number, number> = {};
      const memCounts: Record<number, number> = {};
      const urls: Record<number, string> = {};

      const fetchPromises = workspace.map(async (ws) => {
        const workflows = await fetchWorkflows(ws.id);
        const members = await fetchMembers(ws.id);
        wfCounts[ws.id] = workflows.length;
        memCounts[ws.id] = members.length;

        if (ws.icon_url) {
          const isPreset = ws.icon_url.startsWith('preset:');
          const filePath = isPreset
            ? ws.icon_url.replace('preset:', '')
            : ws.icon_url;
          urls[ws.id] = getImageUrl({ filePath, isPreset, type: 'icon' });
        } else {
          urls[ws.id] = '';
        }
      });

      await Promise.all(fetchPromises);
      setWorkflowsCounts(wfCounts);
      setMembersCounts(memCounts);
      setImageUrls(urls);
      setIsLoading(false);
    }

    fetchData();
  }, [workspace, currentPage]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleWorkspaceClick = (workspaceName: string) => {
    dispatch(setSelectedWorkspace(workspaceName));
    navigate(`/workspace/${workspaceName}`);
  };

  const handleShowMore = () => {
    // Increase the number of items to show
    setNumItemsToShow(numItemsToShow + ITEMS_PER_PAGE);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='  text-[#BBBBBA] rounded-2xl border border-gray-700 bg-[#0b0b0b] border-separate border-spacing-1 py-5 px-3'>
      <table className='min-w-full'>
        <tbody>
          {workspace.slice(0, numItemsToShow).map((workspace: Workspace) => (
            <tr key={workspace.id} className='h-12'>
              <td className='py-3 px-5 w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={imageUrls[workspace.id] || Identity_Blank}
                    alt='workspace-profile-picture'
                    className='inline-block mr-2 w-6 h-6 rounded-full'
                  />
                  <div
                    className='truncate'
                    onClick={() => {
                      console.log('Workspace clicked:', workspace.title);
                      handleWorkspaceClick(workspace.title);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {workspace.title}
                  </div>
                </div>
              </td>

              <td className='py-3 px-5 items-center w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={WF_Icon}
                    alt='number of workflows'
                    className='inline-block mr-2'
                  />
                  {workflowsCounts[workspace.id] || 0} workflows
                </div>
              </td>
              <td className='py-3 px-5 items-center w-1/3'>
                <div className='flex items-center'>
                  <img
                    src={Member_Icon}
                    alt='number of members'
                    className='inline-block mr-2'
                  />
                  {membersCounts[workspace.id] || 0} members
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {numItemsToShow < workspace.length && (
        <div className='text-center'>
          <button
            onClick={handleShowMore}
            className='px-6 py-3  text-[#BBBBBA] rounded-full border  border-gray-700 mt-4'
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

function Workflows({ workflow }: WorkflowTableProps) {
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const ITEMS_PER_PAGE = 10;
  const [numItemsToShow, setNumItemsToShow] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchImages() {
      const urls: Record<number, string> = {};
      for (const wf of workflow) {
        if (wf.icon_url) {
          const isPreset = wf.icon_url.startsWith('preset:');
          const filePath = isPreset
            ? wf.icon_url.replace('preset:', '')
            : wf.icon_url;

          urls[wf.id] = getImageUrl({ filePath, isPreset, type: 'icon' });
        } else {
          urls[wf.id] = '';
        }
      }
      setImageUrls(urls);
    }

    fetchImages();
  }, [workflow]);

  const handleShowMore = () => {
    // Increase the number of items to show
    setNumItemsToShow(numItemsToShow + ITEMS_PER_PAGE);
  };

  return (
    <div className='  text-[#BBBBBA] rounded-2xl border  border-gray-700 bg-[#0b0b0b] border-separate border-spacing-1 py-5 px-3'>
      <table className='min-w-full'>
        <tbody>
          {workflow.slice(0, numItemsToShow).map((workflow: Workflow) => (
            <tr key={workflow.id}>
              <td className='py-3 px-5 w-96'>
                <div className='flex items-center'>
                  <img
                    src={imageUrls[workflow.id] || Identity_Blank}
                    alt='blank'
                    className='inline-block mr-2 w-6 h-6 rounded-full'
                  />
                  <div className='truncate'>{workflow.title}</div>
                </div>
              </td>
              <td className='py-3 px-5 w-96'>
                <div className='flex items-center'>
                  <img
                    src={Globe}
                    alt='workspace logo'
                    className='inline-block mr-2'
                  />
                  {workflow.workspacename}
                </div>
              </td>
              <td className='py-3 px-5 w-96'>
                <div className='flex items-center'>
                  <img
                    src={Calender}
                    alt='sign-up date'
                    className='inline-block mr-2'
                  />
                  {formatDate(workflow.created_at)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {numItemsToShow < workflow.length && (
        <div className='text-center'>
          <button
            onClick={handleShowMore}
            className='px-6 py-3  text-[#BBBBBA] rounded-full border  border-gray-700 mt-4'
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export { UsersTable, Workspaces, Workflows };
