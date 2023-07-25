import React, { useState } from 'react';
import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import Icon from '@components/Icon/Icon';
import Input from '@components/Input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { newOrg } from '@middleware/data';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';
import './create-new.scss';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = user.id;
  const handleOk = async () => {
    onClose();

    await newOrg({
      orgInfo: {
        title,
        icon_url,
      },
      uid: userId,
      onSuccess: async (org: any) => {
        setTitle('');
        setIconUrl('');
        Modal.success({
          title: 'Success',
          content: 'Create organization successfully',
        });
        const orgIdString = createIdString(`${org.title}`, `${org.id}`);

        navigate(`/${orgIdString}`);
      },

      dispatch,
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Create organization failed',
        });
      },
    });
  };

  const handleCancel = () => {
    setTitle('');
    setIconUrl('');
    onClose();
  };

  return (
    <Modal
      title={L('createANewSpace')}
      className='create-new'
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
