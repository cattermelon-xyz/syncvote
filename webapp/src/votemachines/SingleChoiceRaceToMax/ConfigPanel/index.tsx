import { Tag, Space, Switch, Button, Divider, Alert, Input } from 'antd';
import { useState } from 'react';
import {
  GraphViewMode,
  ICheckPoint,
  IVoteMachineConfigProps,
} from '../../../types';
import { Option } from './option';
import VotingResult from './VotingResult';
import VotingCondition from './VotingCondition';
import NewOptionDrawer from './NewOptionDrawer';
import { PlusOutlined } from '@ant-design/icons';
import '../styles.scss';
import CollapsiblePanel from '@components/DirectedGraph/MachineConfigPanel/fragments/CollapsiblePanel';
import { IOption, DelayUnit } from '../interface';

/**
 *
 * @param IVoteMachineConfigProps
 * note: editable === true -> then locked item is disabled too
 * @returns ConfigPanel:JSX.Element
 */
const ConfigPanel = ({
  currentNodeId = '',
  votingPowerProvider = '',
  whitelist = [], //eslint-disable-line
  data = {
    max: 0,
    token: '', // spl token
    options: [],
    delayUnits: [], // 1 byte (8) to decide the unit (minute, hour, day, week, month, year)
    delays: [], // 2 bytes (65,536) for the actual value
    delayNotes: [], // do not comit this data to blockchain
    includedAbstain: false,
  },
  viewMode,
  onChange = (data: ICheckPoint) => {},
  children = [],
  allNodes = [], //eslint-disable-line
}: IVoteMachineConfigProps) => {
  const { max, token, options, includedAbstain } = data;
  const delays = data.delays || Array(options?.length).fill(0);
  const delayUnits =
    data.delayUnits || Array(options?.length).fill(DelayUnit.MINUTE);
  const delayNotes = data.delayNotes || Array(options?.length).fill('');
  let tmpMaxStr = '0';
  if (max) {
    tmpMaxStr = max < 1 ? `${max * 100}%` : `${max}`;
  }
  const [maxStr, setMaxStr] = useState(tmpMaxStr);
  const posibleOptions: ICheckPoint[] = [];
  const [showAddOptionDrawer, setShowNewOptionDrawer] = useState(false);
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });
  const [newOption, setNewOption] = useState<IOption>({
    id: '',
    title: '',
    delay: 0,
    delayUnit: DelayUnit.MINUTE,
    delayNote: '',
  });
  const [countedBy, setCountedBy] = useState(token ? 'token' : 'count');
  const addNewOptionHandler = (newOptionData: any) => {
    if (newOptionData.id && newOptionData.title) {
      const opts = options ? [...options] : [];
      const chds = children ? [...children] : [];
      onChange({
        data: {
          options: [...opts, newOptionData.title],
          delays: [...delays, newOptionData.delay],
          delayUnits: [...delayUnits, newOptionData.delayUnit],
          delayNotes: [...delayNotes, newOptionData.delayNote],
        },
        children: [...chds, newOptionData.id],
      });
    }
  };
  const deleteOptionHandler = (index: number) => {
    onChange({
      data: {
        options: [...options.slice(0, index), ...options.slice(index + 1)],
        delays: [...delays.slice(0, index), ...delays.slice(index + 1)],
        delayUnits: [
          ...delayUnits.slice(0, index),
          ...delayUnits.slice(index + 1),
        ],
        delayNotes: [
          ...delayNotes.slice(0, index),
          ...delayNotes.slice(index + 1),
        ],
      },
      children: [...children.slice(0, index), ...children.slice(index + 1)],
    });
  };
  const changeOptionHandler = (value: any, index: number) => {
    const newData = { ...data };
    const newOptions = [...options];
    const newDelays = [...delays];
    const newDelayUnits = [...delayUnits];
    const newDelayNotes = [...delayNotes];
    newOptions[index] = value.id;
    newDelays[index] = value.delay;
    newDelayUnits[index] = value.delayUnit;
    newDelayNotes[index] = value.delayNote;
    onChange({
      data: {
        ...newData,
        options: newOptions,
        delays: newDelays,
        delayUnits: newDelayUnits,
        delayNotes: newDelayNotes,
      },
    });
  };
  const changeMaxHandler = (e: any) => {
    const str = e.target.value;
    let tMax = 0;
    if (str !== '') {
      tMax = str.indexOf('%') > 0 ? parseFloat(str) / 100 : parseInt(str, 10);
    }
    if (tMax > 1) {
      setMaxStr(tMax.toString());
    }
    onChange({
      data: {
        ...data,
        max: tMax,
      },
    });
  };
  const changeTokenHandler = (e: any) => {
    onChange({
      data: {
        ...data,
        token: e.target.value,
      },
    });
  };
  const changeAbstainHandler = (value: boolean) => {
    onChange({
      data: {
        ...data,
        includedAbstain: value,
      },
    });
  };
  const replaceOption = (newOptionData: any, oldIndex: number) => {
    if (newOptionData.id && newOptionData.title) {
      const newData = {
        options: [
          ...options.slice(0, oldIndex),
          ...options.slice(oldIndex + 1),
        ],
        delays: [...delays.slice(0, oldIndex), ...delays.slice(oldIndex + 1)],
        delayUnits: [
          ...delayUnits.slice(0, oldIndex),
          ...delayUnits.slice(oldIndex + 1),
        ],
        delayNotes: [
          ...delayNotes.slice(0, oldIndex),
          ...delayNotes.slice(oldIndex + 1),
        ],
      };
      const newChildren = [
        ...children.slice(0, oldIndex),
        ...children.slice(oldIndex + 1),
      ];
      const opts = options ? [...newData.options] : [];
      const dlys = delays ? [...newData.delays] : [];
      const dlUys = delayUnits ? [...newData.delayUnits] : [];
      const dlNts = delayNotes ? [...newData.delayNotes] : [];
      const chds = children ? [...newChildren] : [];
      onChange({
        data: {
          options: [...opts, newOptionData.title],
          delays: [...dlys, newOptionData.delay],
          delayUnits: [...dlUys, newOptionData.delayUnit],
          delayNotes: [...dlNts, newOptionData.delayNote],
        },
        children: [...chds, newOptionData.id],
      });
    }
  };
  const getThresholdText = () => {
    let rs = '';
    if (countedBy === 'count') {
      // vote counting
      if (max > 1) {
        // number of vote
        rs = 'Total votes made';
      } else {
        rs = 'Percentage of votes made';
      }
    } else if (countedBy === 'token') {
      // token counting
      if (max > 1) {
        // number of vote
        rs = 'Total token voted';
      } else {
        rs = 'Percentage of voted token';
      }
    }
    return rs;
  };
  const getMaxText = () => {
    let rs = <span>condition to pass</span>;
    const tokenEle = token ? (
      <Tag>{token}</Tag>
    ) : (
      <Tag color='red'>Missing token</Tag>
    );
    if (max || Number.isNaN(max)) {
      if (max < 1) {
        if (countedBy === 'count') {
          rs = <span>{`${max * 100}% of votes`}</span>;
        } else if (countedBy === 'token') {
          rs = (
            <span>
              <span className='mr-1'>
                {`${max * 100}% of total voted tokens`}
              </span>
              {tokenEle}
            </span>
          );
        }
      } else if (max >= 1) {
        if (countedBy === 'count') {
          rs = <span>{`${max} votes`}</span>;
        } else if (countedBy === 'token') {
          rs = (
            <span>
              <span className='mr-1'>{`${max} tokens`}</span>
              {tokenEle}
            </span>
          );
        }
      }
    }
    return rs;
  };
  return (
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
                <Option
                  key={option}
                  index={index}
                  option={option}
                  currentNode={currentNode}
                  changeOptionHandler={changeOptionHandler}
                  deleteOptionHandler={deleteOptionHandler}
                  possibleOptions={posibleOptions}
                  editable={
                    viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ||
                    viewMode === GraphViewMode.EDIT_MISSION
                  }
                  replaceOption={replaceOption}
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
            className='w-full flex items-center justify-start pl-0'
            onClick={() => setShowNewOptionDrawer(true)}
            disabled={
              !(
                viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ||
                viewMode === GraphViewMode.EDIT_MISSION
              )
            }
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
        </>
      </CollapsiblePanel>
      <CollapsiblePanel title='Result calculation'>
        <>
          <VotingResult countedBy={countedBy} setCountedBy={setCountedBy} />
          <VotingCondition
            getThresholdText={getThresholdText}
            maxStr={maxStr}
            editable={
              viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ||
              viewMode === GraphViewMode.EDIT_MISSION
            }
            setMaxStr={setMaxStr}
            changeMaxHandler={changeMaxHandler}
            countedBy={countedBy}
            token={token}
            changeTokenHandler={changeTokenHandler}
          />
        </>
      </CollapsiblePanel>
    </Space>
  );
};

export default ConfigPanel;
