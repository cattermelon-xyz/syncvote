import { IVoteMachineConfigProps } from '@types';
import { Veto as Interface } from './interface';
import CollapsiblePanel from '@components/DirectedGraph/components/CollapsiblePanel';
import ResultCalculator from '@components/DirectedGraph/components/ResultCalculator';
import { Alert, Space, Switch } from 'antd';
import { all } from 'axios';
import NavConfigPanel from '@components/DirectedGraph/components/NavConfigPanel';

const VetoIndex = Interface.VetoIndex;
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
  const { fallback, pass, token } = data;
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
    if (childIdx === VetoIndex.passIdx) {
      data.pass = id;
    } else if (childIdx === VetoIndex.fallbackIdx) {
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
                There are only 2 options "Veto" or "Abstain" for user to choose.
              </p>
              <p>Note that "Abstain" choices are included in "Quorum"</p>
            </>
          }
        />
        <Space direction='vertical' size='middle' className='w-full mt-4'>
          <NavConfigPanel
            title='Vetoed'
            currentNode={fallbackNode}
            possibleNodes={posibleNodes}
            index={VetoIndex.fallbackIdx}
            navLabel='Vetoed or Failed'
            delay={delays[VetoIndex.fallbackIdx]}
            delayUnit={delayUnits[VetoIndex.fallbackIdx]}
            delayNote={delayNotes[VetoIndex.fallbackIdx]}
            changeDelayHandler={changeDelayHandler}
            replaceHandler={replaceHandler}
          />
          <NavConfigPanel
            title='Pass'
            currentNode={passNode}
            possibleNodes={posibleNodes}
            index={VetoIndex.passIdx}
            navLabel='Proposal is passed'
            delay={delays[VetoIndex.passIdx]}
            delayUnit={delayUnits[VetoIndex.passIdx]}
            delayNote={delayNotes[VetoIndex.passIdx]}
            changeDelayHandler={changeDelayHandler}
            replaceHandler={replaceHandler}
          />
        </Space>
      </CollapsiblePanel>
      <CollapsiblePanel title='Result'>
        <ResultCalculator
          quorum={quorum || 0}
          excluded={['winnerThreshold']}
          sideNote={resultDescription || ''}
          tokenAddress={token || ''}
          setValue={(keyValue: any) => {
            if (keyValue.hasOwnProperty('quorum')) {
              onChange({ quorum: keyValue.quorum });
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
