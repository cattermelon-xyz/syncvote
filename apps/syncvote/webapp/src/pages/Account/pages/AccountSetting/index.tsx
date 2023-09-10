import React, { useEffect, useState } from 'react';
import { Icon } from 'icon';
import { Card, Button, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '@dal/data';
import { Modal } from 'antd';
import ChangeModal from '@pages/Account/pages/AccountSetting/fragments/ChangeAccountModal';
import { useGetDataHook } from 'utils';
import { config } from '@dal/config';

const AccountSetting = () => {
  const dispatch = useDispatch();

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;
  
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url);
  const [openModal, setOpenModal] = useState(false);
  const [isChangeName, setIsChangeName] = useState(false);

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  useEffect(() => {
    setAvatarUrl(user?.avatar_url);
  }, [user]);

  const handleChangeAvatar = (obj: any) => {
    const newAvatarUrl = obj.isPreset ? `preset:${obj.filePath}` : obj.filePath;

    setAvatarUrl(newAvatarUrl);

    updateUserProfile({
      userProfile: {
        ...user,
        icon_url: newAvatarUrl,
      },
      dispatch,
      onSuccess: () => {
        // dispatch(
        //   setUser({
        //     ...user,
        //     avatar_url: newAvatarUrl,
        //   })
        // );
        Modal.success({
          title: 'Success',
          content: 'Change avatar successfully',
        });
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Cannot change avatar',
        });
      },
    });
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className='flex w-1/3 mt-12 gap-8 items-start'>
        <Space>
          <Icon
            presetIcon={presetIcons}
            editable={true}
            iconUrl={avatarUrl}
            onUpload={handleChangeAvatar}
          />
        </Space>
        <Card className='w-full'>
          <Space direction='vertical' size='large'>
            <div>
              <p className='font-medium text-xl'>{L('name')}</p>
              <p className='font-medium text-base'>{user?.full_name}</p>
              <Button
                className='p-0 text-base'
                type='link'
                onClick={() => {
                  showModal();
                  setIsChangeName(true);
                }}
              >
                {L('changeName')}
              </Button>
            </div>
            <div>
              <p className='font-medium text-xl'>{L('email')}</p>
              <p className='font-medium text-base'>{user?.email}</p>
            </div>
            <div>
              <p className='font-medium text-xl'>{L('aboutMe')}</p>
              <p className='font-medium text-base'>{user?.about_me}</p>
              <Button
                className='p-0 text-base'
                type='link'
                onClick={() => {
                  showModal();
                  setIsChangeName(false);
                }}
              >
                {L('changeContent')}
              </Button>
            </div>
          </Space>
        </Card>
      </div>
      <ChangeModal
        open={openModal}
        onClose={closeModal}
        isChangeName={isChangeName}
      />
    </>
  );
};

export default AccountSetting;
