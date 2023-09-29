import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import WorkflowCard from '../fragments/WorkflowCard';
import { L } from '@utils/locales/L';
import { Button, Empty, Modal, Skeleton, Space, Tabs } from 'antd';
import { ListItem } from 'list-item';
import { Icon } from 'icon';
import { Avatar } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { FiShield } from 'react-icons/fi';
import { queryOrgByIdForExplore } from '@dal/data';
import { randomIcon } from '@utils/helpers';
import {
  createIdString,
  extractIdFromIdString,
  useGetDataHook,
  useSetData,
} from 'utils';
import { useDispatch } from 'react-redux';
import EditOrg from '@pages/Organization/home/EditOrg';
import { emptyStage } from 'directed-graph';
import NotFound404 from '@pages/NotFound404';
import TemplateList from '@fragments/TemplateList';
import { config } from '@dal/config';
import ListProposals from '@pages/Mission/fragments/ListProposals';

// TODO: this file is placed in wrong folder!

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

const BluePrint = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const navigate = useNavigate();
  const { orgIdString } = useParams();
  const dispatch = useDispatch();
  const orgId = [extractIdFromIdString(orgIdString)];
  const [loading, setLoading] = useState(true);
  const [runGetMission, setRunGetMission] = useState(false);
  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [allProposals, setAllProposals] = useState<any[]>([]);

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const missionData = useGetDataHook({
    params: {
      orgIds: orgId,
    },
    start: runGetMission,
    configInfo: config.queryMission,
    cacheOption: false,
  }).data;

  useEffect(() => {
    if (orgId && orgId.length > 0) {
      setRunGetMission(true);
    }
  }, [JSON.stringify(orgId), setRunGetMission]);

  useEffect(() => {
    if (missionData && user) {
      const missionDataArray = Object.values(missionData);

      const getMyProposals = missionDataArray.filter(
        (mission: any) => mission.creator_id === user.id
      );
      setMyProposals(getMyProposals);
      setAllProposals(missionDataArray);
    }
  }, [missionData, user]);

  const org = orgs.find(
    (tmp: any) => tmp.id === extractIdFromIdString(orgIdString)
  );
  const [data, setData] = useState<any>(org);

  const [isExplorePage, setIsExplorePage] = useState<boolean>(false);

  useEffect(() => {
    console.log('isExplorePage:', isExplorePage);
  }, [isExplorePage]);

  useEffect(() => {
    // console.log('missionData', missionData);
    // console.log('myProposals', myProposals);
    // console.log('allProposals', allProposals);
    // console.log('orgs', orgs);
    // console.log('org', org);
  }, [missionData, myProposals, allProposals, org, orgs]);

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: 'Last modified',
    type: 'des',
  });
  const filterWorkflowByOptions = useFilteredData(
    workflows || [],
    sortWorkflowOptions
  );

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  useEffect(() => {
    if (orgs && orgs.length > 0) {
      const org = orgs.find(
        (tmp: any) => tmp.id === extractIdFromIdString(orgIdString)
      );

      console.log('org after handle', org);

      if (org === undefined) {
        setIsExplorePage(true);
        queryOrgByIdForExplore({
          orgId: orgId[0],
          onSuccess: (data: any) => {
            const org = data[0];
            console.log('data[0]', data[0]);
            setData(org);
            const workflowsData = org?.workflows?.map((workflow: any) => ({
              ...workflow,
              org_title: org.title,
            }));
            setWorkflows(workflowsData);
            setTemplates(org?.templates || []);
            setLoading(false);
          },
          onError: (error) => {
            Modal.error({
              title: 'Error',
              content: error,
            });
          },
          dispatch,
        });
      } else {
        setData(org);
        const workflowsData = org?.workflows?.map((workflow: any) => ({
          ...workflow,
          org_title: org.title,
        }));
        console.log('workflowsData', workflowsData);
        setWorkflows(workflowsData);
        setTemplates(org?.templates || []);
        setLoading(false);
      }
    }
  }, [JSON.stringify(orgs)]);

  const [showEditOrg, setShowEditOrg] = useState(false);
  const handleNewWorkflow = async () => {
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);
    // navigate(`${orgIdString}/new-workflow/`);
    const props = {
      title: 'Untitled Workflow',
      desc: '',
      owner_org_id: org.id,
      emptyStage: emptyStage,
      iconUrl: 'preset:' + randomIcon(),
      authority: user.id,
    };

    await useSetData({
      onSuccess: (data: any) => {
        const { versions, insertedId } = data;
        navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
      },
      onError: (error: any) => {
        Modal.error({ content: error.message });
      },
      params: props,
      configInfo: config.insertWorkflowAndVersion,
      dispatch,
    });
  };

  const tabItems = [
    {
      key: '1',
      label: 'Proposal',
      children: myProposals && allProposals && (
        <div className='flex flex-col gap-6'>
          {isExplorePage ? (
            ''
          ) : (
            <ListProposals
              listProposals={myProposals}
              title={'My proposals'}
              type='owner'
            />
          )}

          <ListProposals
            listProposals={allProposals}
            title={isExplorePage ? '' : 'All proposals'}
            type='all'
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Workflows',
      children:
        filterWorkflowByOptions && filterWorkflowByOptions.length > 0 ? (
          <ListItem
            handleSort={handleSortWorkflowDetail}
            items={
              filterWorkflowByOptions &&
              filterWorkflowByOptions?.map((workflow, index) => (
                <WorkflowCard
                  key={workflow?.id + index}
                  dataWorkflow={workflow}
                />
              ))
            }
            columns={{ sm: 2, md: 3, xl: 3, '2xl': 3 }}
            extra={
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => handleNewWorkflow()}
              >
                New Workflow
              </Button>
            }
          />
        ) : (
          <Space className='w-full' direction='vertical'>
            <div className='w-full flex flex-col items-end'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => handleNewWorkflow()}
              >
                New Workflow
              </Button>
            </div>
            <Empty />
          </Space>
        ),
    },
  ];

  if (!isExplorePage) {
    tabItems.push({
      key: '3',
      label: 'Templates',
      children: (
        <TemplateList
          templates={templates}
          orgId={extractIdFromIdString(orgIdString)}
        />
      ),
    });
  }

  return (
    <div className='lg:w-[800px] md:w-[640px] sm:w-[400px]'>
      <EditOrg
        dataOrg={data}
        isOpen={showEditOrg}
        onClose={() => setShowEditOrg(false)}
        onSaved={() => {
          setShowEditOrg(false);
        }}
        onDeleted={() => {
          navigate('/');
        }}
        profile={data?.profile || []}
      />
      {org === undefined && isExplorePage === false ? (
        loading ? (
          <Skeleton className='mt-4' />
        ) : (
          <NotFound404 />
        )
      ) : (
        <>
          <div
            className='flex my-4 gap-1 cursor-pointer'
            onClick={() => {
              if (isExplorePage) {
                navigate('/explore');
              } else {
                navigate('/');
              }
            }}
          >
            <LeftOutlined style={{ color: '#6200ee' }} />
            <p className='font-medium text-[#6200ee] self-center'>
              {isExplorePage ? L('backToExplore') : L('backToMySpaces')}
            </p>
          </div>
          <Space
            direction='horizontal'
            className='flex justify-between items-center mb-6 mt-2'
          >
            <div className='flex gap-2 items-center'>
              {data?.icon_url ? (
                <Icon
                  iconUrl={data?.icon_url}
                  size='large'
                  presetIcon={presetIcons}
                />
              ) : (
                <Avatar
                  shape='circle'
                  className='w-11 h-11'
                  style={{
                    backgroundColor: '#D3D3D3',
                  }}
                />
              )}
              <div
                className='text-3xl font-semibold text-[#252422] flex items-center hover:text-violet-500 cursor-pointer'
                onClick={() => {
                  data?.role === 'ADMIN' ? setShowEditOrg(true) : null;
                }}
                title={
                  data?.role === 'ADMIN'
                    ? 'You are an ADMIN'
                    : 'You are a Member'
                }
              >
                {data?.title}
                {data?.role === 'ADMIN' ? (
                  <FiShield className='ml-1' />
                ) : (
                  <TeamOutlined className='ml-1' />
                )}
              </div>
            </div>
          </Space>

          <div>{loading ? <Skeleton /> : <Tabs items={tabItems} />}</div>
        </>
      )}
    </div>
  );
};

export default BluePrint;
