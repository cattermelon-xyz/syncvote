import { SaveOutlined } from '@ant-design/icons';
import Banner from '@components/Banner/Banner';
import TextEditor from '@components/Editor/TextEditor';
import Icon from '@components/Icon/Icon';
import { Button, Drawer, Input, Space } from 'antd';
import { useEffect, useState } from 'react';

const EditWorkflow = ({
  open,
  setOpen,
  workflow,
  onSave,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
  workflow: any;
  onSave: (title: string, desc: string, iconUrl: string) => void;
}) => {
  const {
    title: workflowTitle,
    desc: workflowDesc,
    icon_url: workflowIcon,
  } = workflow || {
    title: '',
    desc: '',
    icon_url: '',
  };
  console.log(workflow);
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
      headerStyle={{ display: 'none' }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      size="large"
      bodyStyle={{ padding: '0px', backgroundColor: '#f6f6f6', width: '100%' }}
    >
      <div className="relative w-full">
        <Banner banner_url={workflow?.banner_url} onSave={() => {}} />
        <div className="absolute -bottom-[30px] left-[16px]">
          <Icon
            size="xlarge"
            iconUrl={iconUrl}
            editable
            onUpload={({ filePath, isPreset }) => {
              setIconUrl(isPreset ? `preset:${filePath}` : filePath);
            }}
          />
        </div>
      </div>
      <Space direction="vertical" size="large" className="px-4 py-10 w-full">
        <Space
          direction="vertical"
          size="small"
          className="p-4 rounded-lg bg-white w-full"
        >
          <Space direction="vertical" size="small" className="w-full">
            <div>Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Space>
          <Space direction="vertical" size="small" className="w-full">
            <div>Desc</div>
            <TextEditor
              value={desc}
              setValue={(val: any) => setDesc(val)}
              heightEditor={200}
            />
          </Space>
        </Space>
        {/* <Button
          type="default"
          className="w-full"
          icon={<SaveOutlined />}
          onClick={() => onSave(title, desc, iconUrl)}
        >
          Save
        </Button> */}
      </Space>
    </Drawer>
  );
};

export default EditWorkflow;
