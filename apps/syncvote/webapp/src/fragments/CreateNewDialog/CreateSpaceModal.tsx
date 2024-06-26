import React, { useState } from 'react';
import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import { Icon } from 'icon';
import Input from '@components/Input/Input';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createIdString, useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';

interface CreateSpaceModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  open,
  onClose,
}) => {
  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const [title, setTitle] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [icon_url, setIconUrl] = useState(''); //eslint-disable-line
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const handleOk = async () => {
    onClose();

    await useSetData({
      params: {
        orgInfo: {
          title,
          icon_url,
        },
        uid: user.id,
      },
      configInfo: config.newOrg,
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
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Create organization failed',
        });
      },
      dispatch: dispatch,
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
        presetIcon={presetIcons}
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
