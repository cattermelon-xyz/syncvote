import Logo from '@assets/icons/svg-icons/Logo';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import { Button, Menu, MenuProps, Modal, Popover, Space } from 'antd';
import {
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
  CaretDownFilled,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { TbBolt } from 'react-icons/tb';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import GoogleIcon from '@assets/icons/svg-icons/GoogleIcon';
import { L } from '@utils/locales/L';
import { supabase, useGetDataHook } from 'utils';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { config } from '@dal/config';
const env = import.meta.env.VITE_ENV;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  style?: React.CSSProperties
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
  } as MenuItem;
}

function PublicHeader(session: any) {

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;
  
  const handleClearStore = () => {};
  const navigate = useNavigate();

  const items: MenuProps['items'] =
    env === 'dev'
      ? [
          getItem('About us', '1'),

          getItem('Social', '2', <CaretDownFilled />, [
            getItem('Facebook', 'facebook', <FacebookFilled />),
            getItem('Twitter', 'twitter', <TwitterOutlined />),
            getItem('Instagram', 'instagram', <InstagramOutlined />),
          ]),

          getItem('Docs', '3'),

          getItem(
            'Create your own workflow',
            '4',
            <TbBolt style={{ fontSize: 18 }} />,
            undefined,
            undefined,
            { color: 'purple' }
          ),
        ]
      : [
          getItem(
            'Create your own workflow',
            '4',
            <TbBolt style={{ fontSize: 18 }} />,
            undefined,
            undefined,
            { color: 'purple' }
          ),
        ];

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    if (e.key === '4') {
      if (user.id === '') {
        navigate('/login');
      } else {
        window.open('/?action=new-workflow', '_blank');
      }
    }
  };
  const [openPopover, setOpenPopover] = useState(false);
  const dispatch = useDispatch();
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

  const handleLogin = async () => {
    dispatch(startLoading({}));
    const redirectTo = window.location.href;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo,
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

  return (
    <Space
      direction='horizontal'
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white`}
    >
      <div className='flex p-0 gap-2 items-center cursor-pointer'>
        <span
          className='mr-2'
          onClick={() => {
            handleClearStore();
            navigate('/');
          }}
        >
          <div className='flex top-[2%] left-[1.3%] gap-2'>
            <LogoSyncVote />
            <div className='text-violet-700 text-[20px] font-bold '>
              Syncvote
            </div>
          </div>
        </span>
      </div>

      <Space
        direction='horizontal'
        className='flex items-center justify-end fit-content'
        size='small'
      >
        <Menu
          className='border-[white] text-sm flex items-center lg:min-w-[280px]'
          mode='horizontal'
          items={items}
          onClick={onClick}
          theme='light'
        />
        {user.id !== '' ? (
          <Popover trigger='click' content={contentPopOver}>
            <Button
              style={{ marginLeft: 20 }}
              className='primary flex bg-[#FFF] text-[13px] gap-[10px] items-center border border-solid border-[#E3E3E2] rounded-[10px] cursor-pointer text-[#252422]'
            >
              <GoogleIcon />
              <p>{session?.session?.user?.user_metadata?.full_name}</p>
            </Button>
          </Popover>
        ) : (
          <Button
            onClick={handleLogin}
            style={{ marginLeft: 20 }}
            className='primary flex bg-[#FFF] text-[13px] gap-[10px] items-center border border-solid border-[#E3E3E2] rounded-[10px] cursor-pointer text-[#252422]'
          >
            <GoogleIcon />
            <p>Login</p>
          </Button>
        )}
      </Space>
    </Space>
  );
}

export default PublicHeader;
