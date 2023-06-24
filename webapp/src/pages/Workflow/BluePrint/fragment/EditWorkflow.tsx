import { SaveOutlined } from '@ant-design/icons';
import Icon from '@components/Icon/Icon';
import {
  Button, Drawer, Input, Space,
} from 'antd';
import { useEffect, useState } from 'react';

const EditWorkflow = ({
  open, setOpen, workflowTitle, workflowDesc, onSave, workflowIcon,
}: {
  open: boolean;
  setOpen: (data:boolean) => void;
  workflowTitle: string;
  workflowDesc: string;
  workflowIcon: string;
  onSave: (title:string, desc:string, iconUrl:string) => void;
}) => {
  const [title, setTitle] = useState(workflowTitle);
  const [desc, setDesc] = useState(workflowDesc);
  const [iconUrl, setIconUrl] = useState(workflowIcon);
  useEffect(() => {
    setTitle(workflowTitle);
    setDesc(workflowDesc);
    setIconUrl(workflowIcon);
  }, [workflowTitle, workflowDesc, workflowIcon, open]);
  return (
    <Drawer
      title="Edit Workflow"
      open={open}
      onClose={() => { setOpen(false); }}
    >
      <Space direction="vertical" size="large" className="w-full">
        <Icon
          size="xlarge"
          iconUrl={iconUrl}
          editable
          onUpload={({ filePath, isPreset }) => {
            setIconUrl(isPreset ? `preset:${filePath}` : filePath);
          }}
        />
        <Space direction="vertical" size="small" className="w-full">
          <div>Title</div>
          <Input
            value={title}
            className="w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Space>
        <Space direction="vertical" size="small" className="w-full">
          <div>Desc</div>
          <Input.TextArea
            value={desc}
            className="w-full"
            onChange={(e) => setDesc(e.target.value)}
          />
        </Space>
        <Button
          type="default"
          className="w-full"
          icon={<SaveOutlined />}
          onClick={() => onSave(title, desc, iconUrl)}
        >
          Save
        </Button>
      </Space>
    </Drawer>
  );
};

export default EditWorkflow;
