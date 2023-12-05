import { Space, Switch, Button, Alert, Input, Popover, Select } from 'antd';
import { useState } from 'react';
import { ICheckPoint, IVoteMachineConfigProps } from 'directed-graph';
import {
  DelayUnit,
  NavConfigPanel,
  INavPanelNode,
  CollapsiblePanel,
  SideNote,
} from 'directed-graph';
import NewOptionDrawer from './NewOptionDrawer';
import { PlusOutlined } from '@ant-design/icons';
import '../styles.scss';
import { Snapshot as Interface } from '../interface';
import { MdHelpOutline } from 'react-icons/md';

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
    votingPowerProvider = '',
    whitelist = [], //eslint-disable-line
    data = {
      max: 0,
      token: '', // spl token
      options: [],
      space: '',
      type: {
        label: 'Single Choice',
        value: 'single-choice',
      },
    },
    onChange = (data: ICheckPoint) => {},
    children = [],
    allNodes = [], //eslint-disable-line
    includedAbstain,
    optionsDescription,
  } = props;

  const { max, token, options } = data;
  const delays = props.delays || Array(options?.length).fill(0);
  const delayUnits =
    props.delayUnits || Array(options?.length).fill(DelayUnit.MINUTE);
  const delayNotes = props.delayNotes || Array(options?.length).fill('');
  const posibleOptions: ICheckPoint[] = [];
  const [showAddOptionDrawer, setShowNewOptionDrawer] = useState(false);
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });
  const [newOption, setNewOption] = useState<Interface.IOption>({
    id: '',
    title: '',
    delay: 0,
    delayUnit: DelayUnit.MINUTE,
    delayNote: '',
  });
  const addNewOptionHandler = (newOptionData: any) => {
    if (newOptionData.id && newOptionData.title) {
      const opts = options ? [...options] : [];
      const chds = children ? [...children] : [];
      onChange({
        data: {
          options: [...opts, newOptionData.title],
        },
        children: [...chds, newOptionData.id],
        delays: [...delays, newOptionData.delay],
        delayUnits: [...delayUnits, newOptionData.delayUnit],
        delayNotes: [...delayNotes, newOptionData.delayNote],
      });
    }
  };
  const deleteOptionHandler = (index: number) => {
    onChange({
      data: {
        options: [...options.slice(0, index), ...options.slice(index + 1)],
      },
      children: [...children.slice(0, index), ...children.slice(index + 1)],
      delays: [...delays.slice(0, index), ...delays.slice(index + 1)],
      delayUnits: [
        ...delayUnits.slice(0, index),
        ...delayUnits.slice(index + 1),
      ],
      delayNotes: [
        ...delayNotes.slice(0, index),
        ...delayNotes.slice(index + 1),
      ],
    });
  };
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
  const changeOptionLabel = (value: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ data: { ...data, options: structuredClone(newOptions) } });
  };
  const changeAbstainHandler = (value: boolean) => {
    onChange({
      includedAbstain: value,
    });
  };
  const replaceOption = (
    newOptionData: { id: string; title: string },
    index: number
  ) => {
    if (newOptionData.id && newOptionData.title) {
      const newOptions = options
        ? [
            ...options.slice(0, index),
            newOptionData.title,
            ...options.slice(index + 1),
          ]
        : [];
      const newChildren = children
        ? [
            ...children.slice(0, index),
            newOptionData.id,
            ...children.slice(index + 1),
          ]
        : [];
      onChange({
        data: {
          options: structuredClone(newOptions),
        },
        children: structuredClone(newChildren),
      });
    }
  };
  const selectOptions = [
    {
      label: 'Single Choice',
      value: 'single-choice',
    },
    {
      label: 'Approval',
      value: 'approval',
    },
    {
      label: 'Quadratic',
      value: 'quadratic',
    },
    {
      label: 'Ranked Choice',
      value: 'ranked-choice',
    },
    {
      label: 'Weighted',
      value: 'weighted',
    },
    {
      label: 'Basic',
      value: 'basic',
    },
  ];

  return (
    <>
      <Space direction='vertical' size='large' className='w-full single-choice'>
        {/* <Space direction="vertical" size="small" className="w-full">
      <div className="bg-slate-100 p-2 w-full">
        <span className="mr-0.5">Everyone choose ONE option until one option reach</span>
        {getMaxText()}
      </div>
    </Space> */}
        <CollapsiblePanel title='Options & navigation'>
          <>
            <Space
              direction='horizontal'
              size='small'
              className='w-full flex items-center justify-between bg-zinc-100 px-4 py-2 rounded-lg'
            >
              <span>Enable abstain options</span>
              <Space direction='horizontal' size='small'>
                Yes
                <Switch
                  checked={includedAbstain}
                  onChange={changeAbstainHandler}
                />
              </Space>
            </Space>
            <hr className='my-2' />
            <Alert
              type='success'
              message='Set up logic for your workflow'
              description='If option X wins then workflow will navigage to Y checkpoint'
              closable
            />
            <Space direction='vertical' size='small' className='w-full'>
              {options?.map((option: string, index: number) => {
                const currentNode = allNodes.find(
                  (node) => node.id === children[index]
                );
                return (
                  <NavConfigPanel
                    title={`Option ${index + 1}`}
                    key={option}
                    index={index}
                    navLabel={option}
                    currentNode={currentNode as INavPanelNode}
                    changeDelayHandler={changeOptionDelay}
                    changeLabelHandler={changeOptionLabel}
                    deleteHandler={deleteOptionHandler}
                    possibleNodes={posibleOptions as INavPanelNode[]}
                    replaceHandler={replaceOption}
                    delay={delays[index] || 0}
                    delayUnit={delayUnits[index] || 0}
                    delayNote={delayNotes[index] || ''}
                  />
                );
              })}
              {includedAbstain ? (
                <Space
                  direction='vertical'
                  className='w-full flex justify-between'
                >
                  <span className='text-gray-400'>
                    Option {options?.length + 1}
                  </span>
                  <Input className='w-full' value='Abstain' disabled />
                </Space>
              ) : null}
            </Space>
            <Button
              type='link'
              icon={<PlusOutlined />}
              className='w-full flex items-center justify-start pl-0 my-2'
              onClick={() => setShowNewOptionDrawer(true)}
            >
              Add a new option & navigation
            </Button>
            <NewOptionDrawer
              showAddOptionDrawer={showAddOptionDrawer}
              setShowNewOptionDrawer={setShowNewOptionDrawer}
              newOption={newOption}
              setNewOption={setNewOption}
              posibleOptions={posibleOptions}
              addNewOptionHandler={addNewOptionHandler}
            />
            <SideNote
              value={optionsDescription}
              setValue={(val: string) => {
                onChange({
                  optionsDescription: val,
                });
              }}
            />
          </>
        </CollapsiblePanel>
        <CollapsiblePanel title='Snapshot Info'>
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
                value={data?.type?.label}
                className='w-full'
                options={selectOptions}
                onChange={(value, option) => {
                  onChange({
                    data: {
                      ...data,
                      type: option,
                    },
                  });
                }}
              />
            </Space>
          </Space>
        </CollapsiblePanel>
      </Space>
    </>
  );
};
