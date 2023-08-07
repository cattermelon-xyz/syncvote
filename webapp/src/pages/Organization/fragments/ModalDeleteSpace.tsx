import React from 'react';
import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import { deleteOrg } from '@middleware/data';
import { useDispatch } from 'react-redux';

interface ModalDeleteSpaceProps {
  visible: boolean;
  onClose: () => void;
  dataSpace: any;
}

const ModalDeleteSpace: React.FC<ModalDeleteSpaceProps> = ({
  visible,
  onClose,
  dataSpace,
}) => {
  const dispatch = useDispatch();
  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    deleteOrg({
      orgId: dataSpace.id,
      dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Delete workspace successfully',
        });
        onClose();
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Failed to delete workspace',
        });
        onClose();
      },
    });
  };

  return (
    <Modal
      title={<Title titleSpace={dataSpace.title} />}
      onOk={handleOk}
      open={visible}
      onCancel={handleCancel}
      okText={L('deleteForever')}
      okButtonProps={{ style: { backgroundColor: '#A22C29' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div>
        <p>
          Are you sure you want to delete this workspace and all its contained
          workflows? This action cannot be undone and all associated data will
          be permanently removed from the system.
        </p>
      </div>
    </Modal>
  );
};

export default ModalDeleteSpace;

const Title: React.FC<{ titleSpace: string }> = ({ titleSpace }) => {
  return <p className='text-xl'>{` Delete "${titleSpace}"`}</p>;
};
