import { Modal, Image, Divider, Empty } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';
import { createIdString } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';

interface PreviewWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
  dispatch: any;
}

const PreviewWorkflowModal: React.FC<PreviewWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  dispatch,
}) => {
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const handleCancel = () => {
    onClose();
  };
  const navigate = useNavigate();

  const handleOk = async () => {
    const org = orgs.find((org: any) => org.id === workflow.owner_org_id);
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);

    navigate(
      `/${orgIdString}/${workflow.id}/${workflow.workflow_version[0].id}`
    );

    onClose();
  };

  return (
    <Modal
      title={`Preview "${workflow.title}"`}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={'Open editor page'}
      cancelButtonProps={{ style: { display: 'none' } }}
      width={700}
      okButtonProps={{ style: { background: '#F4F0FA', color: '#6200EE' } }}
    >
      {workflow?.workflow_version[0].preview_image_url === null ? (
        <Empty></Empty>
      ) : (
        <div style={{ border: '1px solid #E3E3E2' }}>
          <Image
            preview={false}
            width={600}
            src={`${workflow?.workflow_version[0].preview_image_url}`}
          />
        </div>
      )}
    </Modal>
  );
};

export default PreviewWorkflowModal;
