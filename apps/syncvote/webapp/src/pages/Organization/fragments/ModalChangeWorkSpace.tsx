import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { Icon } from 'icon';
import { Icon } from 'icon';
import { L } from '@utils/locales/L';
import { useDispatch } from 'react-redux';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';

interface ModalChangeWorkSpaceProps {
  visible: boolean;
  onClose: () => void;
  dataSpace: any;
}

const ModalChangeWorkSpace: React.FC<ModalChangeWorkSpaceProps> = ({
  visible,
  onClose,
  dataSpace,
}) => {
  const dispatch = useDispatch();
  const [iconUrl, setIconUrl] = useState(dataSpace?.icon_url);
  const [title, setTitle] = useState(dataSpace?.title);

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const handleCancel = () => {
    onClose();
  };

  const handleChangeIcon = (obj: any) => {
    const newIcon = obj.isPreset ? `preset:${obj.filePath}` : obj.filePath;
    setIconUrl(newIcon);
  };

  const handleChangeSpaceInfo = async () => {
    await useSetData({
      params: {
        org: {
          ...dataSpace,
          icon_url: iconUrl,
          title: title,
        },
      },
      configInfo: config.upsertAnOrg,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Change avatar successfully',
        });
        onClose();
      },
      onError: () => {
        // Lưu ý thêm tham số error
        Modal.error({
          title: 'Error',
          content: 'Cannot change avatar',
        });
        onClose();
      },
      dispatch: dispatch,
    });

    // upsertAnOrg({
    //   org: {
    //     ...dataSpace,
    //     icon_url: iconUrl,
    //     title: title,
    //   },
    //   onLoad: (data) => {
    //     Modal.success({
    //       title: 'Success',
    //       content: 'Change avatar successfully',
    //     });
    //     onClose();
    //   },
    //   onError: (error) => {
    //     // Lưu ý thêm tham số error
    //     Modal.error({
    //       title: 'Error',
    //       content: 'Cannot change avatar',
    //     });
    //     onClose();
    //   },
    //   dispatch,
    // });
  };

  return (
    <Modal
      title={<Title />}
      onOk={handleChangeSpaceInfo}
      open={visible}
      onCancel={handleCancel}
      okText={L('save')}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Icon
        presetIcon={presetIcons}
        size='xlarge'
        editable
        iconUrl={iconUrl}
        onUpload={handleChangeIcon}
      />
      <div className='mt-4'>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full'
        />
      </div>
    </Modal>
  );
};

export default ModalChangeWorkSpace;

const Title = () => {
  return <p className='text-xl'>{L('changeSpaceInfo')}</p>;
};
