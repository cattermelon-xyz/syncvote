import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
// import { queryOrgByIdForInvite } from '@middleware/data';
import { useDispatch, useSelector } from 'react-redux';

interface ModalInviteOfSpaceCardProps {
  visible: boolean;
  onClose: () => void;
  dataSpace: any;
}

const ModalInviteOfSpaceCard: React.FC<ModalInviteOfSpaceCardProps> = ({
  visible,
  onClose,
  dataSpace,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const dispatch = useDispatch();
  const { orgs } = useSelector((state: any) => state.orginfo);

  // useEffect(() => {
  //   if (visible) {
  //     console.log('orgs', orgs.profile);
  //     queryOrgByIdForInvite({
  //       orgId: dataSpace.id,
  //       onSuccess: (data: any) => {
  //         console.log('dataQuery', data);
  //         // setOrg(data[0]);
  //       },
  //       dispatch,
  //     });
  //     console.log('data Modal', dataSpace);
  //   }
  // }, [dataSpace.id, visible, orgs.profile]);

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
        <p className='font-bold text-xl'>{`Share "${dataSpace.title}" workspace`}</p>
      </Modal>
    </>
  );
};

export default ModalInviteOfSpaceCard;
