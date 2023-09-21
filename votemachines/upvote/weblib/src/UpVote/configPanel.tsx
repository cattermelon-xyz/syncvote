import {
  IVoteMachineConfigProps,
  CollapsiblePanel,
  ResultCalculator,
  NavConfigPanel,
  SideNote,
} from 'directed-graph';
import { UpVote as Interface } from './interface';
import { Alert, Space, Switch } from 'antd';
import { all } from 'axios';

export default (props: IVoteMachineConfigProps) => {
  const {
    quorum,
    resultDescription,
    optionsDescription,
    includedAbstain,
    onChange,
    allNodes,
    currentNodeId,
  } = props;
  const data: Interface.IData = props.data;
  const { fallback, pass, token, threshold } = data;
  const delays = props.delays || Array(2).fill(0);
  const delayUnits = props.delayUnits || Array(2).fill(0);
  const delayNotes = props.delayNotes || Array(2).fill('');
  const children = props.children || Array(2).fill('');
  const posibleNodes = [
    ...allNodes.filter(
      (n) => [fallback, pass, currentNodeId].indexOf(n.id) === -1
    ),
  ];
  const fallbackNode = allNodes.find((n) => n.id === fallback);
  const passNode = allNodes.find((n) => n.id === pass);
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
  return (
    <div className='flex gap-4 flex-col'>
      <CollapsiblePanel title='Navigation'>
        <Alert
          type='success'
          message={
            <>
              <p>
                There are only 2 options "Up Vote" or "Abstain" for user to
                choose.
              </p>
              <p>Note that "Abstain" choices are included in "Quorum"</p>
            </>
          }
        />
        <Space direction='vertical' size='middle' className='w-full mt-4'>
          <NavConfigPanel
            title='Pass'
            currentNode={passNode}
            possibleNodes={posibleNodes}
            index={children.indexOf(pass || '')}
            navLabel='If total votes pass Quorum and Upvotes pass Threshold'
            delay={passNode ? delays[children.indexOf(pass || '')] : 0}
            delayUnit={passNode ? delayUnits[children.indexOf(pass || '')] : 0}
            delayNote={passNode ? delayNotes[children.indexOf(pass || '')] : 0}
            changeDelayHandler={changeDelayHandler}
            replaceHandler={(val: any, idx: number) => {
              onChange({
                children: replaceHandler(val, idx),
                data: { ...data, pass: val.id },
              });
            }}
          />
          <NavConfigPanel
            title='Fail'
            currentNode={fallbackNode}
            possibleNodes={posibleNodes}
            index={children.indexOf(fallback || '')}
            navLabel='If total votes fail Quorum and/or Upvotes fail Threshold'
            delay={fallbackNode ? delays[children.indexOf(fallback || '')] : 0}
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
      <CollapsiblePanel title='Result'>
        <ResultCalculator
          quorum={quorum || 0}
          sideNote={resultDescription || ''}
          tokenAddress={token || ''}
          winnerThreshold={threshold || 0}
          setValue={(keyValue: any) => {
            if (keyValue.hasOwnProperty('quorum')) {
              onChange({ quorum: keyValue.quorum });
            }
            if (keyValue.hasOwnProperty('tokenAddress')) {
              onChange({ data: { ...data, token: keyValue.tokenAddress } });
            }
            if (keyValue.hasOwnProperty('winnerThreshold')) {
              onChange({
                data: { ...data, threshold: keyValue.winnerThreshold },
              });
            }
            if (keyValue.hasOwnProperty('sideNote')) {
              onChange({ resultDescription: keyValue.sideNote });
            }
          }}
        />
      </CollapsiblePanel>
    </div>
  );
};
