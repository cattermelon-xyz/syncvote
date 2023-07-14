import React, { useEffect, useState } from 'react';
import Icon from '@components/Icon/Icon';
import { Card, Button, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '@middleware/data';
import { setUser } from '@redux/reducers/orginfo.reducer';
import Modal from 'antd';

const AccountSetting = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.orginfo);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url);

  useEffect(() => {
    console.log('user in account setting', user);
    console.log('icon_url', avatarUrl);
  }, [user, avatarUrl]);

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
        dispatch(
          setUser({
            ...user,
            avatar_url: newAvatarUrl,
          })
        );
      },
    });
  };

  return (
    <Space className='mt-12 w-1/3' align='start' size='large'>
      <Icon editable={true} iconUrl={avatarUrl} onUpload={handleChangeAvatar} />
      <Card className='w-full'>
        <div className='flex flex-col gap-6 w-full'>
          <div>
            <p className='font-medium text-xl'>{L('name')}</p>
            <p className='font-medium text-base'>{user?.full_name}</p>
            <Button className='p-0 text-base' type='link'>
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
            <Button className='p-0 text-base' type='link'>
              {L('changeContent')}
            </Button>
          </div>
        </div>
      </Card>
    </Space>
  );
};

export default AccountSetting;
