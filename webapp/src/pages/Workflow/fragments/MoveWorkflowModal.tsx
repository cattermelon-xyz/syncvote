import { Button, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useEffect, useState } from 'react';
import { getDataOrgs } from '@middleware/data';
import { useSelector } from 'react-redux';
import Icon from '@components/Icon/Icon';
import './create-new.scss';

interface MoveWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  dispatch: any;
  openMoveToModal: (orgTo: any) => void;
}

const MoveWorkflowModal: React.FC<MoveWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  dispatch,
  openMoveToModal,
}) => {
  const [dataOrgs, setDataOrgs] = useState<any>([]);
  const { user } = useSelector((state: any) => state.orginfo);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    const org = dataOrgs.find((org: any) => org.id === value);
    openMoveToModal(org);
    onClose();
  };

  const loadWorkflowData = async () => {
    if (user?.id !== null) {
      await getDataOrgs({
        userId: user?.id,
        dispatch: dispatch,
        onSuccess: (data: any) => {
          const dataOrgs = data.filter(
            (org: any) => org.id !== workflow.owner_org_id
          );
          setDataOrgs(dataOrgs);
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
      title={`${L('move')} "${workflow.title}"`}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={L('move')}
      okButtonProps={{ disabled: value === null }}
      className='create-new'
    >
      <Space className='flex pb-3 pt-1'>
        <Space style={{ color: '#575655' }} className='text-sm not-italic'>
          Current location
        </Space>
        <Space className='bg-[#F4F0FA] rounded-lg'>
          <div className='flex mx-3 my-2'>
            <Icon
              iconUrl={workflow.icon_url ? workflow.icon_url : ''}
              size='medium'
            />
            <div className='pl-1 text-[#6200EE]'>{workflow.title}</div>
          </div>
        </Space>
      </Space>

      <Space>
        <div style={{ color: '#575655' }} className='text-sm not-italic'>
          <div className='px-3'>All locations</div>
        </div>
      </Space>

      <Space className='h-60 w-full overflow-y-scroll' direction='vertical'>
        <Radio.Group onChange={onChange} value={value} className='w-full'>
          {dataOrgs.map((org: any, index: any) => (
            <div
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
            >
              {hovered === index || org?.id === value ? (
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
    </Modal>
  );
};

export default MoveWorkflowModal;
