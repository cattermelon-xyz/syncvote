import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import { deleteMission } from '@dal/data';

interface Props {
  visible: boolean;
  onClose: () => void;
  missionIdDelete: number;
  onUpdateProposals: any;
}

const ModalDeleteMission: React.FC<Props> = ({
  visible,
  onClose,
  missionIdDelete,
  onUpdateProposals,
}) => {

  const dispatch = useDispatch();
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    deleteMission({
      id: missionIdDelete,
      dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Delete proposal successfully',
        });
        onUpdateProposals((prevProposals: any) => {
          const newProposals = prevProposals.filter(
            (proposal: any) => proposal?.id !== missionIdDelete
          );
          return newProposals;
        });
        onClose();
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Failed to delete proposal',
        });
        onClose();
      },
    });
  };

  return (
    <Modal
      title='Delete Proposal'
      onOk={handleOk}
      open={visible}
      onCancel={handleCancel}
      okText={L('deleteForever')}
      okButtonProps={{ style: { backgroundColor: '#A22C29' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div>
        <p>Are you sure you want to delete this draft proposal ?</p>
      </div>
    </Modal>
  );
};

export default ModalDeleteMission;
