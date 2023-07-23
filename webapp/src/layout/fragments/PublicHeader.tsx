import Logo from '@assets/icons/svg-icons/Logo';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import { Button, Menu, MenuProps, Space } from 'antd';
import {
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
  CaretDownFilled,
} from '@ant-design/icons';
import { TbBolt } from 'react-icons/tb';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import GoogleIcon from '@assets/icons/svg-icons/GoogleIcon';

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

  const handleButton = () => {
    if (user.id === '') {
      navigate('/login');
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
      >
        <Menu
          className='border-[white] text-sm flex items-center lg:min-w-[280px]'
          mode='horizontal'
          items={items}
          theme='light'
        />
        <Button
          onClick={handleButton}
          style={{ marginLeft: 20 }}
          className='primary flex bg-[#FFF] text-[13px] gap-[10px] items-center border border-solid border-[#E3E3E2] rounded-[10px] cursor-pointer text-[#252422]'
        >
          <GoogleIcon />
          {user.id !== '' ? (
            <p>{session?.session?.user?.user_metadata?.full_name}</p>
          ) : (
            <p>Login</p>
          )}
        </Button>
      </Space>
    </Space>
  );
}

export default PublicHeader;
