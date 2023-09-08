import {
  CalendarOutlined,
  CopyOutlined,
  EyeOutlined,
  FacebookOutlined,
  LinkOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import parse from 'html-react-parser';
import {
  queryATemplate,
  queryCurrentTemplateVersion,
} from '@dal/data/template';
import { Button, Modal, Skeleton, Space, Tag } from 'antd';
import { DirectedGraph, emptyStage } from 'directed-graph';
import Icon from 'icon/src/Icon';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { extractIdFromIdString } from 'utils';
import ModalWorkflowFromTemplate from '@fragments/ModalWorkflowFromTemplate';
import { AuthContext } from '@layout/context/AuthContext';
import { version } from 'os';

const Detail = () => {
  const { templateIdString } = useParams();
  const { isAuth } = useContext(AuthContext);
  const id = extractIdFromIdString(templateIdString);
  const { templates } = useSelector((state: any) => state.template) || [];
  const { orgs } = useSelector((state: any) => state.orginfo) || [];
  const [template, setTemplate] = useState<any>(
    templates.find((tmpl: any) => tmpl.id === id)
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [versionData, setVersionData] = useState(emptyStage);
  const fetchVersionData = async ({
    current_version_id,
  }: {
    current_version_id: number;
  }) => {
    setLoading(true);
    const { data, error } = (await queryCurrentTemplateVersion({
      dispatch,
      current_version_id,
    })) || { data: undefined, error: undefined };
    if (data) {
      setVersionData(data.data);
    }
    setLoading(false);
    // console.log('data from server: ', data);
  };
  const fetchTemplateData = async () => {
    const { data, error } = await queryATemplate({
      dispatch,
      templateId: id,
    });
    if (data) {
      setTemplate(data);
      fetchVersionData({
        current_version_id: data.current_version_id,
      });
    } else if (error) {
      Modal.error({ title: 'Error', content: 'Cannot fetch template data!' });
    }
  };
  useEffect(() => {
    if (!template) {
      fetchTemplateData();
    } else {
      if (template.current_version_id) {
        fetchVersionData({ current_version_id: template?.current_version_id });
      }
    }
  }, []);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <ModalWorkflowFromTemplate
        template={template}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <Space direction='vertical' size='large' className='w-full'>
        <Space
          direction='horizontal'
          className='w-full justify-between items-start'
        >
          <Space direction='horizontal'>
            <Icon iconUrl={template?.icon_url} size='large' presetIcon={[]} />
            <Space direction='vertical'>
              <div className='font-bold'>{template?.title}</div>
              <Space direction='horizontal' size='small'>
                <Space direction='horizontal' size='small'>
                  <div>
                    <Icon
                      iconUrl={
                        orgs.find(
                          (org: any) => org.id === template?.owner_org_id
                        )?.iconUrl
                      }
                      size='small'
                      presetIcon={[]}
                    />
                  </div>
                  <div>
                    {
                      orgs.find((org: any) => org.id === template?.owner_org_id)
                        ?.title
                    }
                  </div>
                </Space>
                <Space direction='horizontal' size='small'>
                  <CalendarOutlined />
                  {moment(template?.created_at).format('YYYY MMM DD HH:mm')}
                </Space>
              </Space>
            </Space>
          </Space>
          <Button
            icon={<CopyOutlined />}
            type='primary'
            onClick={() => setIsModalOpen(true)}
            disabled={!isAuth}
            title={
              !isAuth ? 'You need to login to duplicate this workflow' : ''
            }
          >
            Duplicate this workflow
          </Button>
        </Space>
        <div className='w-[800px] h-[400px] border border-gray-200 border-solid relative'>
          <Button
            icon={<EyeOutlined />}
            type='link'
            className='absolute bottom-2 right-2 z-50'
            onClick={() => navigate('/template/detail/' + templateIdString)}
          >
            View details
          </Button>
          <DirectedGraph
            data={versionData}
            selectedLayoutId={versionData?.cosmetic?.defaultLayout?.horizontal}
            className={loading ? 'opacity-0' : ''}
          />
          <Skeleton
            active
            className={`absolute top-5 left-5 ${
              loading ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
        <Space
          direction='horizontal'
          className='w-full justify-between items-start'
        >
          <div>
            <div className='font-bold mb-2 text-md'>Template description</div>
            <div>{parse(template?.desc || '')}</div>
          </div>
          <Space direction='vertical' className='full'>
            <Space direction='vertical'>
              <div className='font-bold text-md'>Tags</div>
              <div className='flex inline'>
                <Tag>Governance</Tag>
                <Tag>Decision-making</Tag>
                <Tag>Uniswap</Tag>
              </div>
            </Space>
            <Space direction='vertical'>
              <div className='font-bold text-md'>Share</div>
              <Space direction='horizontal'>
                <Button icon={<LinkOutlined />} shape='round' />
                <Button icon={<TwitterOutlined />} shape='round' />
                <Button icon={<FacebookOutlined />} shape='round' />
              </Space>
            </Space>
          </Space>
        </Space>
      </Space>
    </div>
  );
};

export default Detail;
