import { useState } from 'react';
import { Avatar, Modal } from 'antd';
import { UserOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { L } from '../../utils/locales/L';
import { supabase } from '../../utils/supabaseClient';
import { getImageUrl } from '../../utils/helpers';

const ChooseImageModal = ({
    isOpen = false, onCancel, uploadIcon,
  }: {
    isOpen?: boolean,
    onCancel: () => void,
    uploadIcon: (args: any) => void,
  }) => {
  const { presetIcons } = useSelector((state:any) => state.ui);
  return (
    <Modal open={isOpen} title={L('chooseIcon')} onCancel={onCancel}>
      <p>Choose or upload one</p>
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadIcon}
      />
      <div className="grid grid-cols-6 mt-4">
        {
          presetIcons.map((icon:string) => (
            <div
              key={icon}
              className="flex items-center w-[36px] h-[36px] p-1 cursor-pointer hover:bg-slate-200"
              onClick={() => {
                uploadIcon(icon);
              }}
            >
              <img
                src={getImageUrl({ filePath: icon, isPreset: true, type: 'icon' })}
                alt="icon"
                // className="w-[16px] h-[16px]"
              />
            </div>
          ))
        }
      </div>
    </Modal>
  );
};

interface UploadIconProps {
  filePath?: string,
  isPreset?: boolean,
}

const UploadBtn = ({ uploading = false, uploadIcon }: {
  uploading?: boolean,
  uploadIcon: (args: UploadIconProps) => void,
}) => {
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  return (
    <div className="absolute right-0 bottom-0">
      <Avatar
        className="cursor-pointer"
        onClick={() => {
          setShouldShowDialog(true);
        }}
        size={36}
        icon={uploading === true ? <LoadingOutlined /> : <CameraOutlined />}
      />
      <ChooseImageModal
        isOpen={shouldShowDialog}
        onCancel={() => setShouldShowDialog(false)}
        // uploading={uploading}
        uploadIcon={(args: UploadIconProps) => {
          setShouldShowDialog(false);
          uploadIcon(args);
        }}
      />
    </div>
  );
};

const Icon = ({
    iconUrl, size = 'xlarge', onUpload, editable, children,
  }: {
    iconUrl?: string,
    size?: 'small' | 'medium' | 'large' | 'xlarge',
    onUpload?: (args: { filePath: string, isPreset: boolean }) => void,
    editable?: boolean,
    children?: React.ReactNode,
  }) => {
  const [uploading, setUploading] = useState(false);
  const filePath = iconUrl?.indexOf('preset:') === 0 ? iconUrl?.replace('preset:', '') : iconUrl;
  const url = getImageUrl({ filePath, isPreset: iconUrl?.indexOf('preset:') === 0, type: 'icon' });
  const uploadIcon = async (event : any) => {
    if (onUpload) {
      if (typeof event === 'string') {
        onUpload({
          filePath: event,
          isPreset: true,
        });
      } else {
        try {
          setUploading(true);
          if (!event.target.files || event.target.files.length === 0) {
            throw new Error('You must select an image to upload.');
          }
          const file = event.target.files[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const newFilePath = `${fileName}`;
          const { error: uploadError } = await supabase.storage.from('public_images').upload(newFilePath, file);
          if (uploadError) {
            throw uploadError;
          }
          onUpload({
            filePath: newFilePath,
            isPreset: false,
          });
        } catch (error:any) {
          Modal.error({
            title: 'Upload image error',
            content: error.message,
          });
        } finally {
          setUploading(false);
        }
      }
    }
  };
  const getSize = (_size:string) => { // _size x _size px
    switch (_size) {
      case 'small': return 16;
      case 'medium': return 32;
      case 'large': return 48;
      case 'xlarge': return 96;
      default: return 32;
    }
  };
  return (
    <>
      {url ? (
        <div className="relative inline">
          <Avatar size={getSize(size)} src={<img src={url} alt="icon_+{getSize(size)}" className="bg-white outline outline-2 outline-white" />} />
          {editable === true ? <UploadBtn uploading={uploading} uploadIcon={uploadIcon} /> : null}
        </div>
      ) : (
        <div className="relative inline" style={{ position: 'relative', display: 'inline-block' }}>
          {children ?
          (
            <Avatar size={getSize(size)} className="outline outline-2 bg-slate-400">
              {children}
            </Avatar>
          )
          :
            <Avatar size={getSize(size)} icon={<UserOutlined />} className="outline outline-2 outline-white" />}
          {editable === true ? <UploadBtn uploading={uploading} uploadIcon={uploadIcon} /> : null}
        </div>
      )}
    </>
  );
};

export default Icon;
