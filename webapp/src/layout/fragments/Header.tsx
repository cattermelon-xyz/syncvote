import Logo from '@assets/icons/svg-icons/Logo';
import { L } from '@utils/locales/L';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import { supabase } from '@utils/supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString, getImageUrl } from '@utils/helpers';
import { Avatar, Button, Popover, Space } from 'antd';
import Icon from '@components/Icon/Icon';
import {
  HomeOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

type HeaderProps = {
  session: any;
};

enum Pages {
  ORG_HOME,
  ORG_SELECTOR,
  ORG_SETTING,
  UNKNOWN,
}

function Header({ session }: HeaderProps) {
  const params = useLocation();
  // const token = window.localStorage.getItem('isConnectWallet');
  const dispatch = useDispatch();
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const navigate = useNavigate();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [currentOrg, setCurrentOrg] = useState(
    orgs.find((org: any) => org.id === orgId)
  );
  const [openPopover, setOpenPopover] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpenPopover(newOpen);
  };

  const handleClearStore = () => {};

  useEffect(() => {
    setCurrentOrg(orgs.find((org: any) => org.id === orgId));
  }, [orgs, orgId]);
  let currentPage = Pages.UNKNOWN;
  switch (params.pathname) {
    case `/${orgIdString}`:
      currentPage = Pages.ORG_HOME;
      break;
    case `/${orgIdString}/setting`:
      currentPage = Pages.ORG_SETTING;
      break;
    case '/':
      currentPage = Pages.ORG_SELECTOR;
      break;
    default:
      currentPage = Pages.UNKNOWN;
      break;
  }

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
    <div
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white drop-shadow-md`}
    >
      <div className=' w-full flex justify-between'>
        <div className='flex p-0 gap-2 items-center'>
          <div className='flex items-center gap-2'>
            <span className='cursor-pointer flex'>
              {orgId !== -1 && currentPage !== Pages.ORG_HOME ? (
                <span className='text-xl flex flex-row items-center'>
                  <HomeOutlined
                    style={{ fontSize: '24px' }}
                    onClick={() => {
                      navigate('/');
                    }}
                  />
                  <span className='ml-2 mr-2'>/</span>
                  <span
                    onClick={() => {
                      navigate(`/${orgIdString}`);
                    }}
                  >
                    {currentOrg?.icon_url ? (
                      <Avatar
                        src={getImageUrl({
                          filePath: currentOrg?.icon_url?.replace(
                            'preset:',
                            ''
                          ),
                          isPreset:
                            currentOrg?.icon_url?.indexOf('preset:') === 0,
                          type: 'icon',
                        })}
                        className='mx-2'
                      />
                    ) : (
                      <Avatar>{currentOrg?.title[0]}</Avatar>
                    )}
                  </span>
                  <span
                    className='mr-4'
                    onClick={() => {
                      navigate(`/${orgIdString}`);
                    }}
                  >
                    {currentOrg?.title}
                  </span>
                  <Button
                    type='text'
                    // disabled={currentPage === Pages.ORG_HOME}
                    onClick={() => {
                      navigate(`/${orgIdString}`);
                    }}
                  >
                    Governance
                  </Button>
                  <Button
                    type='text'
                    className='ml-2'
                    disabled={currentPage === Pages.ORG_SETTING}
                    onClick={() => {
                      navigate(`/${orgIdString}/setting`);
                    }}
                  >
                    Settings
                  </Button>
                </span>
              ) : (
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
              )}
            </span>
          </div>
        </div>
        <Space className='flex w-w_3 items-center justify-end gap-3'>
          <div className='flex rounded-full h-11 w-11 bg-gray-100 justify-center cursor-pointer'>
            <BellOutlined style={{ fontSize: '24px' }} />
          </div>
          <Popover
            placement='bottomRight'
            content={contentPopOver}
            trigger='click'
            open={openPopover}
            onOpenChange={handleOpenChange}
          >
            <div className='border-b_2 h-11 px-2 py-2 mr-0 rounded-full border-gray-normal bg-gray-100 cursor-pointer flex items-center'>
              <Icon size='medium' iconUrl={user?.avatar_url} />
              <p className='text-text_2 text-[#252422] ml-2'>
                {/* {token ? sliceAddressToken(AddressToken.ip_address, 5) : 'Connect wallet'} */}
                {user?.full_name}
              </p>
            </div>
          </Popover>
        </Space>
      </div>
    </div>
  );
}

export default Header;
