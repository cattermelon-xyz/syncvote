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

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  style?: React.CSSProperties,
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
    onClick,
  } as MenuItem;
}

function PublicHeader(session: any) {
  const { orgs, user } = useSelector((state: any) => state.orginfo);

  const navigate = useNavigate();

  const items: MenuProps['items'] = [
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
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === '4') {
      if (user.id === '') {
        navigate('/login');
      } else {
        window.open('/?action=new-workflow', '_blank');
      }
    }
  };

  const handleButton = () => {
    if (user.id === '') {
      navigate('/login');
    }
  };

  return (
    <div
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white`}
    >
      <div className='w-full flex justify-between'>
        <div className='flex p-0 gap-2 items-center'>
          <div
            className='flex items-center '
            onClick={() => {
              navigate('/');
            }}
          >
            <Logo width='128' height='24' />
          </div>
        </div>

        <div className='flex w-w_5 items-center justify-end'>
          <Menu
            className='header-public border-[white] text-[13px]'
            mode='horizontal'
            items={items}
            onClick={onClick}
          ></Menu>

          <Button
            onClick={handleButton}
            style={{ marginLeft: 20 }}
            className='primary flex bg-[#FFF] text-[13px] gap-[10px] items-center border border-solid border-[#E3E3E2] rounded-[10px] cursor-pointer text-[#252422]'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 25'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect
                width='24'
                height='24'
                transform='translate(0 0.5)'
                fill='white'
              ></rect>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M23.04 12.7615C23.04 11.946 22.9668 11.1619 22.8309 10.4092H12V14.8576H18.1891C17.9225 16.2951 17.1123 17.513 15.8943 18.3285V21.214H19.6109C21.7855 19.2119 23.04 16.2637 23.04 12.7615Z'
                fill='#4285F4'
              ></path>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M11.9995 23.9996C15.1045 23.9996 17.7077 22.9698 19.6104 21.2134L15.8938 18.328C14.864 19.018 13.5467 19.4257 11.9995 19.4257C9.00425 19.4257 6.46902 17.4028 5.5647 14.6846H1.72266V17.6641C3.61493 21.4225 7.50402 23.9996 11.9995 23.9996Z'
                fill='#34A853'
              ></path>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M5.56523 14.6855C5.33523 13.9955 5.20455 13.2584 5.20455 12.5005C5.20455 11.7425 5.33523 11.0055 5.56523 10.3155V7.33594H1.72318C0.944318 8.88844 0.5 10.6448 0.5 12.5005C0.5 14.3562 0.944318 16.1125 1.72318 17.665L5.56523 14.6855Z'
                fill='#FBBC05'
              ></path>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M11.9995 5.57386C13.6879 5.57386 15.2038 6.15409 16.3956 7.29364L19.694 3.99523C17.7024 2.13955 15.0992 1 11.9995 1C7.50402 1 3.61493 3.57705 1.72266 7.33545L5.5647 10.315C6.46902 7.59682 9.00425 5.57386 11.9995 5.57386Z'
                fill='#EA4335'
              ></path>
            </svg>

            
            {user.id !== '' ? (
              <p>{session?.session?.user?.user_metadata?.full_name}</p>
            ) : (
              <p>Login</p>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PublicHeader;
