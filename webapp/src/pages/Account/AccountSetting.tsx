import React, { useEffect } from 'react';
import Icon from '@components/Icon/Icon';
import { Card, Button, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';

const AccountSetting = () => {
  const { user } = useSelector((state: any) => state.orginfo);

  useEffect(() => {
    console.log('user in account setting', user);
  }, [user]);

  return (
    <Space className='mt-12 w-1/3' align='start'>
      <Icon editable={true} />
      <Card className='flex flex-col gap-6 w-full'>
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
      </Card>
    </Space>
  );
};

export default AccountSetting;
