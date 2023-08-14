import { IVoteMachineConfigProps } from '@types';
import { UpVote as Interface } from './interface';
import CollapsiblePanel from '@components/DirectedGraph/components/CollapsiblePanel';
import ResultCalculator from '@components/DirectedGraph/components/ResultCalculator';
import { Alert, Space, Switch } from 'antd';
import { all } from 'axios';
import NavConfigPanel from '@components/DirectedGraph/components/NavConfigPanel';

const UpVoteIndex = Interface.UpVoteIndex;
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
    children[childIdx] = id;
    if (childIdx === UpVoteIndex.passIdx) {
      data.pass = id;
    } else if (childIdx === UpVoteIndex.fallbackIdx) {
      data.fallback = id;
    }
    onChange({
      children: structuredClone(children),
      data: structuredClone(data),
    });
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
            index={UpVoteIndex.passIdx}
            navLabel='Proposal is passed'
            delay={delays[UpVoteIndex.passIdx]}
            delayUnit={delayUnits[UpVoteIndex.passIdx]}
            delayNote={delayNotes[UpVoteIndex.passIdx]}
            changeDelayHandler={changeDelayHandler}
            replaceHandler={replaceHandler}
          />
          <NavConfigPanel
            title='Failed'
            currentNode={fallbackNode}
            possibleNodes={posibleNodes}
            index={UpVoteIndex.fallbackIdx}
            navLabel='Failed to reach Threshold or Quorum'
            delay={delays[UpVoteIndex.fallbackIdx]}
            delayUnit={delayUnits[UpVoteIndex.fallbackIdx]}
            delayNote={delayNotes[UpVoteIndex.fallbackIdx]}
            changeDelayHandler={changeDelayHandler}
            replaceHandler={replaceHandler}
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
