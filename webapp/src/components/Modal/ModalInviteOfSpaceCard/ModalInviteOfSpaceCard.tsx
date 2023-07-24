import React, { useState } from 'react';
import { Modal } from 'antd';

interface ModalInviteOfSpaceCardProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

const ModalInviteOfSpaceCard: React.FC<ModalInviteOfSpaceCardProps> = ({
  visible,
  onClose,
  data,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  console.log('data Modal', data);

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    console.log('oke em');
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <>
      <Modal
        open={visible}
        // onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onClose}
        footer={null}
      >
        <p className='font-bold text-xl'>{`Share "${data.title}" workspace`}</p>
      </Modal>
    </>
  );
};

export default ModalInviteOfSpaceCard;
