import React, { useState } from 'react';
import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import Icon from '@components/Icon/Icon';
import Input from '@components/Input/Input';
import { useSelector } from 'react-redux';

interface CreateSpaceModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  open,
  onClose,
}) => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [title, setTitle] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [icon_url, setIconUrl] = useState(''); //eslint-disable-line

  const handleOk = async() => {
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={L('createANewSpace')}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText={L('createNew')}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Icon
        size='xlarge'
        editable
        iconUrl={icon_url}
        onUpload={(obj: any) => {
          if (obj.isPreset === true) {
            setIconUrl(`preset:${obj.filePath}`);
          } else {
            setIconUrl(obj.filePath);
          }
        }}
      />
      <div className='mt-4'>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={L('organizationTitle')}
          classes='w-full'
        />
      </div>
    </Modal>
  );
};

export default CreateSpaceModal;
