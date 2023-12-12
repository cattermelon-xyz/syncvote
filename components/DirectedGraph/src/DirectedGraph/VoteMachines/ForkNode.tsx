import { useState } from 'react';
import { Button, Checkbox, Input, Select, Space } from 'antd';
import {
  CollapsiblePanel,
  ICheckPoint,
  IVoteMachine,
  IVoteMachineConfigProps,
  IWorkflowVersionData,
  shortenString,
} from '../../..';
import {
  VerticalLeftOutlined,
  DisconnectOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const VoteMachine: IVoteMachine = {
  ConfigPanel: (props: IVoteMachineConfigProps) => {
    const currentNode = props.allNodes?.find(
      (a) => a.id === props.currentNodeId
    );
    const children = currentNode?.children ? [...currentNode?.children] : [];
    const joinNodes: any[] = [];
    const connectedJoinNodes: any[] = [];

    const joinedNode = currentNode?.data?.joinNode
      ? props.allNodes?.find((v) => v.id === currentNode?.data?.joinNode)
      : undefined;
    const raw: any = props.raw ? props.raw : {};

    props.allNodes?.forEach((child) => {
      if (child.vote_machine_type === 'joinNode') {
        joinNodes.push({
          value: child.id,
          label: child.title,
        });
      }
      if (child.vote_machine_type === 'forkNode') {
        child.data?.joinNode
          ? connectedJoinNodes.push(child.data.joinNode)
          : null;
      }
    });
    joinNodes.map((joinNode) => {
      if (connectedJoinNodes.includes(joinNode.value)) {
        joinNode.discarded = true;
      }
    });
    const [subWorkflowToAssignId, setSubWorkflowToAssignId] = useState('');
    const startSubWorkflowIds = currentNode?.data?.start
      ? currentNode?.data?.start
      : [];
    const subWorkflows = raw.subWorkflows
      ? raw.subWorkflows.map((s: any) => {
          return {
            value: s.refId,
            title: s.refId,
            startId: s.start,
          };
        })
      : [];
    subWorkflows.filter(
      (sw: any) => startSubWorkflowIds?.indexOf(sw.id) === -1
    );
    const endSubWorkflowIds = currentNode?.data?.end
      ? currentNode?.data?.end
      : [];

    return (
      <CollapsiblePanel title='Parallel Sub-Workflow'>
        {joinedNode ? (
          <>
            <Space className='flex justify-between items-center'>
              <div>Join Node</div>
              <div className='flex gap-2 items-center'>
                <div>{joinedNode.title}</div>
                <Button
                  icon={<DisconnectOutlined />}
                  onClick={() => {
                    props.onChange({
                      data: {
                        ...props.data,
                        joinNode: undefined,
                      },
                    });
                  }}
                />
              </div>
            </Space>
            <Space className='w-full' direction='vertical'>
              <div>
                <div>New sub-workflow</div>
                <div className='flex justify-between gap-2'>
                  <Select
                    options={subWorkflows}
                    value={subWorkflowToAssignId}
                    onChange={(e) => setSubWorkflowToAssignId(e)}
                    className='w-full'
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => {
                      props.onChange({
                        data: {
                          ...props.data,
                          start: [
                            ...(props.data?.start || []),
                            subWorkflowToAssignId,
                          ],
                        },
                        children: [
                          ...children,
                          subWorkflows.find(
                            (s: any) => s.value === subWorkflowToAssignId
                          ).startId,
                        ],
                      });
                      setSubWorkflowToAssignId('');
                    }}
                  />
                </div>
              </div>
              <div>List of sub-workflows</div>
              {startSubWorkflowIds?.map((id: string) => {
                return (
                  <div
                    className='w-full flex justitfy-between items-center'
                    key={id}
                  >
                    <div className='flex gap-2 w-1/2 items-center'>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const sidx = startSubWorkflowIds?.indexOf(id);
                          const eidx = endSubWorkflowIds?.indexOf(id);
                          const start = [...startSubWorkflowIds];
                          const end = [...endSubWorkflowIds];
                          sidx !== -1 ? start.splice(sidx, 1) : null;
                          eidx !== -1 ? end.splice(eidx, 1) : null;
                          props.onChange({
                            data: {
                              ...props.data,
                              start,
                              end,
                            },
                          });
                        }}
                        danger
                      />
                      <div>{id}</div>
                    </div>
                    <div
                      className='flex items-center gap-2'
                      onClick={() => {
                        const idx = endSubWorkflowIds?.indexOf(id);
                        const end = [...endSubWorkflowIds];
                        if (idx !== -1) {
                          end.splice(idx, 1);
                        } else {
                          end.push(id);
                        }
                        props.onChange({
                          data: {
                            ...props.data,
                            end,
                          },
                        });
                      }}
                    >
                      <div>Should wait?</div>
                      {endSubWorkflowIds?.indexOf(id) !== -1 ? (
                        <Checkbox checked />
                      ) : (
                        <Checkbox />
                      )}
                    </div>
                  </div>
                );
              })}
            </Space>
          </>
        ) : (
          <>
            <Space>
              <div>Select a Join Node</div>
              <Select
                className='w-full'
                options={joinNodes.filter((v) => !v.discarded)}
                value={joinedNode?.id}
                onChange={(val) => {
                  props.onChange({
                    data: {
                      ...props.data,
                      joinNode: val,
                    },
                  });
                }}
              ></Select>
            </Space>
          </>
        )}
      </CollapsiblePanel>
    );
  },
  getName: () => {
    return 'Fork Node';
  },
  getProgramAddress: () => {
    return 'forkNode';
  },
  getLabel: () => {
    return <span>trigger</span>;
  },
  getIcon: () => {
    return <VerticalLeftOutlined />;
  },
  getType: () => {
    return 'forkNode';
  },
  deleteChildNode: () => {},
  getInitialData: () => {},
  abstract: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => {
    return (
      <div className='flex flex-col items-center'>
        <VerticalLeftOutlined />
        <div className='text-sm'>
          {shortenString(checkpoint?.title || '', 10)}
        </div>
      </div>
    );
  },
  explain: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => {
    return <div>Show the join node & its sub missions</div>;
  },
  validate: ({ checkpoint }: { checkpoint: ICheckPoint | undefined }) => {
    return { isValid: true, message: [''] };
  },
};

export default VoteMachine;
