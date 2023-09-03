import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'icon';
import { L } from '@utils/locales/L';
import { Button, Popover, Space } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'utils';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { AuthContext } from '@layout/context/AuthContext';

interface AvatarAndNotiProps {
  user?: any;
}

const AvatarAndNoti: React.FC<AvatarAndNotiProps> = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);
  const { presetIcons } = useSelector((state: any) => state.ui);
  const { isAuth } = useContext(AuthContext);

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
          }}
        >
          {L('logOut')}
        </Button>
      </div>
    </div>
  );

  return (
    <Space className='flex items-center justify-end gap-3'>
      {isAuth ? (
        <div className='flex rounded-full h-[36px] w-[36px] bg-gray-100 justify-center cursor-pointer'>
          <BellOutlined style={{ fontSize: '20px' }} />
        </div>
      ) : null}
      {isAuth ? (
        <Popover
          placement='bottomRight'
          content={contentPopOver}
          trigger='click'
          open={openPopover}
          onOpenChange={handleOpenChange}
          className='max-w-[208px] h-[36px]'
        >
          <div className='border-b_2 h-11 px-2 py-2 mr-0 rounded-full border-gray-normal bg-gray-100 cursor-pointer flex items-center'>
            <Icon
              presetIcon={presetIcons}
              size='medium'
              iconUrl={user?.avatar_url}
            />
            <p className='text-text_2 text-[#252422] ml-2 truncate'>
              {/* {token ? sliceAddressToken(AddressToken.ip_address, 5) : 'Connect wallet'} */}
              {user?.full_name ? user?.full_name : user?.email}
            </p>
          </div>
        </Popover>
      ) : (
        <Button
          type='default'
          icon={<UserOutlined />}
          className='rounded-full'
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
        </Button>
      )}
    </Space>
  );
};

export default AvatarAndNoti;
