import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';

import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString, getImageUrl } from '@utils/helpers';
import { Avatar, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AvatarAndNoti from '@layout/fragments/AvatarAndNoti';

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

  return (
    <div
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full font-sans z-20 bg-white border-b border-solid border-grey-version-3`}
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
        {user && <AvatarAndNoti user={user} isShowAccountSetting={true} />}
      </div>
    </div>
  );
}

export default Header;
