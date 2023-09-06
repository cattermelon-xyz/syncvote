import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import WorkflowCard from '../fragments/WorkflowCard';
import { L } from '@utils/locales/L';
import { Button, Empty, Modal, Skeleton, Space, Tabs } from 'antd';
import { ListItem } from 'list-item';
import { Icon } from 'icon';
import { Avatar } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { FiShield } from 'react-icons/fi';
import {
  insertWorkflowAndVersion,
  queryOrgs,
  queryWorkflow,
  upsertAnOrg,
} from '@middleware/data';
import { randomIcon } from '@utils/helpers';
import { createIdString, extractIdFromIdString } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import EditOrg from '@pages/Organization/home/EditOrg';
import { emptyStage } from 'directed-graph';
import NotFound404 from '@pages/NotFound404';
import { TemplateCard } from '@components/Card/TemplateCard';

// TODO: this file is placed in wrong folder!

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

interface DataItem {
  title: string;
  [key: string]: any;
}

const BluePrint = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const { user } = useSelector((state: any) => state.orginfo);
  const location = useLocation();
  const navigate = useNavigate();
  const { presetIcons } = useSelector((state: any) => state.ui);
  const { orgIdString } = useParams();
  const [loading, setLoading] = useState(true);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const org = orgs.find(
    (tmp: any) => tmp.id === extractIdFromIdString(orgIdString)
  );
  // const data = location.state?.dataSpace || org;
  const data = org;
  const dispatch = useDispatch();

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: 'Last modified',
    type: 'des',
  });
  const [sortTemplateOptions, setSortTemplateOptions] = useState<SortProps>({
    by: 'Last modified',
    type: 'des',
  });

  const filterWorkflowByOptions = useFilteredData(
    workflows || [],
    sortWorkflowOptions
  );
  const filterTemplateByOptions = useFilteredData(
    templates || [],
    sortTemplateOptions
  );

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };
  const handleSortTemplate = (options: SortProps) => {
    setSortTemplateOptions(options);
  };

  useEffect(() => {
    if (data) {
      const workflowsData = data?.workflows?.map((workflow: any) => ({
        ...workflow,
        org_title: data.title,
      }));
      setWorkflows(workflowsData);
      setTemplates(data?.templates || []);
      setLoading(false);
    } else {
      queryOrgs({
        filter: {},
        dispatch: dispatch,
        onSuccess: (data: any) => {
          setLoading(false);
        },
        onError: (error: any) => {
          setLoading(false);
        },
      });
    }
  }, [data]);
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
    insertWorkflowAndVersion({
      dispatch: dispatch,
      props: props,
      onError: (error) => {
        Modal.error({ content: error.message });
      },
      onSuccess: (versions, insertedId) => {
        navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
      },
    });
  };
  return (
    <div className='lg:w-[800px] md:w-[640px] sm:w-[400px]'>
      <EditOrg
        orgId={data?.id}
        isOpen={showEditOrg}
        onClose={() => setShowEditOrg(false)}
        title={data?.title}
        desc={data?.desc}
        onSaved={() => {
          setShowEditOrg(false);
        }}
        onDeleted={() => {
          navigate('/');
        }}
        profile={data?.profile || []}
      />
      {org === undefined ? (
        loading ? (
          <Skeleton className='mt-4' />
        ) : (
          <NotFound404 />
        )
      ) : (
        <>
          <div
            className='flex my-4 gap-1 cursor-pointer'
            onClick={() => navigate('/')}
          >
            <LeftOutlined style={{ color: '#6200ee' }} />
            <p className='font-medium text-[#6200ee] self-center'>
              {L('backToMySpaces')}
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

          <div>
            {loading ? (
              <Skeleton />
            ) : (
              <Tabs
                items={[
                  {
                    key: '1',
                    label: 'Workflows',
                    children:
                      filterWorkflowByOptions &&
                      filterWorkflowByOptions.length > 0 ? (
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
                        <Empty />
                      ),
                  },
                  {
                    key: '2',
                    label: 'Templates',
                    children:
                      filterTemplateByOptions &&
                      filterTemplateByOptions.length > 0 ? (
                        <ListItem
                          handleSort={handleSortTemplate}
                          items={
                            filterTemplateByOptions &&
                            filterTemplateByOptions?.map((template, index) => (
                              <TemplateCard
                                template={template}
                                navigate={navigate}
                              />
                            ))
                          }
                          columns={{ sm: 2, md: 3, xl: 3, '2xl': 3 }}
                          extra={
                            <Button
                              type='primary'
                              icon={<PlusOutlined />}
                              disabled
                            >
                              New Template
                            </Button>
                          }
                        />
                      ) : (
                        <Empty />
                      ),
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BluePrint;
