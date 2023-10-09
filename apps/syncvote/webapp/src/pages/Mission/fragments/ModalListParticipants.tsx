import React from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  listParticipants: any[];
}

const ModalListParticipants: React.FC<Props> = ({
  open,
  onClose,
  listParticipants,
}) => {
  const handleOk = async () => {
    onClose();
  };

  return (
    <>
      <Modal
        title={'List Participants'}
        open={open}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          onClose();
        }}
      >
        {listParticipants && (
          <ul className='ml-4'>
            {listParticipants.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default ModalListParticipants;
