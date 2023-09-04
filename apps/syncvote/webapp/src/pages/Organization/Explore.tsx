import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import { ListItem } from 'list-item';
import { Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkflowByStatus } from '@middleware/data';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '@layout/context/AuthContext';
const env = import.meta.env.ENV_VITE;

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [adminWorkflows, setAdminWorkflows] = React.useState<any[]>([]);
  // TODO: change to templates, setTemplates
  const [publicWorkflows, setPublicWorkflows] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuth } = useContext(AuthContext);
  const { orgs, user } = useSelector((state: any) => state.orginfo);

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  const filterWorkflowByOptions = useFilteredData(
    publicWorkflows,
    sortWorkflowOptions
  );
  const fetchDataWorkflow = async () => {
    setLoading(true);
    await getWorkflowByStatus({
      status: 'PUBLIC_COMMUNITY',
      dispatch,
      onSuccess: (data: any) => {
        setPublicWorkflows(data);
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
    setLoading(false);
  };
  const fetchAdminWorkflows = async () => {
    setLoading(true);
    if (orgs) {
      let adminOrgsData = [];
      adminOrgsData = orgs.filter((org: any) => org.role === 'ADMIN');
      const allWorkflows = adminOrgsData.flatMap((adminOrg: any) =>
        adminOrg.workflows.map((workflow: any) => ({
          ...workflow,
          org_title: adminOrg.title,
        }))
      );
      // Querry from org
      setAdminWorkflows(allWorkflows);
    }
    setLoading(false);
  };

  useEffect(() => {
    // TODO: query all orgs that this user is admin, put all workflow into 1 array
    fetchDataWorkflow();
    fetchAdminWorkflows();
  }, []);

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('exploreTopTierTemplates')}
        </Title>
        <SearchBar
          setWorkflows={(workflow: any) => setPublicWorkflows(workflow)}
        />
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <ListItem
              handleSort={handleSortWorkflowDetail}
              items={
                filterWorkflowByOptions &&
                filterWorkflowByOptions?.map((workflow, index) => (
                  <WorkflowCard
                    key={workflow?.id + index}
                    dataWorkflow={workflow}
                    isListHome={true}
                  />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
              extra={
                isAuth && adminWorkflows.length > 0 ? (
                  <Button type='primary' icon={<PlusOutlined />}>
                    {L('publishANewTemplate')}
                  </Button>
                ) : undefined
              }
            />
          </>
        )}
      </section>
    </div>
  );
};

export default React.memo(Home);
