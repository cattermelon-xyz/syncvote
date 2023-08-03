import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useEffect, useState } from 'react';
import { getDataOrgs, insertWorkflowAndVersion } from '@middleware/data';
import { useSelector } from 'react-redux';
import Icon from '@components/Icon/Icon';
import './create-new.scss';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createIdString, randomIcon } from '@utils/helpers';

interface DuplicateWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  dispatch: any;
}

const DuplicateWorkflowModal: React.FC<DuplicateWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  dispatch,
}) => {
  const navigate = useNavigate();
  const [dataOrgs, setDataOrgs] = useState<any>([]);
  const { user } = useSelector((state: any) => state.orginfo);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    const org = dataOrgs.find((org: any) => org.id === value);
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);
    const props = {
      title: workflow?.title,
      desc: workflow?.desc,
      owner_org_id: value,
      emptyStage: workflow?.versions[0]?.data,
      iconUrl: workflow.icon_url,
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
    onClose();
  };

  const loadWorkflowData = async () => {
    if (user?.id !== null) {
      await getDataOrgs({
        userId: user?.id,
        dispatch: dispatch,
        onSuccess: (data: any) => {
          setDataOrgs(data);
        },
      });
    }
  };
  const [value, setValue] = useState(null);
  const [hovered, setHovered] = useState(null);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    loadWorkflowData();
  }, [user]);

  return (
    <Modal
      title={`${L('duplicate')} "${workflow.title}"`}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={L('duplicate')}
      okButtonProps={{ disabled: value === null }}
      cancelButtonProps={{ style: { display: 'none' } }}
      className='create-new'
    >
      <Space className='flex'>
        <div style={{ color: '#575655' }} className='text-sm not-italic	mb-3'>
          Select a workspace to contain your new workflow{' '}
        </div>
      </Space>

      <Space className='h-60 w-full overflow-y-scroll' direction='vertical'>
        <Radio.Group onChange={onChange} value={value} className='w-full'>
          {dataOrgs.map((org: any, index: any) => (
            <div
              className='flex h-12 items-center radio'
              key={index}
              style={{ backgroundColor: org.id === value ? '#f6f6f6' : '' }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === index || org.id === value ? (
                <Space className='p-3'>
                  <Radio value={org.id} className='w-6 h-6' />
                  <div className='text-base'>{org?.title}</div>
                </Space>
              ) : (
                <Space className='p-3'>
                  <Icon
                    iconUrl={org.icon_url ? org.icon_url : ''}
                    size='medium'
                  />
                  <div className='ml-2 text-base'>{org?.title}</div>
                </Space>
              )}
            </div>
          ))}
        </Radio.Group>
      </Space>

      <Space className='flex'>
        <a
          className='p-4'
          style={{ color: '#6d28d9' }}
          onClick={() => {
            navigate('/?action=new-workspace');
          }}
        >
          <PlusOutlined /> {L('createANewSpace')}
        </a>
      </Space>
    </Modal>
  );
};

export default DuplicateWorkflowModal;