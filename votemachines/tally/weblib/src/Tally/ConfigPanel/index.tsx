import { Space, Switch, Button, Alert, Input, Popover, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import {
  GraphContext,
  ICheckPoint,
  IVoteMachineConfigProps,
} from 'directed-graph';
import {
  DelayUnit,
  NavConfigPanel,
  INavPanelNode,
  CollapsiblePanel,
  SideNote,
} from 'directed-graph';
import '../styles.scss';
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
    data = {
      options: [],
      governor: '',
      token: '',
      next: '',
      fallback: '',
      proposalId: '',
      tallyLink: '',
    },
    onChange = (data: ICheckPoint) => {},
    children = [],
    allNodes = [], //eslint-disable-line
    optionsDescription,
  } = props;

  const { fallback, next } = data;
  const delays = props.delays || Array(2).fill(0);
  const delayUnits = props.delayUnits || Array(2).fill(0);
  const delayNotes = props.delayNotes || Array(2).fill('');

  const posibleOptions: ICheckPoint[] = [];

  const fallbackNode = allNodes.find((n) => n.id === fallback);
  const nextNode = allNodes.find((n) => n.id === next);
  const posibleNodes = [
    ...allNodes.filter(
      (n) => [fallback, next, currentNodeId].indexOf(n.id) === -1
    ),
  ];
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

  const { data: graphData } = useContext(GraphContext);
  const variablesMission = graphData?.variables;
  const [variablesOption, setVariablesOption] =
    useState<{ label: string; value: string }[]>();

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
        <CollapsiblePanel title='Navigation'>
          <Alert
            type='success'
            message={
              <>
                <p>
                  There are only 2 options "Pass" or "Fail" for user to choose.
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
                fallbackNode ? delayUnits[children.indexOf(fallback || '')] : 0
              }
              delayNote={
                fallbackNode ? delayNotes[children.indexOf(fallback || '')] : 0
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
        </CollapsiblePanel>

        <CollapsiblePanel title='Tally Info'>
          <Space direction='vertical' size='small' className='w-full'>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                DAO Link
                <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                  <MdHelpOutline />
                </Popover>
              </div>
              <Input
                className='w-full'
                placeholder='https://www.tally.xyz/gov/syncvote'
                value={data?.tallyLink}
                onChange={(e: any) => {
                  let url = e.target.value;

                  if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                  }

                  onChange({
                    data: {
                      ...data,
                      tallyLink: url,
                    },
                  });
                }}
              />
            </Space>

            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                Governor contract
                <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                  <MdHelpOutline />
                </Popover>
              </div>
              <Input
                className='w-full'
                placeholder='Address of the deployed contract'
                value={data?.governor}
                onChange={(e: any) => {
                  onChange({
                    data: {
                      ...data,
                      governor: e.target.value,
                    },
                  });
                }}
              />
            </Space>

            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-sm text-slate-600 flex items-center gap-2'>
                Token address
                <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
                  <MdHelpOutline />
                </Popover>
              </div>
              <Input
                className='w-full'
                placeholder='Address of the deployed contract'
                value={data?.token}
                onChange={(e: any) => {
                  onChange({
                    data: {
                      ...data,
                      token: e.target.value,
                    },
                  });
                }}
              />
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
          </Space>
        </CollapsiblePanel>
      </Space>
    </>
  );
};
