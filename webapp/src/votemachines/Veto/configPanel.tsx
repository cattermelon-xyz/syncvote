import { IVoteMachineConfigProps } from '@types';
import { Veto as Interface } from './interface';
import CollapsiblePanel from '@components/DirectedGraph/components/CollapsiblePanel';
import ResultCalculator from '@components/DirectedGraph/components/ResultCalculator';
import { Alert, Space, Switch } from 'antd';
import { all } from 'axios';
import NavConfigPanel from '@components/DirectedGraph/components/NavConfigPanel';

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
  const data: Interface.IVeto = props.data;
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
                There are only 2 options "Veto" or "Abstain" for user to choose.
              </p>
              <p>Note that "Abstain" choices are included in "Quorum"</p>
            </>
          }
        />
        <Space direction='vertical' size='middle' className='w-full mt-4'>
          <NavConfigPanel
            title='Fail'
            currentNode={fallbackNode}
            possibleNodes={posibleNodes}
            index={children.indexOf(fallback || '')}
            navLabel='Total votes fail Quorum and/or Vetos pass Threshold'
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
          <NavConfigPanel
            title='Pass'
            currentNode={passNode}
            possibleNodes={posibleNodes}
            index={children.indexOf(pass || '')}
            navLabel='Total votes pass Quorum and Vetos fail Threshold'
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
        </Space>
      </CollapsiblePanel>
      <CollapsiblePanel title='Result'>
        <ResultCalculator
          quorum={quorum || 0}
          winnerThreshold={threshold}
          sideNote={resultDescription || ''}
          tokenAddress={token || ''}
          setValue={(keyValue: any) => {
            if (keyValue.hasOwnProperty('quorum')) {
              onChange({ quorum: keyValue.quorum });
            }
            if (keyValue.hasOwnProperty('winnerThreshold')) {
              onChange({
                data: { ...data, threshold: keyValue.winnerThreshold },
              });
            }
            if (keyValue.hasOwnProperty('tokenAddress')) {
              onChange({ data: { ...data, token: keyValue.tokenAddress } });
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
