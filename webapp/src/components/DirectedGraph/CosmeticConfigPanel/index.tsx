import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { IWorkflowVersionLayout } from '../interface';

const CosmeticConfigPanel = ({layouts , newLayoutHandler, deleteLayoutHandler}: {
  layouts: IWorkflowVersionLayout[],
  newLayoutHandler: () => void,
  deleteLayoutHandler: (layoutId: string) => void,
}) => {
  const [showNewLayoutModal, setShowNewLayoutModal] = useState(false);
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space direction="horizontal" className="flex justify-between w-full">
        <span>Layouts</span>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setShowNewLayoutModal(true)}
          className="flex items-center"
        >
          New Layout
        </Button>
      </Space>
      <Space direction="vertical">
        {/* {layouts?.map((layout, index) => {
          return (
            <Space key={layout.id} className="pointer-cursor p-2">
              {index}
            </Space>
          )
        })} */}
      </Space>
    </Space>
  )
}

export default CosmeticConfigPanel;