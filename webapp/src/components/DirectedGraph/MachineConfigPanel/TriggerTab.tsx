import { IWeb2Integration } from '@types';
import {
  Button, Space,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Paragraph from 'antd/es/typography/Paragraph';
import Twitter from '../Enforcer/Twitter';
import Fake from '../Enforcer/Fake';
import TriggerEmptyStage from './triggers/TriggerEmptyStage';
import NewTriggerDrawer from './triggers/NewTriggerDrawer';

interface ITrigger {
  id: string,
  name: string,
  provider: string,
  integrationId: string,
  params: any,
}

const getProvider = (provider:string) => {
  switch (provider) {
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
        Add: () => (<></>),
        Display: () => (<></>),
      };
  }
};

const TriggerTab = ({
  web2Integrations, triggers, onChange, children, selectedNode, allNodes, editable = false,
}:{
  web2Integrations: IWeb2Integration[],
  triggers: ITrigger[],
  onChange: (data:any) => void,
  children: any[],
  selectedNode: any,
  allNodes: any[],
  editable?: boolean,
}) => {
  const [showAddTriggerDrawer, setShowAddTriggerDrawer] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>();
  const [selectedTriggerAt, setSelectedTriggerAt] = useState<string>();
  const options = web2Integrations?.map((integration:IWeb2Integration) => {
    return {
      id: integration.id,
      label: integration.username !== ' ' ? `${integration.provider} (${integration.username})` : integration.provider,
      value: integration.id,
    };
  });
  const selectedIntegration = web2Integrations?.find(
    (integration) => integration.id === selectedIntegrationId);
  const AddElement = getProvider(selectedIntegration?.provider || '').Add;
  const triggerAtOptions:any = [];
  children?.forEach((childId) => {
    let title = allNodes.find((n) => n.id === childId).title || childId;
    if (title.length > 20) {
      title = `${title.slice(0, 20)}...`;
    }
    triggerAtOptions.push({
      id: childId,
      label: `'${title}' is choosen`,
      value: childId,
    });
  });
  return (
    <Space direction="vertical" className="w-full" size="large">
      {!triggers || triggers.length === 0 ? (
        <TriggerEmptyStage
          onClick={() => {
            setShowAddTriggerDrawer(true);
          }}
          editable={editable}
        />
      )
      :
      (
        <>
          <Space direction="vertical" size="middle" className="w-full">
            {
              triggers.map(
                (trigger:ITrigger, index: number) => {
                  const display = getProvider(trigger.provider).Display;
                  return (
                    <Space
                      direction="vertical"
                      size="small"
                      className="rounded-md border-2 p-4 w-full"
                      key={trigger.id || Math.random()}
                    >
                      <Space direction="horizontal" className="w-full flex justify-between">
                        <Paragraph
                          style={{ marginBottom: '0px' }}
                          className="text-lg font-semibold flex items-center"
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
                          className="text-red-500"
                          onClick={() => {
                            const tmpSelectedNode = structuredClone(selectedNode);
                            const tmpTriggers = [...triggers];
                            tmpTriggers.splice(index, 1);
                            onChange({
                              ...tmpSelectedNode,
                              triggers: tmpTriggers,
                            });
                          }}
                          disabled={!editable}
                        />
                      </Space>
                      {display({
                        data: {
                          ...trigger, allNodes,
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
                    </Space>
                  );
                },
            )}
          </Space>
          <Button
            type="default"
            className="w-full"
            onClick={() => {
              setShowAddTriggerDrawer(true);
            }}
            disabled={!editable}
          >
            Add Trigger
          </Button>
        </>
      )
      }
      <NewTriggerDrawer
        selectedNode={selectedNode}
        triggers={triggers}
        onChange={onChange}
        options={options}
        AddElement={AddElement}
        selectedIntegrationId={selectedIntegrationId}
        setSelectedIntegrationId={setSelectedIntegrationId}
        showAddTriggerDrawer={showAddTriggerDrawer}
        setShowAddTriggerDrawer={setShowAddTriggerDrawer}
        selectedIntegration={selectedIntegration}
        setSelectedTriggerAt={setSelectedTriggerAt}
        selectedTriggerAt={selectedTriggerAt}
        triggerAtOptions={triggerAtOptions}
      />
    </Space>
  );
};

export default TriggerTab;
