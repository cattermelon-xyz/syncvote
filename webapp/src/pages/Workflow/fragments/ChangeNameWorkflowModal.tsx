import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import Input from '@components/Input/Input';
import { useState } from 'react';
import { updateAWorkflowInfo } from '@middleware/data';

interface ChangeNameWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  dispatch: any;
}

const ChangeNameWorkflowModal: React.FC<ChangeNameWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  dispatch,
}) => {
  const [inputValue, setInputValue] = useState(workflow?.title);
  
  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    await updateAWorkflowInfo({
      info: {
        id: workflow?.id,
        title: inputValue,
        desc: workflow?.desc,
        iconUrl: workflow?.icon_url,
        bannerUrl: workflow?.banner_url,
      },
      dispatch: dispatch,
      onSuccess: (data: any) => {
        console.log(data);
      },
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
