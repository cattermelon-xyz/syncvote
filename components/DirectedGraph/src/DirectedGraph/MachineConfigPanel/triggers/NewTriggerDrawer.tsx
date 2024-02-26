import { Drawer, Space, Select, Segmented, Divider } from 'antd';
import { useState } from 'react';
import { IWeb2Integration } from '../../../..';

const NewTriggerDrawer = ({
  selectedNode,
  triggers,
  onChange,
  getEnforcer,
  showAddTriggerDrawer,
  setShowAddTriggerDrawer,
  selectedTriggerAt,
  allData,
  integrations,
}: {
  selectedNode: any;
  triggers: any[];
  onChange: (data: any) => void;
  getEnforcer: any;
  showAddTriggerDrawer: boolean;
  setShowAddTriggerDrawer: (value: boolean) => void;
  selectedTriggerAt: string | undefined;
  allData: any;
  integrations: any;
}) => {
  const childrenOptions =
    selectedNode?.children?.map((cId: any) => {
      const c = allData.checkpoints.find((chk: any) => chk.id === cId);
      return {
        value: cId,
        label: <>{c?.title}</>,
      };
    }) || [];
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>();
  const selectedIntegration = integrations?.find(
    (integration: any) => integration.id === selectedIntegrationId
  );
  const AddElement = getEnforcer(selectedIntegration?.provider || '').Add;
  const options =
    integrations?.map((integration: IWeb2Integration) => {
      return {
        id: integration.id,
        label:
          integration.username !== ' '
            ? `${integration.provider} (${integration.username})`
            : integration.provider,
        value: integration.id,
      };
    }) || [];
  return (
    <Drawer
      open={showAddTriggerDrawer}
      title='Add Trigger'
      onClose={() => {
        setShowAddTriggerDrawer(false);
      }}
    >
      <Space direction='vertical' className='w-full' size='small'>
        <Space direction='vertical' size='small' className='w-full'>
          <span>With</span>
          <Select
            options={childrenOptions}
            value={selectedChild}
            onChange={(v: any) => {
              setSelectedChild(v);
            }}
            defaultValue='Select an action'
            className='w-full'
          />
          <Divider className='my-2' />
          <span>Trigger</span>
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
                const tmpData = structuredClone({
                  ...data,
                  triggerAt: selectedChild,
                  name: data.provider + '-' + triggers.length,
                });
                const tmpSelectedNode = structuredClone(selectedNode);
                onChange({
                  ...tmpSelectedNode,
                  triggers: [...triggers, { ...tmpData }],
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
