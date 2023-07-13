import { getImageUrl } from '@utils/helpers';
import { OrgPresetBanner } from '@utils/constants/organization';
import { Button, Modal, Space } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';

type BannerProps = {
  banner_url: string;
  onSave: (banner_url: string) => void;
};

const Banner = ({ banner_url, onSave }: BannerProps) => {
  let bannerUrl = banner_url ? banner_url : `preset:${OrgPresetBanner}`;
  bannerUrl = getImageUrl({
    filePath:
      bannerUrl.indexOf('preset:') === 0
        ? bannerUrl.replace('preset:', '')
        : bannerUrl,
    isPreset: bannerUrl.indexOf('preset:') === 0,
    type: 'banner',
  });
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const presetBanners = useSelector((state: any) => state.ui.presetBanners);
  const [showButtonPanel, setShowButtonPanel] = useState(false);
  return (
    <>
      <Modal
        title="Choose Banner"
        open={shouldShowModal}
        onCancel={() => {
          setShouldShowModal(false);
        }}
      >
        <div>
          <span>Upload </span>
          <input type="file" />
        </div>
        <div className="grid grid-cols-3 mt-4">
          {presetBanners.map((banner: any) => (
            <div
              key={banner}
              className="flex items-center w-[150px] p-1 cursor-pointer hover:bg-slate-200"
              onClick={() => {
                setShouldShowModal(false);
              }}
            >
              <img
                src={`${getImageUrl({
                  filePath: banner,
                  isPreset: true,
                  type: 'banner',
                })}`}
                alt="banner"
                className="w-[150px]"
              />
            </div>
          ))}
        </div>
      </Modal>
      <div
        className="w-full h-[150px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bannerUrl})` }}
        onMouseOver={() => setShowButtonPanel(true)}
        onMouseLeave={() => setShowButtonPanel(false)}
      >
        <div
          className={`absolute right-2 bottom-2 ${
            showButtonPanel ? '' : 'hidden'
          }`}
        >
          <Space size="middle">
            <Button
              type="default"
              className="bg-slate-100"
              onClick={() => setShouldShowModal(true)}
            >
              Change cover
            </Button>
            <Button type="default" className="bg-slate-100">
              Reposition
            </Button>
          </Space>
        </div>
      </div>
    </>
  );
};

export default Banner;
