import React, { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '@middleware/data';
import { useGetDataHook, useSetData } from '@dal/dal';
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

  const { data: user } = useGetDataHook({
    configInfo: config.queryUserById,
  });

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
      dispatch,
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
      okText={L('createNew')}
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
