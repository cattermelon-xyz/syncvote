import { Drawer, Space, Select, Segmented, Divider } from 'antd';
import { useState } from 'react';

const NewTriggerDrawer = ({
  selectedNode,
  triggers,
  onChange,
  options,
  AddElement,
  selectedIntegrationId,
  setSelectedIntegrationId,
  showAddTriggerDrawer,
  setShowAddTriggerDrawer,
  selectedIntegration,
  setSelectedTriggerAt,
  selectedTriggerAt,
  triggerAtOptions,
}: {
  selectedNode: any;
  triggers: any[];
  onChange: (data: any) => void;
  options: any[];
  AddElement: any;
  selectedIntegrationId: string | undefined;
  setSelectedIntegrationId: (value: string) => void;
  showAddTriggerDrawer: boolean;
  setShowAddTriggerDrawer: (value: boolean) => void;
  selectedIntegration: any;
  setSelectedTriggerAt: (value: string) => void;
  selectedTriggerAt: string | undefined;
  triggerAtOptions: any[];
}) => {
  const [selectedSegmented, setSelectedSegmented] = useState(
    selectedTriggerAt === 'this' ? 'this' : 'end'
  );
  return (
    <Drawer
      open={showAddTriggerDrawer}
      title='Add Trigger'
      onClose={() => {
        setShowAddTriggerDrawer(false);
      }}
    >
      <Space direction='vertical' className='w-full' size='small'>
        <Space direction='vertical' className='w-full' size='small'>
          <div>Trigger this action</div>
          <Segmented
            block
            options={[
              {
                label: 'At the start',
                value: 'this',
              },
              {
                label: 'At the end',
                value: 'end',
              },
            ]}
            value={selectedSegmented === 'this' ? 'this' : 'end'}
            onChange={(value) => {
              setSelectedSegmented(value === 'this' ? 'this' : 'end');
              setSelectedTriggerAt(value === 'this' ? 'this' : '');
            }}
          />
          {selectedSegmented === 'this' ? (
            <span className='text-xs'>
              Action triggers when this checkpoint is active
            </span>
          ) : (
            <>
              <span className='text-xs'>
                Action triggers when voting ends with specific results
              </span>
              <div>Trigger by results</div>
              <Select
                options={triggerAtOptions}
                className='w-full'
                value={selectedTriggerAt}
                onChange={(value) => {
                  setSelectedTriggerAt(value);
                }}
              />
            </>
          )}
        </Space>
        <Divider />
        <Space direction='vertical' size='small' className='w-full'>
          <span>Action</span>
          <Select
            options={options}
            value={selectedIntegrationId}
            onChange={(value) => {
              setSelectedIntegrationId(value);
            }}
            defaultValue='Select an action'
            className='w-full'
          />
        </Space>
        {selectedIntegrationId ? (
          <Space direction='vertical' className='w-full' size='small'>
            <AddElement
              data={selectedIntegration}
              onChange={(data: any) => {
                const tmpData = structuredClone(data);
                const tmpSelectedNode = structuredClone(selectedNode);
                tmpData.integrationId = selectedIntegrationId;
                delete tmpData.id;
                delete tmpData.access_token;
                delete tmpData.refresh_token;
                delete tmpData.refresh_token_expires_at;
                delete tmpData.created_at;
                delete tmpData.scope;
                delete tmpData.updated_at;
                onChange({
                  ...tmpSelectedNode,
                  triggers: [
                    ...triggers,
                    {
                      provider: selectedIntegration?.provider,
                      name: `Trigger#${triggers.length + 1}`,
                      triggerAt: selectedTriggerAt,
                      ...tmpData,
                    },
                  ],
                });
                setShowAddTriggerDrawer(false);
              }}
            />
          </Space>
        ) : null}
      </Space>
    </Drawer>
  );
};

export default NewTriggerDrawer;
