import { SaveOutlined } from '@ant-design/icons';
import {
  Button, Drawer, Input, Space,
} from 'antd';
import { useEffect, useState } from 'react';

const NewVersion = ({
  open, versionTitle, setOpen, onSave,
}:{
  open: boolean,
  versionTitle: string,
  setOpen: (data:boolean) => void;
  onSave: (title:string) => void;
}) => {
  const [title, setTitle] = useState(versionTitle);
  useEffect(() => {
    setTitle(versionTitle);
  }, [versionTitle]);
  return (
    <Drawer
      open={open}
      title="New Version"
      onClose={() => { setOpen(false); }}
    >
      <Space direction="vertical" size="large" className="w-full">
        <Space direction="vertical" size="small" className="w-full">
          <div>Version Title</div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </Space>
        <Button
          type="default"
          icon={<SaveOutlined />}
          onClick={() => onSave(title)}
          className="w-full"
        >
          Save
        </Button>
      </Space>
    </Drawer>
  );
};

export default NewVersion;
