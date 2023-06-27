import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Space } from 'antd';
import { useState } from 'react';
import { IWorkflowVersionLayout } from '../interface';
import LayoutFrm from './LayoutFrm';

const CosmeticConfigPanel = ({layouts , newLayoutHandler, deleteLayoutHandler}: {
  layouts: IWorkflowVersionLayout[],
  newLayoutHandler: () => void,
  deleteLayoutHandler: (layoutId: string) => void,
}) => {
  const [showNewLayoutModal, setShowNewLayoutModal] = useState(false);
  const emptyLayout = {
    id: '',
    screen: 'horizontal',
    title: '',
    description: '',
    renderer: 'default',
  };
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Drawer
        title="New Layout"
        open={showNewLayoutModal}
        onClose={() => setShowNewLayoutModal(false)}
      >
        <LayoutFrm layout={{...emptyLayout}} />
      </Drawer>
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