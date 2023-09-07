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
import TemplateList from '@fragments/TemplateList';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { isAuth } = useContext(AuthContext);
  const { templates } = useSelector((state: any) => state.template);

  const fetchTemplates = async () => {
    setLoading(true);
    await queryTemplate({ dispatch });
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);
  const navigate = useNavigate();
  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
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
            <TemplateList
              templates={templates.filter((tmpl: any) => tmpl.status === true)}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default React.memo(Home);
