import { Button, Input, Select, Space } from 'antd';
import { useState } from 'react';
import { IWorkflowVersionLayout } from '../interface';
import { SaveOutlined } from '@ant-design/icons';

const LayoutFrm = ({layout}: {
  layout: IWorkflowVersionLayout
}) => {
  const id= layout.id || -1;
  const [title, setTitle] = useState('' || layout.title);
  const [description, setDescription] = useState('' || layout.description);
  const [screen, setScreen] = useState('' || layout.screen);
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space direction="vertical" size="middle" className="w-full">
        <span>Title</span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </Space>
      <Space direction="vertical" size="middle" className="w-full">
        <span>Description</span>
        <Input.TextArea
          className="w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Space>
      <Space direction="horizontal" size="middle" className="w-full flex justify-between">
        <span>Screen</span>
        <Select value={screen} onChange={(val) => {
          setScreen(val);
          setTitle(val === 'horizontal' ? 'Desktop' : 'Mobile')
        }} className="w-[200px]">
          <Select.Option value="horizontal">Horizontal | Desktop</Select.Option>
          <Select.Option value="vertical">Vertical | Mobile</Select.Option>
        </Select>
      </Space>
      <Space direction="horizontal" className="w-full flex justify-end">
        <Button type="primary" className="flex items-center" icon={<SaveOutlined/>}>
          Save
        </Button>
      </Space>
    </Space>
  )
}

export default LayoutFrm;