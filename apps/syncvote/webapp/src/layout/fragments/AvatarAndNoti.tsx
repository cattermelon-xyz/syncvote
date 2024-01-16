import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'icon';
import { L } from '@utils/locales/L';
import { Button, Popover, Space, Modal } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, useGetDataHook } from 'utils';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { AuthContext } from '@layout/context/AuthContext';
import { config } from '@dal/config';
import { DownOutlined } from '@ant-design/icons';
import { useSDK } from '@metamask/sdk-react';

function shortenAddress(address: string): string {
  if (address.length < 11) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

interface AvatarAndNotiProps {
  user?: any;
  account?: any;
  setAccount?: any;
}

const AvatarAndNoti: React.FC<AvatarAndNotiProps> = ({
  user,
  account,
  setAccount,
}) => {
  const { sdk } = useSDK();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const disconnectWallet = async () => {
    sdk?.terminate();
    setAccount('');
  };

  const handleLoginClick = async () => {
    dispatch(startLoading({}));

    // Store the current page URL for redirection after OAuth
    const currentURL = window.location.href;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: currentURL,
      },
    });

    dispatch(finishLoading({}));

    if (error) {
      Modal.error({
        title: L('error'),
        content: error.message || '',
      });
    }
  };

  const { isAuth } = useContext(AuthContext);

  const handleOpenChange = (newOpen: boolean) => {
    setOpenPopover(newOpen);
  };

  const contentPopOver = (
    <div>
      {account ? (
        <div className='flex items-center gap-2'>
          <p>{shortenAddress(account)}</p>
          <div>
            <Button
              type='text'
              // icon={<LogoutOutlined />}
              className='w-full flex items-center'
              onClick={async () => {
                disconnectWallet;
              }}
            >
              Disconnect wallet
            </Button>
          </div>
        </div>
      ) : (
        <p>No wallet connected</p>
      )}
    </div>
  );

  return (
    <Space className='flex items-center justify-end gap-3'>
      {/*}
      {isAuth ? (
        <div className='flex rounded-full h-[36px] w-[36px] bg-gray-100 justify-center cursor-pointer'>
          <BellOutlined style={{ fontSize: '20px' }} />
        </div>
      ) : null}
      */}
      {isAuth ? (
        <Popover
          placement='bottomRight'
          content={contentPopOver}
          trigger='click'
          open={openPopover}
          onOpenChange={handleOpenChange}
          className='max-w-[320px] h-[36px]'
        >
          <div className='border-2 h-11 px-2 py-2 mr-0 rounded-full border-gray-normal bg-gray-100 cursor-pointer flex items-center '>
            <Icon
              presetIcon={presetIcons}
              size='medium'
              iconUrl={user?.avatar_url}
            />
            <p className='text-text_2 text-[#252422] mx-2 truncate'>
              {/* {token ? sliceAddressToken(AddressToken.ip_address, 5) : 'Connect wallet'} */}
              {/* {user?.full_name ? user?.full_name : user?.email} */}
              {user?.email}
            </p>
            <DownOutlined />
          </div>
        </Popover>
      ) : (
        <Button
          type='default'
          icon={<UserOutlined />}
          className='rounded-full'
          onClick={handleLoginClick}
        >
          Login
        </Button>
      )}
    </Space>
  );
};

export default AvatarAndNoti;
