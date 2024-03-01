import { GraphViewMode } from '../interface';
import { IWeb2Integration } from '../interface';
import { Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import Paragraph from 'antd/es/typography/Paragraph';

import TriggerEmptyStage from './triggers/TriggerEmptyStage';
import NewTriggerDrawer from './triggers/NewTriggerDrawer';
import { GraphPanelContext } from '../context';

interface ITrigger {
  id: string;
  name: string;
  provider: string;
  integrationId: string;
  params: any;
}

import Twitter from '../Enforcer/Twitter';
import Fake from '../Enforcer/Fake';
import { CollapsiblePanel } from '../../..';

const getEnforcer = (enforcer: string) => {
  switch (enforcer) {
    case Twitter.getName():
      return {
        Add: Twitter.Add,
        Display: Twitter.Display,
      };
    case Fake.getName():
      return {
        Add: Fake.Add,
        Display: Fake.Display,
      };
    default:
      return {
        Add: () => <></>,
        Display: () => <></>,
      };
  }
};

const TriggerTab = () => {
  const { data, selectedNodeId, web2Integrations, viewMode, onChange } =
    useContext(GraphPanelContext);
  const selectedNode = data.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const children = selectedNode?.children || [];
  const triggers = selectedNode?.triggers || [];
  const allNodes = data.checkpoints || [];
  const [showAddTriggerDrawer, setShowAddTriggerDrawer] = useState(false);
  const [selectedTriggerAt, setSelectedTriggerAt] = useState<string>();

  return (
    <Space direction='vertical' className='w-full' size='large'>
      {!triggers || triggers.length === 0 ? (
        <TriggerEmptyStage
          onClick={() => {
            setShowAddTriggerDrawer(true);
          }}
          editable={
            viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ||
            viewMode === GraphViewMode.EDIT_MISSION ||
            false
          }
        />
      ) : (
        <>
          <Space direction='vertical' size='middle' className='w-full'>
            {triggers.map((trigger: ITrigger, index: number) => {
              const display = getEnforcer(trigger.provider).Display;
              return (
                <CollapsiblePanel
                  key={Math.random()}
                  open={false}
                  className='py-1 px-2 bg-white rounded-md'
                  title={
                    <Space
                      direction='vertical'
                      size='small'
                      className='rounded-md border-2 w-full'
                      key={Math.random()}
                    >
                      <Space direction='horizontal' className='w-full flex'>
                        <Paragraph
                          style={{ marginBottom: '0px' }}
                          className='text-lg font-semibold flex items-center'
                          editable={{
                            onChange: (name) => {
                              const newTriggers = [...triggers];
                              newTriggers[index].name = name;
                              onChange({
                                ...selectedNode,
                                triggers: newTriggers,
                              });
                            },
                          }}
                        >
                          {trigger.name}
                        </Paragraph>
                        <Button
                          icon={<DeleteOutlined />}
                          className='text-red-500'
                          onClick={() => {
                            const tmpSelectedNode =
                              structuredClone(selectedNode);
                            const tmpTriggers = [...triggers];
                            tmpTriggers.splice(index, 1);
                            onChange({
                              ...tmpSelectedNode,
                              triggers: tmpTriggers,
                            });
                          }}
                          disabled={
                            !(
                              viewMode === GraphViewMode.EDIT_MISSION ||
                              viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION
                            )
                          }
                        />
                      </Space>
                    </Space>
                  }
                >
                  {display({
                    data: {
                      ...trigger,
                      allNodes,
                    },
                    onChange: (data) => {
                      const newTriggers = [...triggers];
                      newTriggers[index] = data;
                      onChange({
                        ...selectedNode,
                        triggers: newTriggers,
                      });
                    },
                  })}
                </CollapsiblePanel>
              );
            })}
          </Space>
          <Button
            type='default'
            className='w-full'
            onClick={() => {
              setShowAddTriggerDrawer(true);
            }}
            disabled={
              !(
                viewMode === GraphViewMode.EDIT_MISSION ||
                viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION
              )
            }
          >
            Add Trigger
          </Button>
        </>
      )}
      <NewTriggerDrawer
        selectedNode={selectedNode}
        triggers={triggers}
        onChange={onChange}
        getEnforcer={getEnforcer}
        showAddTriggerDrawer={showAddTriggerDrawer}
        setShowAddTriggerDrawer={setShowAddTriggerDrawer}
        selectedTriggerAt={selectedTriggerAt}
        allData={data}
        integrations={web2Integrations}
      />
    </Space>
  );
};

export default TriggerTab;
