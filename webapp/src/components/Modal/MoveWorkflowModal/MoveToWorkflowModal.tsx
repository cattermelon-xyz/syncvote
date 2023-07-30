import { Button, Checkbox, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { L } from '@utils/locales/L';
import { useEffect, useState } from 'react';
import { changeAWorkflowOrg, getDataOrgs } from '@middleware/data';
import { useSelector } from 'react-redux';
import Icon from '@components/Icon/Icon';
import './create-new.scss';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface MoveToWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  dispatch: any;
  orgTo: any;
}

const MoveToWorkflowModal: React.FC<MoveToWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  dispatch,
  orgTo,
}) => {
  const handleCancel = () => {
    onClose();
  };
  const handleOk = async () => {
    await changeAWorkflowOrg({
      orgId: orgTo?.id,
      workflow: workflow,
      dispatch,
    });
    onClose();
  };

  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <Modal
      title={`${L('move')} "${workflow?.title}" to "${orgTo?.title}"`}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={L('move')}
      className='create-new'
    >
      <Space className='flex'>
        <div style={{ color: '#575655' }} className='text-sm not-italic	mb-3'>
          Editors of this workflow will still remain access. Existing and future
          editors of selected workspace will gain access to this workflow.
        </div>
      </Space>
      <Space>
        <Checkbox onChange={onChange}>Don't reminbd me this again</Checkbox>
      </Space>
    </Modal>
  );
};

export default MoveToWorkflowModal;
