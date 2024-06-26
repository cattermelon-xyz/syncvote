import { Checkbox, Modal, Space } from 'antd';
import { L } from '@utils/locales/L';
import { changeAWorkflowOrg } from '@dal/data';
import { useDispatch } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface MoveToWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  orgTo: any;
}

const MoveToWorkflowModal: React.FC<MoveToWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  orgTo,
}) => {
  const dispatch = useDispatch();

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
