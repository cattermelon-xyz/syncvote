import React, { useEffect, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { getDataOrgs } from '@middleware/data';
import { PlusOutlined } from '@ant-design/icons';
import Icon from '@components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';
import './create-new.scss';

interface CreateWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  setOpenCreateWorkspaceModal: () => void;
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onClose,
  setOpenCreateWorkspaceModal,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.orginfo);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const limit = 100;
  const [dataOrgs, setDataOrgs] = useState<any>([]);

  const loadWorkflowData = async (offset: any, limit: any) => {
    if (user?.id !== null) {
      await getDataOrgs({
        userId: user?.id,
        offset: offset,
        limit: limit,
        dispatch: dispatch,
        onSuccess: (data: any) => {
          setDataOrgs(data);
        },
      });

      setOffset(offset);
    }
  };

  const handleOk = async () => {
    const org = dataOrgs.find((org: any) => org.id === value);
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);
    navigate(`${orgIdString}/new-workflow/`);
  };

  const handleCancel = () => {
    setValue(null);
    onClose();
  };

  const [value, setValue] = useState(null);
  const [hovered, setHovered] = useState(null);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const createNewWorkSpace = () => {};

  useEffect(() => {
    loadWorkflowData(offset, limit);
  }, [user]);

  return (
    <Modal
      title={L('createANewWorkflow')}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText={L('createANewWorkflow')}
      okButtonProps={{ disabled: value === null }}
      cancelButtonProps={{ style: { display: 'none' } }}
      className='flex-col create-new'
    >
      <Space className='flex'>
        <div style={{ color: '#575655' }} className='text-sm not-italic	mb-3'>
          Select a workspace to contain your new workflow{' '}
        </div>
      </Space>

      <Space className='h-60 w-full' direction='vertical'>
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
        <a style={{ color: '#6d28d9' }} onClick={setOpenCreateWorkspaceModal}>
          <PlusOutlined /> {L('createANewSpace')}
        </a>
      </Space>
    </Modal>
  );
};

export default CreateWorkflowModal;
