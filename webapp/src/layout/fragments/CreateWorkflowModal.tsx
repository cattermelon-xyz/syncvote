import React, { useEffect, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { getDataOrgs, insertWorkflowAndVersion } from '@middleware/data';
import { PlusOutlined } from '@ant-design/icons';
import Icon from '@components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import { createIdString, randomIcon } from '@utils/helpers';
import './create-new.scss';
import { emptyStage } from '@components/DirectedGraph';

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
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOk = async () => {
    const org = orgs.find((org: any) => org.id === value);
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);
    const props = {
      title: 'Untitled Workflow',
      desc: '',
      owner_org_id: org.id,
      emptyStage: emptyStage,
      iconUrl: 'preset:' + randomIcon(),
      authority: user.id,
    };
    onClose();
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

  const handleCancel = () => {
    setValue(null);
    onClose();
  };

  const [value, setValue] = useState(null);
  const [hovered, setHovered] = useState(null);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  // useEffect(() => {
  //   loadWorkflowData();
  // }, [user]);

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

      <Space className='h-60 w-full overflow-y-scroll' direction='vertical'>
        <Radio.Group onChange={onChange} value={value} className='w-full'>
          {orgs.map((org: any, index: any) => (
            <div
              className='flex h-12 items-center radio cursor-pointer'
              className='flex h-12 items-center radio cursor-pointer'
              key={index}
              style={{ backgroundColor: org.id === value ? '#f6f6f6' : '' }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (value) {
                  if (value === org?.id) {
                    setValue(null);
                  } else {
                    setValue(org?.id);
                  }
                } else {
                  setValue(org?.id);
                }
              }}
              onClick={() => {
                if (value) {
                  if (value === org?.id) {
                    setValue(null);
                  } else {
                    setValue(org?.id);
                  }
                } else {
                  setValue(org?.id);
                }
              }}
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
          onClick={setOpenCreateWorkspaceModal}
        >
        <a
          className='p-4'
          style={{ color: '#6d28d9' }}
          onClick={setOpenCreateWorkspaceModal}
        >
          <PlusOutlined /> {L('createANewSpace')}
        </a>
      </Space>
    </Modal>
  );
};

export default CreateWorkflowModal;
