import { Space, Switch, Button, Alert, Input, Popover, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ICheckPoint, IVoteMachineConfigProps } from 'directed-graph';
import {
  DelayUnit,
  NavConfigPanel,
  INavPanelNode,
  CollapsiblePanel,
  SideNote,
} from 'directed-graph';
import '../styles.scss';
import { Discourse as Interface } from '../interface';
import { MdHelpOutline } from 'react-icons/md';
import { GraphContext } from 'directed-graph';
import { useContext } from 'react';
const SelectOptions = Interface.SelectOptions;

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
      max: 0,
      token: '', // spl token
      options: [],
      action: '',
      variables: [],
      next: '',
      fallback: '',
      categoryId: '',
    },
    onChange = (data: ICheckPoint) => {},
    children = [],
    allNodes = [], //eslint-disable-line
    optionsDescription,
  } = props;

  const { options, action, variables, next, fallback, categoryId } = data;

  const fallbackNode = allNodes.find((n) => n.id === fallback);
  const nextNode = allNodes.find((n) => n.id === next);
  const possibleNodes: any[] = allNodes.filter(
    (n) => [currentNodeId, fallback, next].indexOf(n.id) === -1
  );

  const { data: graphData } = useContext(GraphContext);
  const variablesMission = graphData?.variables;
  const [variablesOption, setVariablesOption] =
    useState<{ label: string; value: string }[]>();

  useEffect(() => {
    console.log('variables', variables);
    console.log('action', action);
  }, [action, variables]);

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

  const delays = props.delays || Array(options?.length).fill(0);
  const delayUnits =
    props.delayUnits || Array(options?.length).fill(DelayUnit.MINUTE);
  const delayNotes = props.delayNotes || Array(options?.length).fill('');
  const posibleOptions: ICheckPoint[] = [];

  const changeDelayHandler = (val: any, childIdx: number) => {
    const { delay, delayUnit, delayNote } = val;
    const newDelays = [...delays];
    const newDelayUnits = [...delayUnits];
    const newDelayNotes = [...delayNotes];
    newDelays[childIdx] = delay;
    newDelayUnits[childIdx] = delayUnit;
    newDelayNotes[childIdx] = delayNote;
    onChange({
      delays: newDelays,
      delayUnits: newDelayUnits,
      delayNotes: newDelayNotes,
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
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });

  return (
    <>
      <Space direction='vertical' size='large' className='w-full single-choice'>
        <CollapsiblePanel title='Options & navigation'>
          <>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='font-bold'>Navigation</div>
              <NavConfigPanel
                title='Pass'
                currentNode={nextNode}
                possibleNodes={possibleNodes}
                index={children.indexOf(next || '')}
                navLabel='If interact discourse successfully'
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
                possibleNodes={possibleNodes}
                index={children.indexOf(fallback || '')}
                navLabel='If interact discourse failed'
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
            </Space>
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
        <CollapsiblePanel title='Discourse Info'>
          <Space direction='vertical' size='small' className='w-full'>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                Action
              </div>
              <Select
                value={action ? action : null}
                placeholder='Please select action'
                className='w-full'
                options={SelectOptions}
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
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                Variables
              </div>
              <Select
                value={variables ? variables[0] : null}
                placeholder='Please select variables'
                className='w-full'
                options={variablesOption}
                onChange={(value, option) => {
                  onChange({
                    data: {
                      ...data,
                      variables: [value],
                    },
                  });
                }}
              />
            </Space>
            {action && action === 'move-topic' && (
              <>
                <Space direction='vertical' size='small' className='w-full'>
                  <div className='text-sm text-slate-600 flex items-center gap-2'>
                    Category ID
                  </div>
                  <Input
                    value={categoryId ? categoryId : ''}
                    placeholder='Please fill in category ID'
                    onChange={(e) => {
                      onChange({
                        data: { ...data, categoryId: e.target.value },
                      });
                    }}
                  />
                </Space>
              </>
            )}
          </Space>
        </CollapsiblePanel>
      </Space>
    </>
  );
};
