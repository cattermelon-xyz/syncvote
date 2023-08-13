import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@components/Icon/Icon';
import { L } from '@utils/locales/L';
import { Button, Popover, Space } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

interface AvatarAndNotiProps {
  user?: any;
  isShowAccountSetting?: any;
}

const AvatarAndNoti: React.FC<AvatarAndNotiProps> = ({
  user,
  isShowAccountSetting,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpenPopover(newOpen);
  };

  const contentPopOver = (
    <div>
      <div>
        <Button
          type='text'
          icon={<SettingOutlined />}
          onClick={() => {
            setOpenPopover(false);
            navigate(`/account/setting`);
          }}
        >
          {L('accountSettings')}
        </Button>
      </div>
      <div>
        <Button
          type='text'
          icon={<LogoutOutlined />}
          className='w-full flex items-center'
          onClick={async () => {
            dispatch(startLoading({}));
            await supabase.auth.signOut();
            dispatch(finishLoading({}));
            navigate('/login');
          }}
        >
          {L('logOut')}
        </Button>
      </div>
    </div>
  );

  return (
    <Space className='flex items-center justify-end gap-3'>
      <div className='flex rounded-full h-[36px] w-[36px] bg-gray-100 justify-center cursor-pointer'>
        <BellOutlined style={{ fontSize: '20px' }} />
      </div>
      {isShowAccountSetting ? (
        <Popover
          placement='bottomRight'
          content={contentPopOver}
          trigger='click'
          open={openPopover}
          onOpenChange={handleOpenChange}
          className='max-w-[208px] h-[36px]'
        >
          <div className='border-b_2 h-11 px-2 py-2 mr-0 rounded-full border-gray-normal bg-gray-100 cursor-pointer flex items-center'>
            <Icon size='medium' iconUrl={user?.avatar_url} />
            <p className='text-text_2 text-[#252422] ml-2 truncate'>
              {/* {token ? sliceAddressToken(AddressToken.ip_address, 5) : 'Connect wallet'} */}
              {user?.full_name ? user?.full_name : user?.email}
            </p>
          </div>
        </Popover>
      ) : (
        <div
          className='cursor-pointer flex items-center'
          onClick={async () => {
            dispatch(startLoading({}));
            await supabase.auth.signOut();
            dispatch(finishLoading({}));
            navigate('/login');
          }}
          title={L('clickToLogout')}
        >
          <img
            src={user?.user_metadata?.avatar_url}
            alt='user_avatar'
            className='w-[36px] h-[36px] rounded-full inline-block mr-2'
          />
        </div>
      )}
    </Space>
  );
};

export default AvatarAndNoti;
