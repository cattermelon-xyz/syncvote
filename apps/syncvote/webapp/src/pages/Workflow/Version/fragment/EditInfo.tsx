import { useEffect, useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import {
  Button, Input, Space, Switch,
} from 'antd';

const emptyState = {
  version: '',
  status: 'DRAFT',
  recommended: false,
};
// TODO: forbid special character
const EditInfo = ({
  info,
  onSave,
  shouldResetDisplay = false,
}: {
  info: any,
  onSave: (data:any) => void,
  shouldResetDisplay: boolean,
}) => {
  const [display, setDisplay] = useState({ ...emptyState });
  useEffect(() => {
    setDisplay(!shouldResetDisplay ? { ...emptyState }
      :
    {
      version: info.version,
      status: info.status,
      recommended: info.recommended,
    });
  }, [shouldResetDisplay]);
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space direction="vertical" size="small" className="w-full">
        <span>Version title</span>
        <Input
          value={display?.version}
          onChange={(e) => {
            setDisplay({ ...info, version: e.target.value });
          }}
          className="w-full"
        />
      </Space>
      <Space direction="horizontal" size="small" className="flex justify-between">
        <span>Publish status</span>
        <Switch
          checked={display?.status === 'PUBLISHED'}
          onChange={(val) => {
            // TODO: should not let user unpublish a published version
            setDisplay({ ...display, status: val ? 'PUBLISHED' : 'DRAFT' });
          }}
        />
      </Space>
      <Space direction="horizontal" size="small" className="flex justify-between">
        <span>Recommended status</span>
        <Switch
          checked={display?.recommended}
          onChange={(val) => {
            setDisplay({ ...display, recommended: val });
          }}
        />
      </Space>
      <Button
        type="default"
        className="w-full"
        onClick={() => {
          onSave(display);
          setDisplay({
            version: '',
            status: 'DRAFT',
            recommended: false,
          });
        }}
        icon={<SaveOutlined />}
      >
        Save
      </Button>
    </Space>
  );
};

export default EditInfo;
