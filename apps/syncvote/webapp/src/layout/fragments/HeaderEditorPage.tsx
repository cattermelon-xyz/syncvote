import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';

import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString, getImageUrl, useGetDataHook } from 'utils';
import { Avatar, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from 'react';
import AvatarAndNoti from '@layout/fragments/AvatarAndNoti';
import { AuthContext } from '@layout/context/AuthContext';
import { TbBolt } from 'react-icons/tb';
import { config } from '@dal/config';
import { DownOutlined } from '@ant-design/icons';

type HeaderProps = {
  session: any;
  account?: any;
  setAccount?: any;
};

enum Pages {
  ORG_HOME,
  ORG_SELECTOR,
  ORG_SETTING,
  UNKNOWN,
}

function HeaderEditorPage({ session, account, setAccount }: HeaderProps) {
  const params = useLocation();
  // const token = window.localStorage.getItem('isConnectWallet');

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const navigate = useNavigate();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [currentOrg, setCurrentOrg] = useState(
    orgs.find((org: any) => org.id === orgId)
  );
  const { isAuth } = useContext(AuthContext);

  const handleClearStore = () => {};

  const redirectToLogin = () => {
    sessionStorage.setItem('lastVisitedPage', location.pathname);
    navigate('/login');
  };

  useEffect(() => {
    setCurrentOrg(orgs.find((org: any) => org.id === orgId));
  }, [orgs, orgId, session]);
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

  return (
    <div
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full font-sans z-20 bg-white border-0 border-b border-solid border-grey-version-3`}
    >
      <div className=' w-full flex justify-between'>
        <div className='flex p-0 gap-2 items-center'>
          <div className='flex items-center gap-2'>
            <span className='cursor-pointer flex'>
              {orgId !== -1 && currentPage !== Pages.ORG_HOME ? (
                <span className=' flex flex-row items-center px-4 py-2 rounded-lg gap-2'>
                  {/* <HomeOutlined
                    style={{ fontSize: '24px' }}
                    onClick={() => {
                      navigate('/');
                    }}
                  />
                  <span className='ml-2 mr-2'>/</span> */}
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
                        className=''
                      />
                    ) : (
                      <Avatar>{currentOrg?.title[0]}</Avatar>
                    )}
                  </span>
                  <span
                    className=' text-base	'
                    onClick={() => {
                      navigate(`/${orgIdString}`);
                    }}
                  >
                    {currentOrg?.title}
                  </span>
                  {/* <DownOutlined /> */}
                  {/* <Button
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
                  </Button> */}
                </span>
              ) : (
                <span
                  className='mr-2'
                  onClick={() => {
                    handleClearStore();
                    navigate('/');
                  }}
                >
                  <div className='flex top-[2%] pb-2 left-[1.3%]'>
                    <LogoSyncVote />
                  </div>
                </span>
              )}
            </span>
          </div>
        </div>
        <div className='flex row items-center'>
          {!isAuth ? (
            <Button type='link' icon={<TbBolt />} onClick={redirectToLogin}>
              Create your own workflow
            </Button>
          ) : null}
          {user && (
            <AvatarAndNoti
              user={user}
              account={account}
              setAccount={setAccount}
              isEditorPage={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderEditorPage;
