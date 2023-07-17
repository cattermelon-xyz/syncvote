import React, { useEffect, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { getDataOrgs } from '@middleware/data';
import { PlusOutlined } from '@ant-design/icons';
import Icon from '@components/Icon/Icon';

interface CreateWorkflowModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onClose,
}) => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [dataOrgs, setDataOrgs] = useState<any>([]);

  const loadWorkflowData = async (offset: any, limit: any) => {
    if (user?.id !== null) {
      await getDataOrgs({
        userId: user?.id,
        offset: offset,
        limit: limit,
        dispatch: dispatch,
        onSuccess: (data: any) => {
          // setDataOrgs((prevData: any) => [...prevData, ...data]);
          setDataOrgs(data);
          console.log(dataOrgs);
        },
      });

      setOffset(offset);
    }
  };
  const handleOk = async () => {
    console.log('Handle oke');

    onClose();
  };

  const handleCancel = () => {
    console.log('Handle cancel');
    onClose();
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 200) {
      loadWorkflowData(offset + limit, limit);
    }
  };

  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  useEffect(() => {
    console.log('CreateWorkflowModal');
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
      cancelButtonProps={{ style: { display: 'none' } }}
      className='flex-col'
    >
      <Space className='flex'>
        <div style={{ color: '#575655' }} className='text-base not-italic	'>
          Select a workspace to contain your new workflow{' '}
        </div>
      </Space>

      <Space className='h-64 flex-col'>
        <Radio.Group onChange={onChange} className='flex-col'>
          {dataOrgs.map((org: any) => (
            <>
              <Radio className='flex' key={org?.title} value={org?.id}>
                {org?.title}
              </Radio>
              <Icon iconUrl={org?.icon_url} size='small'/>
            </>
          ))}
        </Radio.Group>
      </Space>

      <Space className='flex'>
        <a style={{ color: '#6d28d9' }}>
          <PlusOutlined /> {L('createANewSpace')}
        </a>
      </Space>
    </Modal>
  );
};

export default CreateWorkflowModal;
