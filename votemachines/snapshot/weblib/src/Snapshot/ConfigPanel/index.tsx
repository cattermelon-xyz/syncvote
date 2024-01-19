import { Space, Switch, Button, Alert, Input, Popover, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import {
  GraphContext,
  ICheckPoint,
  IVoteMachineConfigProps,
} from 'directed-graph';
import {
  NavConfigPanel,
  INavPanelNode,
  CollapsiblePanel,
  SideNote,
} from 'directed-graph';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles.scss';
import { MdHelpOutline } from 'react-icons/md';
import moment from 'moment';
import { TextEditor } from 'rich-text-editor';

/**
 *
 * @param IVoteMachineConfigProps
 * note: editable === true -> then locked item is disabled too
 * @returns ConfigPanel:JSX.Element
 */
export default (props: IVoteMachineConfigProps) => {
  // delayUnits: [], // 1 byte (8) to decide the unit (minute, hour, day, week, month, year)
  // delays: [], // 2 bytes (65,536) for the actual value
  // delayNotes: [], // do not comit this data to blockchain
  // includedAbstain: false,
  // resultDescription: '',
  // quorum: 0,
  // optionsDescription: '',
  const {
    currentNodeId = '',
    data = {
      options: [],
      snapShotOption: [],
      space: '',
      type: 'single-choice',
      next: '',
      fallback: '',
      action: 'create-proposal',
      proposalId: '',
      snapshotDuration: 0,
      template: '',
      snapshotIdToSync: '',
    },
    onChange = (data: ICheckPoint) => {},
    children = [],
    allNodes = [], //eslint-disable-line
    optionsDescription,
  } = props;

  const {
    fallback,
    next,
    action,
    snapShotOption,
    snapshotDuration,
    snapshotIdToSync,
  } = data;
  const delays = props.delays || Array(2).fill(0);

  // Duration snapshot
  const days = snapshotDuration ? Math.floor(snapshotDuration / 86400) : 0;
  const hours = snapshotDuration
    ? Math.floor((snapshotDuration - days * 86400) / 3600)
    : 0;
  const mins = snapshotDuration
    ? Math.floor((snapshotDuration - days * 86400 - hours * 3600) / 60)
    : 0;
  const delayUnits = props.delayUnits || Array(2).fill(0);
  const delayNotes = props.delayNotes || Array(2).fill('');

  const posibleOptions: ICheckPoint[] = [];
  const actions = [
    { label: 'Create Proposal', value: 'create-proposal' },
    { label: 'Sync Proposal Result', value: 'sync-proposal' },
  ];

  const fallbackNode = allNodes.find((n) => n.id === fallback);
  const nextNode = allNodes.find((n) => n.id === next);
  const posibleNodes = [
    ...allNodes.filter(
      (n) => [fallback, next, currentNodeId].indexOf(n.id) === -1
    ),
  ];
  const snapshotNodes = allNodes.filter(
    (n) =>
      n.vote_machine_type === 'Snapshot' && n?.data.action === 'create-proposal'
  );

  const snapshotParents: any[] = [];

  for (let i = 0; i < snapshotNodes.length; i++) {
    const checkpointSnapshot = { ...snapshotNodes[i] };
    checkpointSnapshot.label = checkpointSnapshot.title;
    checkpointSnapshot.value = checkpointSnapshot.id;
    snapshotParents.push(checkpointSnapshot);
    console.log(snapshotParents);
  }

  const changeDelayHandler = (val: any, childIdx: number) => {
    const { delay, delayUnit, delayNote } = val;
    delays[childIdx] = delay;
    delayUnits[childIdx] = delayUnit;
    delayNotes[childIdx] = delayNote;
    onChange({
      delays: structuredClone(delays),
      delayUnits: structuredClone(delayUnits),
      delayNotes: structuredClone(delayNotes),
    });
  };

  const replaceHandler = (val: any, childIdx: number) => {
    const { id } = val;
    const newChildren = [...children];
    if (childIdx === -1) {
      newChildren.push(id);
    } else {
      newChildren[childIdx] = id;
    }
    return newChildren;
  };

  // fallback and next
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });

  const selectOptions = [
    {
      label: 'Single Choice',
      value: 'single-choice',
    },
    // {
    //   label: 'Approval',
    //   value: 'approval',
    // },
    // {
    //   label: 'Quadratic',
    //   value: 'quadratic',
    // },
    // {
    //   label: 'Ranked Choice',
    //   value: 'ranked-choice',
    // },
    // {
    //   label: 'Weighted',
    //   value: 'weighted',
    // },
    // {
    //   label: 'Basic',
    //   value: 'basic',
    // },
  ];

  const addNewOptionHandlerSnapshot = (newOptionData: any) => {
    if (newOptionData) {
      const opts = snapShotOption ? [...snapShotOption] : [];
      onChange({
        data: {
          ...data,
          snapShotOption: [...opts, newOptionData],
        },
      });

      setInputValue('');
    }
  };

  const [inputValue, setInputValue] = useState('');
  const { data: graphData } = useContext(GraphContext);
  const variablesMission = graphData?.variables;
  const [variablesOption, setVariablesOption] =
    useState<{ label: string; value: string }[]>();

  const changeOptionDelay = (value: any, index: number) => {
    const newDelays = [...delays];
    const newDelayUnits = [...delayUnits];
    const newDelayNotes = [...delayNotes];
    newDelays[index] = value.delay;
    newDelayUnits[index] = value.delayUnit;
    newDelayNotes[index] = value.delayNote;
    onChange({
      delays: structuredClone(newDelays),
      delayUnits: structuredClone(newDelayUnits),
      delayNotes: structuredClone(newDelayNotes),
    });
  };

  useEffect(() => {
    if (variablesMission) {
      const optionsData = variablesMission?.map((variables: string) => {
        return {
          label: variables,
          value: variables,
        };
      });
      setVariablesOption(optionsData);
    }
  }, [variablesMission]);

  return (
    <>
      <Space direction='vertical' size='large' className='w-full single-choice'>
        <CollapsiblePanel title='Action Type'>
          <Space direction='vertical' size='small' className='w-full'>
            <Select
              value={action}
              className='w-full'
              options={actions}
              onChange={(value, option) => {
                onChange({
                  data: {
                    ...data,
                    action: value,
                  },
                });
              }}
            />
          </Space>
        </CollapsiblePanel>

        <CollapsiblePanel title='Navigation'>
          {action === 'create-proposal' ? (
            <>
              <Alert
                type='success'
                message={
                  <>
                    <p>
                      There are only 2 options "Pass" or "Fail" for user to
                      choose.
                    </p>
                    {/* <p>Note that "Abstain" choices are included in "Quorum"</p> */}
                  </>
                }
              />
              <Space direction='vertical' size='middle' className='w-full mt-4'>
                <NavConfigPanel
                  title='Pass'
                  currentNode={nextNode}
                  possibleNodes={posibleNodes}
                  index={children.indexOf(next || '')}
                  navLabel='Total votes pass Quorum and Vetos fail Threshold'
                  delay={nextNode ? delays[children.indexOf(next || '')] : 0}
                  delayUnit={
                    nextNode ? delayUnits[children.indexOf(next || '')] : 0
                  }
                  delayNote={
                    nextNode ? delayNotes[children.indexOf(next || '')] : 0
                  }
                  changeDelayHandler={changeDelayHandler}
                  replaceHandler={(val: any, idx: number) => {
                    onChange({
                      children: replaceHandler(val, idx),
                      data: { ...data, next: val.id },
                    });
                  }}
                />
                <NavConfigPanel
                  title='Fail'
                  currentNode={fallbackNode}
                  possibleNodes={posibleNodes}
                  index={children.indexOf(fallback || '')}
                  navLabel='Total votes fail Quorum and/or Vetos pass Threshold'
                  delay={
                    fallbackNode ? delays[children.indexOf(fallback || '')] : 0
                  }
                  delayUnit={
                    fallbackNode
                      ? delayUnits[children.indexOf(fallback || '')]
                      : 0
                  }
                  delayNote={
                    fallbackNode
                      ? delayNotes[children.indexOf(fallback || '')]
                      : 0
                  }
                  changeDelayHandler={changeDelayHandler}
                  replaceHandler={(val: any, idx: number) => {
                    onChange({
                      children: replaceHandler(val, idx),
                      data: { ...data, fallback: val.id },
                    });
                  }}
                />
                <SideNote
                  value={optionsDescription}
                  setValue={(val: string) => {
                    onChange({
                      optionsDescription: val,
                    });
                  }}
                />
              </Space>
            </>
          ) : (
            <>
              <Alert
                type='success'
                message={
                  <>
                    <p>
                      There are many options base on Checkpoint Snapshot Parent.
                    </p>
                  </>
                }
              />
              {snapShotOption &&
                snapShotOption.map((option: any, index: any) => {
                  const currentNode = allNodes.find(
                    (node) => node.id === children[index]
                  );
                  return (
                    <>
                      <NavConfigPanel
                        title={`Option ${index}`}
                        key={option}
                        index={index}
                        navLabel={option}
                        currentNode={currentNode as INavPanelNode}
                        changeDelayHandler={changeOptionDelay}
                        replaceHandler={(val: any, idx: number) => {
                          onChange({
                            children: replaceHandler(val, idx),
                            data: { ...data, next: val.id },
                          });
                        }}
                        possibleNodes={posibleOptions as INavPanelNode[]}
                        delay={delays[index] || 0}
                        delayUnit={delayUnits[index] || 0}
                        delayNote={delayNotes[index] || ''}
                      />
                    </>
                  );
                })}
            </>
          )}
        </CollapsiblePanel>

        <CollapsiblePanel title='Snapshot Info'>
          {action === 'create-proposal' ? (
            <Space direction='vertical' size='small' className='w-full'>
              <Space direction='vertical' size='small' className='w-full'>
                <div className='text-sm text-slate-600 flex items-center gap-2'>
                  Space
                  <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                    <MdHelpOutline />
                  </Popover>
                </div>
                <Input
                  className='w-full'
                  placeholder='hectagon.eth'
                  value={data.space}
                  onChange={(e: any) => {
                    onChange({
                      data: {
                        ...data,
                        space: e.target.value,
                      },
                    });
                  }}
                />
              </Space>
              <Space direction='vertical' size='small' className='w-full'>
                <div className='text-sm text-slate-600 flex items-center gap-2'>
                  Votemachine type
                  <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                    <MdHelpOutline />
                  </Popover>
                </div>
                <Select
                  value={data?.type}
                  className='w-full'
                  options={selectOptions}
                  onChange={(value, option) => {
                    onChange({
                      data: {
                        ...data,
                        type: value,
                      },
                    });
                  }}
                />
              </Space>
              <Space direction='vertical'>
                <div className='text-sm text-slate-600 flex items-center gap-2'>
                  Template
                </div>
                <TextEditor
                  value={data?.template || ''}
                  setValue={(val: any) => {
                    onChange({
                      data: {
                        ...data,
                        template: val,
                      },
                    });
                  }}
                />
              </Space>
              <Space direction='vertical'>
                <div>
                  {snapshotDuration ? (
                    <>
                      apprx.{' '}
                      {moment.duration(snapshotDuration, 'seconds').humanize()}
                    </>
                  ) : (
                    <span className='text-red-500'>Duration is missing</span>
                  )}
                </div>
                <Space
                  direction='horizontal'
                  className='w-full flex justify-between'
                >
                  <Input
                    addonAfter='Days'
                    value={days}
                    placeholder='Day'
                    className='text-center'
                    onChange={(e) => {
                      onChange({
                        data: {
                          ...data,
                          snapshotDuration:
                            parseInt(e.target.value || '0', 10) * 86400 +
                            hours * 3600 +
                            mins * 60,
                        },
                      });
                    }}
                    // disabled={locked.duration}
                  />
                  <Input
                    value={hours}
                    addonAfter='Hour'
                    placeholder='Hour'
                    className='text-center'
                    onChange={(e) => {
                      onChange({
                        data: {
                          ...data,
                          snapshotDuration:
                            days * 86400 +
                            parseInt(e.target.value || '0', 10) * 3600 +
                            mins * 60,
                        },
                      });
                    }}
                    // disabled={locked.duration}
                  />
                  <Input
                    value={mins}
                    addonAfter='Minute'
                    placeholder='Minute'
                    className='text-center'
                    onChange={(e) => {
                      onChange({
                        data: {
                          ...data,
                          snapshotDuration:
                            days * 86400 +
                            hours * 3600 +
                            parseInt(e.target.value || '0', 10) * 60,
                        },
                      });
                    }}
                    // disabled={locked.duration}
                  />
                </Space>
              </Space>

              <Space direction='vertical' size='small' className='w-full'>
                <div className='text-sm text-slate-600 flex items-center gap-2'>
                  Proposal ID
                  <Popover content='Choose variable to store proposal Id of Snapshot'>
                    <MdHelpOutline />
                  </Popover>
                </div>
                <Select
                  value={data?.proposalId}
                  className='w-full'
                  options={variablesOption}
                  onChange={(value, option) => {
                    onChange({
                      data: {
                        ...data,
                        proposalId: value,
                      },
                    });
                  }}
                />
              </Space>
              <Space direction='vertical' size='small' className='w-full'>
                <div className='text-sm text-slate-600 flex items-center gap-2'>
                  Options
                  <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                    <MdHelpOutline />
                  </Popover>
                </div>
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  suffix={
                    <Button
                      type='link'
                      icon={<PlusOutlined />}
                      className='w-full flex items-center justify-start pl-0'
                      onClick={() => {
                        addNewOptionHandlerSnapshot(inputValue);
                      }}
                    >
                      Add a new option
                    </Button>
                  }
                />
                <Space direction='vertical' size='small' className='w-full'>
                  {snapShotOption &&
                    snapShotOption.map((option: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className='flex items-center justify-between w-full'
                        >
                          <div className=''>{option}</div>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              console.log(index);
                              const opts = [...snapShotOption];
                              opts.splice(index, 1);
                              onChange({
                                data: {
                                  ...data,
                                  snapShotOption: opts,
                                },
                              });
                            }}
                          ></Button>
                        </div>
                      );
                    })}
                </Space>
              </Space>
            </Space>
          ) : (
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                Checkpoint Snapshot Proposal to Sync
                <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                  <MdHelpOutline />
                </Popover>
              </div>
              <Select
                value={snapshotIdToSync}
                className='w-full'
                options={snapshotParents}
                onChange={(_value, option) => {
                  console.log(option);

                  onChange({
                    data: {
                      ...data,
                      snapshotIdToSync: option.id,
                      space: option?.data?.space,
                      type: option?.data?.type,
                      proposalId: option?.data?.proposalId,
                      snapshotOption: option?.data.snapshotOption,
                    },
                  });
                }}
              />
            </Space>
          )}
        </CollapsiblePanel>
      </Space>
    </>
  );
};
