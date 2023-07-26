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
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

function PublicHeader(session: any) {
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const handleClearStore = () => {};
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    // {
    //   label: 'About us',
    //   key: 'about-us',
    // },
    // {
    //   label: (
    //     <Button type='link' icon={<CaretDownFilled />}>
    //       Social
    //     </Button>
    //   ),
    //   key: 'social',
    //   children: [
    //     {
    //       type: 'group',
    //       label: (
    //         <Button type='link' icon={<FacebookFilled />}>
    //           Facebook
    //         </Button>
    //       ),
    //     },
    //     {
    //       type: 'group',
    //       label: (
    //         <Button type='link' icon={<TwitterOutlined />}>
    //           Twitter
    //         </Button>
    //       ),
    //     },
    //     {
    //       type: 'group',
    //       label: (
    //         <Button type='link' icon={<InstagramOutlined />}>
    //           Instagram
    //         </Button>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   label: 'Docs',
    //   key: 'docs',
    // },
    {
      label: (
        <Button
          type='link'
          className='flex items-center'
          icon={<TbBolt style={{ fontSize: 18 }} />}
          onClick={() => {
            window.open('/?action=new-workflow', '_blank');
          }}
        >
          Create your own workflow
        </Button>
      ),
      key: 'new-workflow',
    },
  ];
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
