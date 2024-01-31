import React, { useEffect } from 'react';
import { Card, Modal } from 'antd';
import parse from 'html-react-parser';

interface ModalSubmissionProps {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
  submissionData: any;
}

const ModalSubmission: React.FC<ModalSubmissionProps> = ({
  open,
  onClose,
  onSubmit,
  submissionData,
}) => {
  useEffect(() => {
    console.log('submissionData', submissionData);
  }, [submissionData]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onSubmit(submissionData);
    onClose();
  };

  const modalTitle = (
    <div className='font-medium	text-2xl'>Confirm submission</div>
  );

  return (
    <Modal
      title={modalTitle}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={'Confirm'}
      okButtonProps={{ style: { backgroundColor: '#6200EE' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Card
        className='flex flex-col overflow-hidden'
        style={{ height: '150px', width: '466px' }}
      >
        <p className='font-semibold'>{submissionData?.submission?.title}</p>
        <div className=''>{parse(submissionData?.submission?.raw || '')}</div>
      </Card>
    </Modal>
  );
};

export default ModalSubmission;
