/* eslint-disable max-len */
import React, { useState } from 'react';
import ArrowDown from '@assets/icons/svg-icons/ArrowDown';
import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import Button from '@components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { L } from '@utils/locales/L';
import { useClickOutside } from '@utils/hooks/useClickOutSide';
import './styles.scss';
import { OrgPresetBanner } from '@utils/constants/organization';
import Icon from '@components/Icon/Icon';
import { Modal, Space } from 'antd';
import { useSelector } from 'react-redux';
import { createIdString, getImageUrl } from '@utils/helpers';
import { EditOutlined } from '@ant-design/icons';

const BannerDashBoard = ({
  org = {
    id: -1,
    banner_url: '',
    icon_url: '',
    title: '',
    desc: '',
    role: '',
  },
  setOrg,
  setShowOrgEdit,
}: {
  org: any,
  setOrg: (data:any) => void,
  setShowOrgEdit: (data: boolean) => void,
}) => {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const optionRef = useClickOutside(() => setIsDropDown(false));
  const navigate = useNavigate();
  const [shouldShowModal, setShouldShowModal] = useState(false);

  let bannerUrl = org.banner_url ? org.banner_url : `preset:${OrgPresetBanner}`;
  bannerUrl = getImageUrl({
    filePath: bannerUrl.indexOf('preset:') === 0 ? bannerUrl.replace('preset:', '') : bannerUrl, isPreset: bannerUrl.indexOf('preset:') === 0, type: 'banner',
  });
  const isAdmin = org.role === 'ADMIN';
  const presetBanners = useSelector((state: any) => state.ui.presetBanners);
  const handleIconChange = ({ filePath, isPreset }:{
    filePath: string,
    isPreset: boolean,
  }) => {
    setOrg({
      ...org,
      icon_url: isPreset ? `preset:${filePath}` : filePath,
    });
  };
  return (
    <div className="banner-image" style={{ backgroundImage: `url(${bannerUrl})` }}>
      <Modal
        title="Choose Banner"
        open={shouldShowModal}
        onCancel={() => {
          setShouldShowModal(false);
        }}
      >
        <div>
          {/* <span>Upload </span>
          <input type="file" /> */}
        </div>
        <div className="grid grid-cols-3 mt-4">
          {
            presetBanners.map((banner: any) => (
              <div
                key={banner}
                className="flex items-center w-[150px] p-1 cursor-pointer hover:bg-slate-200"
                onClick={
                  () => {
                    setOrg({
                      ...org,
                      banner_url: `preset:${banner}`,
                    });
                    setShouldShowModal(false);
                  }
                }
              >
                <img src={`${getImageUrl({ filePath: banner, isPreset: true, type: 'banner' })}`} alt="banner" className="w-[150px]" />
              </div>
            ))
          }
        </div>
      </Modal>
      <div className="container relative mx-auto h-full">
        <div className="flex items-end justify-between absolute bottom-[50px] left-0 right-0">
          <div className="flex">
            {org.icon_url ?
              (
                <Icon
                  editable={org.role === 'ADMIN'}
                  iconUrl={org.icon_url}
                  onUpload={handleIconChange}
                />
              )
              :
              (
                <Icon
                  editable={org.role === 'ADMIN'}
                  onUpload={handleIconChange}
                >
                  <span style={{ fontSize: '48px' }}>{org.title.charAt(0)}</span>
                </Icon>
              )
            }
            <Space direction="vertical" className="text-white ml-4">
              <Space direction="horizontal" className="text-white">
                <p className="text-lg font-semibold tracking-[0.374px]">
                  {org.title}
                </p>
                {isAdmin ? <EditOutlined className="cursor-pointer" onClick={() => { setShowOrgEdit(true); }} /> : null}
              </Space>
              <p>
                {org.desc}
              </p>
            </Space>
          </div>
          <div className="flex">
            {isAdmin ?
              (
                <Button
                  variant="outline"
                  className="text-white mr-2 change-banner-btn"
                  onClick={() => {
                    setShouldShowModal(true);
                  }}
                >
                  Change Banner
                </Button>
              )
              :
              null
            }
            <Button
              startIcon={<PlusIcon />}
              className="bg-white text-violet-version-5 py-[12px] px-[16px] border-[1.5px] border-solid border-[#5D23BB] !text-[17px] h-[48px]"
              variant="text"
              onClick={() => {
                navigate(`/${createIdString(org.title, org.id.toString())}/new-workflow`);
              }}
            >
              {L('newBlueprint')}
            </Button>
            <div className="relative">
              <Button
                onClick={() => setIsDropDown(!isDropDown)}
                startIcon={<PlusIcon color="white" />}
                className="text-text_2 ml-2 py-[12px] px-[16px] h-[48px]"
                endIcon={<ArrowDown />}
              >
                {L('createNew')}
              </Button>
              {isDropDown && (
                <div
                  id="dropdown"
                  className="z-40 bg-white rounded-lg min-w-[274px] absolute right-0 mt-2 border-1.5 border-gray-normal text-base leading-21px"
                >
                  <ul
                    className="text-sm text-gray-700"
                    aria-labelledby="dropdownDefaultButton"
                    ref={optionRef}
                  >
                    <li>
                      <div
                        onClick={() => {
                          navigate(`/${createIdString(org.title, org.id.toString())}/new-mission`);
                        }}
                        className="block py-[26px] px-[16px] text-[16px] hover:bg-gray-100 hover:rounded-tl-lg hover:rounded-tr-lg cursor-pointer"
                      >
                        {L('newInitiative')}
                      </div>
                    </li>
                    {/* <li>
                      <Link
                        to={`/${PAGE_ROUTES.CREATE_PROPOSAL}`}
                        className="block py-[26px] px-[16px] text-[16px] hover:bg-gray-100 hover:rounded-bl-lg hover:rounded-br-lg"
                      >
                        {L('newProposal')}
                      </Link>
                    </li> */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDashBoard;
