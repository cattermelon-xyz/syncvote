import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Space } from 'antd';
import { useState } from 'react';
import { IWorkflowVersionCosmetic, IWorkflowVersionLayout } from '../interface';
import LayoutFrm from './LayoutFrm';
import EditIcon from '../../assets/EditIcon';

const CosmeticConfigPanel = ({
  layouts,
  onCosmeticChanged,
  deleteLayoutHandler,
}: {
  layouts: IWorkflowVersionLayout[];
  onCosmeticChanged: (data: IWorkflowVersionCosmetic) => void;
  deleteLayoutHandler: (layoutId: string) => void;
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
    <Space direction='vertical' size='large' className='w-full'>
      <Drawer
        title='New Layout'
        open={showNewLayoutModal}
        onClose={() => setShowNewLayoutModal(false)}
      >
        <LayoutFrm
          layout={{ ...emptyLayout }}
          onCosmeticChanged={(data) => {
            setShowNewLayoutModal(false);
            onCosmeticChanged(data);
          }}
        />
      </Drawer>
      <Space direction='horizontal' className='flex justify-between w-full'>
        <span>Layouts</span>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => setShowNewLayoutModal(true)}
          className='flex items-center'
        >
          New Layout
        </Button>
      </Space>
      <Space direction='vertical' className='w-full' size='small'>
        {layouts?.map((layout, index) => {
          return (
            <Space
              key={layout.id}
              className='pr-2 justify-between w-full flex items-center'
            >
              <Space direction='horizontal' className='flex items-center'>
                {layout.title}
                <span className='px-2' onClick={() => {}}>
                  <EditIcon />
                </span>
              </Space>
              <span>{layout.screen}</span>
            </Space>
          );
        })}
      </Space>
    </Space>
  );
};

export default CosmeticConfigPanel;
