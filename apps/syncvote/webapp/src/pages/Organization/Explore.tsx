import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Typography } from 'antd';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import { ListItem } from 'list-item';
import { Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AuthContext } from '@layout/context/AuthContext';
import ModalEditTemplate from '@/fragments/ModalEditTemplate';
import { queryTemplate } from '@middleware/data/template';
import { useNavigate } from 'react-router-dom';
import { TemplateCard } from '@components/Card/TemplateCard';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  // TODO: change to templates, setTemplates
  const [loading, setLoading] = useState(false);
  const { isAuth } = useContext(AuthContext);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const [canPublishTemplate, setCanPublishTemplate] = useState(false);
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

  const fetchTemplates = async () => {
    setLoading(true);
    await queryTemplate({ dispatch });
    setLoading(false);
  };
  useEffect(() => {
    for (var i = 0; i < orgs.length; i++) {
      if (orgs[i].role === 'ADMIN') {
        for (var j = 0; j < orgs[j].workflows.length; j++) {
          for (var k = 0; k < orgs[j].workflows[k].versions.length; k++) {
            if (
              ['PUBLIC_COMMUNITY', 'PUBLISHED'].indexOf(
                orgs[j].workflows[j].versions[k]?.status
              ) !== -1
            ) {
              setCanPublishTemplate(true);
              break;
            }
          }
        }
      }
    }
  }, [orgs]);
  useEffect(() => {
    fetchTemplates();
  }, []);
  const navigate = useNavigate();
  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <ModalEditTemplate
        templateId={-1}
        open={openModal}
        onCancel={() => setOpenModal(false)}
      />
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('exploreTopTierTemplates')}
        </Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder='Search a template...'
          className='my-8'
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
                isAuth && canPublishTemplate ? (
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
