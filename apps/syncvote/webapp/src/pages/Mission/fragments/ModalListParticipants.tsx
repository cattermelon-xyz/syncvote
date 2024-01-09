import React, { useEffect } from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  listParticipants: any[];
  historicalCheckpointData?: any;
}

const ModalListParticipants: React.FC<Props> = ({
  open,
  onClose,
  listParticipants,
  historicalCheckpointData,
}) => {
  const [listParticipantsState, setListParticipantsState] =
    React.useState<any>(listParticipants);

  const handleOk = async () => {
    onClose();
  };

  useEffect(() => {
    let historicalParticipants: any;
    if (historicalCheckpointData?.participation) {
      historicalParticipants = JSON.parse(
        historicalCheckpointData?.participation
      );
    }

    const listParticipantsToShow = historicalCheckpointData
      ? (historicalParticipants?.data as any[])
      : listParticipants;
    setListParticipantsState(listParticipantsToShow);
  }, [listParticipants, historicalCheckpointData]);

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
        {listParticipantsState && (
          <ul className='ml-4'>
            {listParticipantsState.map((participant: any, index: any) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default ModalListParticipants;
