import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { L } from '@utils/locales/L';
import { useDispatch } from 'react-redux';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';

interface ChangeModalProps {
  open: boolean;
  isChangeName: boolean;
  onClose: () => void;
}

const { TextArea } = Input;

const ChangeModal: React.FC<ChangeModalProps> = ({
  open,
  onClose,
  isChangeName,
}) => {
  const dispatch = useDispatch();

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleOk = async () => {
    let newUserProfile = { ...user };

    if (isChangeName) {
      newUserProfile.full_name = content;
    } else {
      newUserProfile.about_me = content;
    }

    await useSetData({
      params: {
        userProfile: newUserProfile,
      },
      configInfo: config.updateUserProfile,
      dispatch: dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Change information successfully',
        });
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Cannot change information',
        });
      },
    });

    // updateUserProfile({
    //   userProfile: newUserProfile,
    //   dispatch,
    //   onSuccess: () => {
    //     Modal.success({
    //       title: 'Success',
    //       content: 'Change information successfully',
    //     });
    //   },
    //   onError: () => {
    //     Modal.error({
    //       title: 'Error',
    //       content: 'Cannot change information',
    //     });
    //   },
    // });

    onClose();
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   onClose();
    //   setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={isChangeName ? L('changeName') : L('changeAboutMe')}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText={L('Save')}
      cancelButtonProps={{ style: { display: 'none' } }}
      className='w-1/4'
    >
      {isChangeName ? (
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
      ) : (
        <TextArea
          maxLength={170}
          style={{ height: 120, resize: 'none' }}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
    </Modal>
  );
};

export default ChangeModal;
