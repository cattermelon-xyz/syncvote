import React, { useEffect } from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  docTitle?: string;
  versionOfADoc?: any;
}

const ModalHistoryOfADoc: React.FC<Props> = ({
  open,
  onClose,
  docTitle,
  versionOfADoc,
}) => {
  const handleOk = async () => {
    onClose();
  };

  useEffect(() => {
    console.log('versionOfADoc', versionOfADoc);
  }, [versionOfADoc]);

  return (
    <>
      <Modal
        title={docTitle}
        open={open}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          onClose();
        }}
      ></Modal>
    </>
  );
};

export default ModalHistoryOfADoc;
