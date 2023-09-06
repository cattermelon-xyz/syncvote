import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Card, Modal, Typography } from 'antd';
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
import ModalEditTemplate from './fragments/ModalEditTemplate';
import { IOrgInfo, IWorkflow } from '@types';
import { newTemplate, queryTemplate } from '@middleware/data/template';
import { Banner } from 'banner';
import { Icon } from 'icon';
import { useNavigate } from 'react-router-dom';
import { createIdString } from 'utils';
import { TemplateCard } from '@components/Card/TemplateCard';
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
  const { templates } = useSelector((state: any) => state.template);
  const [openModal, setOpenModal] = useState(false);

  const [sortTemplateOptions, setSortTemplateOptions] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortTemplateOptions(options);
  };

  const filterTemplateByOptions = useFilteredData(
    templates,
    sortTemplateOptions
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
      allWorkflows.map((workflow: any) => {
        const versions = workflow.versions || [];
        for (var i = 0; i < versions.length; i++) {
          if (
            versions[i].status === 'PUBLISHED' ||
            versions[i].status === 'PUBLIC_COMMUNITY'
          ) {
            workflow.published_version_id = versions[i].id;
            break;
          }
        }
      });
      // Querry from org
      setAdminWorkflows(allWorkflows);
    } else {
      // TODO: query orgs here!
    }
    setLoading(false);
  };
  const fetchTemplates = async () => {
    setLoading(true);
    await queryTemplate({ dispatch });
    setLoading(false);
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    // TODO: query all orgs that this user is admin, put all workflow into 1 array
    fetchDataWorkflow();
    fetchAdminWorkflows();
  }, [orgs]);
  const navigate = useNavigate();
  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <ModalEditTemplate
        templateId={-1}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSave={async (toSaveData) => {
          setOpenModal(false);
          const { data, error } = await newTemplate({
            ...toSaveData,
            dispatch,
          });
          if (error) {
            Modal.error({
              title: 'Error',
              content: error,
            });
          } else {
            Modal.success({
              title: 'Success',
              content: 'Your template has been published!',
            });
          }
        }}
        options={{
          workflows: adminWorkflows
            .filter((w) => w.published_version_id !== undefined)
            .map((w: any) => ({
              value: w.id || -1,
              label: w.title || '',
              owner_org_id: w.owner_org_id || -1,
              icon_url: w.icon_url || '',
              banner_url: w.banner_url || '',
              published_version_id: w.published_version_id || -1,
            })),
          orgs: orgs.map((o: IOrgInfo) => ({ value: o.id, label: o.title })),
        }}
      />
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
                filterTemplateByOptions &&
                filterTemplateByOptions?.map((template, index) => (
                  <TemplateCard template={template} navigate={navigate} />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
              extra={
                isAuth && adminWorkflows.length > 0 ? (
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setOpenModal(true)}
                  >
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
