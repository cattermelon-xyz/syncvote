import {
  Tag, Space, Switch, Button,
} from 'antd';
import { useState } from 'react';
import { ICheckPoint, IVoteMachineConfigProps } from '../../../types';
import { Option } from './option';
import VotingResult from './VotingResult';
import VotingCondition from './VotingCondition';
import NewOptionDrawer from './NewOptionDrawer';

/**
 *
 * @param IVoteMachineConfigProps
 * note: editable === true -> then locked item is disabled too
 * @returns ConfigPanel:JSX.Element
 */
const ConfigPanel = ({
  currentNodeId = '', votingPowerProvider = '', whitelist = [], //eslint-disable-line
  data = {
    max: 0,
    token: '', // spl token
    options: [],
    includedAbstain: false,
  },
  editable,
  onChange = (data:ICheckPoint) => {}, children = [], allNodes = [], //eslint-disable-line
}:IVoteMachineConfigProps) => {
  const {
    max, token, options, includedAbstain,
  } = data;
  let tmpMaxStr = '0';
  if (max) {
    tmpMaxStr = max < 1 ? `${max * 100}%` : `${max}`;
  }
  const [maxStr, setMaxStr] = useState(tmpMaxStr);
  const posibleOptions:ICheckPoint[] = [];
  const [showAddOptionDrawer, setShowNewOptionDrawer] = useState(false);
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });
  const [newOption, setNewOption] = useState({
    id: '', title: '',
  });
  const [countedBy, setCountedBy] = useState(token ? 'token' : 'count');
  const addNewOptionHandler = (newOptionData:any) => {
    if (newOptionData.id && newOptionData.title) {
      const opts = options ? [...options] : [];
      const chds = children ? [...children] : [];
      onChange({
        data: {
          options: [
            ...opts,
            newOptionData.title,
          ],
        },
        children: [
          ...chds,
          newOptionData.id,
        ],
      });
    }
  };
  const deleteOptionHandler = (index:number) => {
    onChange({
      data: {
        options: [
          ...options.slice(0, index),
          ...options.slice(index + 1),
        ],
      },
      children: [
        ...children.slice(0, index),
        ...children.slice(index + 1),
      ],
    });
  };
  const changeOptionHandler = (value:any, index:number) => {
    const newData = { ...data };
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({
      data: {
        ...newData,
        options: newOptions,
      },
    });
  };
  const changeMaxHandler = (e:any) => {
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
  const changeTokenHandler = (e:any) => {
    onChange({
      data: {
        ...data,
        token: e.target.value,
      },
    });
  };
  const changeAbstainHandler = (value:boolean) => {
    onChange({
      data: {
        ...data,
        includedAbstain: value,
      },
    });
  };
  const addAndDeleteOptionHandler = (newOptionData:any, oldIndex:number) => {
    if (newOptionData.id && newOptionData.title) {
      const newData = {
        options: [
          ...options.slice(0, oldIndex),
          ...options.slice(oldIndex + 1),
        ],
      };
      const newChildren = [
        ...children.slice(0, oldIndex),
        ...children.slice(oldIndex + 1),
      ];
      const opts = options ? [...newData.options] : [];
      const chds = children ? [...newChildren] : [];
      onChange({
        data: {
          options: [
            ...opts,
            newOptionData.title,
          ],
        },
        children: [
          ...chds,
          newOptionData.id,
        ],
      });
    }
  };
  const getThresholdText = () => {
    let rs = '';
    if (countedBy === 'count') { // vote counting
      if (max > 1) { // number of vote
        rs = 'Total votes made';
      } else {
        rs = 'Percentage of votes made';
      }
    } else if (countedBy === 'token') { // token counting
      if (max > 1) { // number of vote
        rs = 'Total token voted';
      } else {
        rs = 'Percentage of voted token';
      }
    }
    return rs;
  };
  const getMaxText = () => {
    let rs = <span>condition to pass</span>;
    const tokenEle = token ? <Tag>{token}</Tag> : <Tag color="red">Missing token</Tag>;
    if (max || Number.isNaN(max)) {
      if (max < 1) {
        if (countedBy === 'count') {
          rs = (
            <span>
              {`${max * 100}% of votes`}
            </span>
          );
        } else if (countedBy === 'token') {
          rs = (
            <span>
              <span className="mr-1">
                {`${max * 100}% of total voted tokens`}
              </span>
              {tokenEle}
            </span>
          );
        }
      } else if (max >= 1) {
        if (countedBy === 'count') {
          rs = (
            <span>
              {`${max} votes`}
            </span>
          );
        } else if (countedBy === 'token') {
          rs = (
            <span>
              <span className="mr-1">
                {`${max} tokens`}
              </span>
              {tokenEle}
            </span>
          );
        }
      }
    }
    return rs;
  };
  return (
    <Space direction="vertical" size="large" className="mb-4 w-full">
      <Space direction="vertical" size="small" className="w-full">
        <div className="bg-slate-100 p-2 w-full">
          <span className="mr-0.5">Everyone choose ONE option until one option reach</span>
          {getMaxText()}
        </div>
      </Space>
      <div className="text-lg">Options</div>
      <Space direction="vertical" size="small" className="w-full">
        <Space direction="horizontal" size="small" className="w-full flex items-center justify-between">
          <span>Can user abstain his vote?</span>
          <Switch checked={includedAbstain} onChange={changeAbstainHandler} />
        </Space>
        {options?.map((option:string, index:number) => {
          const currentNode = allNodes.find((node) => node.id === children[index]);
          return (
            <Option
              key={option}
              index={index}
              option={option}
              currentNode={currentNode}
              changeOptionHandler={changeOptionHandler}
              deleteOptionHandler={deleteOptionHandler}
              possibleOptions={posibleOptions}
              editable={editable}
              addAndDeleteOptionHandler={addAndDeleteOptionHandler}
            />
          );
        },
        )}
      </Space>
      <Button
        type="default"
        className="w-full"
        onClick={() => setShowNewOptionDrawer(true)}
        disabled={!editable}
      >
        Add New Option
      </Button>
      <NewOptionDrawer
        showAddOptionDrawer={showAddOptionDrawer}
        setShowNewOptionDrawer={setShowNewOptionDrawer}
        newOption={newOption}
        setNewOption={setNewOption}
        posibleOptions={posibleOptions}
        addNewOptionHandler={addNewOptionHandler}
      />
      <VotingResult countedBy={countedBy} setCountedBy={setCountedBy} />
      <VotingCondition
        getThresholdText={getThresholdText}
        maxStr={maxStr}
        editable={editable}
        setMaxStr={setMaxStr}
        changeMaxHandler={changeMaxHandler}
        countedBy={countedBy}
        token={token}
        changeTokenHandler={changeTokenHandler}
      />
    </Space>
  );
};

export default ConfigPanel;
