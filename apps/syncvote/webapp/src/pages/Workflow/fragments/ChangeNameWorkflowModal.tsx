import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import Input from '@components/Input/Input';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSetData } from 'utils';
import { config } from '@dal/config';

interface ChangeNameWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
}

const ChangeNameWorkflowModal: React.FC<ChangeNameWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(workflow?.title);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    await useSetData({
      params: {
        id: workflow?.id,
        title: inputValue,
        desc: workflow?.desc,
        iconUrl: workflow?.icon_url,
        bannerUrl: workflow?.banner_url,
      },
      configInfo: config.updateAWorkflowInfo,
      dispatch: dispatch,
    });

    onClose();
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Modal
      title={L('changeName')}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={L('save')}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div>
        <Input
          value={inputValue}
          classes='w-full h-10 my-3'
          onChange={handleInputChange}
        />
      </div>
    </Modal>
  );
};

export default ChangeNameWorkflowModal;
