import { supabase, getImageUrl } from 'utils';
import { OrgPresetBanner } from '@utils/constants/organization';
import { Button, Modal, Space, Tabs } from 'antd';
import { useState } from 'react';
import './index.scss';
import { LoadingOutlined } from '@ant-design/icons';

type BannerProps = {
  bannerUrl: string;
  onChange?: (args: { filePath: string; isPreset: boolean }) => void;
  editable?: boolean;
  className?: string;
  presetBanners: any;
};

const Banner = ({
  bannerUrl,
  onChange,
  editable = false,
  className = '',
  presetBanners,
}: BannerProps) => {
  let url = bannerUrl ? bannerUrl : `preset:${OrgPresetBanner}`;
  url = getImageUrl({
    filePath: url.indexOf('preset:') === 0 ? url.replace('preset:', '') : url,
    isPreset: url.indexOf('preset:') === 0,
    type: 'banner',
  });
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [showButtonPanel, setShowButtonPanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadBanner = async (event: any) => {
    setUploading(true);
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const newFilePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('public_images')
        .upload(newFilePath, file);
      if (uploadError) {
        throw uploadError;
      }
      onChange
        ? onChange({
            filePath: newFilePath,
            isPreset: false,
          })
        : null;
      setUploading(false);
      setShouldShowModal(false);
    } catch (error: any) {
      Modal.error({
        title: 'Upload image error',
        content: error.message,
      });
      setUploading(false);
    }
  };
  return (
    <div className='_banner'>
      <Modal
        title={null}
        open={shouldShowModal}
        onCancel={() => {
          setShouldShowModal(false);
        }}
        footer={null}
        width={600}
      >
        <Tabs
          items={[
            {
              key: '1',
              label: 'Library',
              children: (
                <div className='grid grid-cols-3 mt-4 h-[300px] overflow-y-scroll gap-2 p-1'>
                  {presetBanners.map((banner: any) => (
                    <div
                      key={banner}
                      className='flex items-center w-[167px] h-[100px] p-1 cursor-pointer bg-center outline-violet-500 hover:outline rounded-md bg-cover'
                      onClick={() => {
                        setShouldShowModal(false);
                        onChange
                          ? onChange({
                              filePath: banner,
                              isPreset: true,
                            })
                          : null;
                      }}
                      style={{
                        backgroundImage: `url(${getImageUrl({
                          filePath: banner,
                          isPreset: true,
                          type: 'banner',
                        })})`,
                      }}
                    ></div>
                  ))}
                </div>
              ),
            },
            {
              key: '2',
              label: 'Upload',
              children: (
                <Space
                  direction='vertical'
                  size='small'
                  className='w-full -mt-2'
                >
                  <div>
                    <input
                      type='file'
                      id='single'
                      accept='image/*'
                      onChange={uploadBanner}
                      className='hidden'
                    />
                    <Button
                      type='default'
                      className='w-full'
                      onClick={() =>
                        document?.getElementById('single')?.click()
                      }
                    >
                      <div className='flex items-center w-full justify-center'>
                        {uploading ? <LoadingOutlined className='mr-2' /> : ''}
                        Upload file
                      </div>
                    </Button>
                  </div>
                  <div className='text-sx text-gray-400 w-full text-center'>
                    Maximum size per file is 5MB
                  </div>
                </Space>
              ),
            },
          ]}
        />
      </Modal>
      <div
        className={`w-full h-[150px] bg-cover bg-center relative ${className}`}
        style={{ backgroundImage: `url(${url})` }}
        onMouseOver={() => {
          editable ? setShowButtonPanel(true) : null;
        }}
        onMouseLeave={() => {
          editable ? setShowButtonPanel(false) : null;
        }}
      >
        <div
          className={`absolute right-2 bottom-2 ${
            showButtonPanel ? '' : 'hidden'
          }`}
        >
          <Space size='middle'>
            <Button
              type='default'
              className='bg-slate-100'
              onClick={() => setShouldShowModal(true)}
            >
              Change cover
            </Button>
            <Button type='default' className='bg-slate-100'>
              Reposition
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Banner;
