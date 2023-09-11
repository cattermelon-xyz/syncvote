import { TwitterOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  DelayUnit,
  ICheckPoint,
  IVoteMachine,
  IVoteMachineGetLabelProps,
  displayDuration,
  SideNote,
} from 'directed-graph';
import ConfigPanel from './ConfigPanel';
import { DocInput, DocInput as Interface } from './interface';
import { DocInput as Funcs } from './funcs';
import parse from 'html-react-parser';
import { Space } from 'antd';

const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  const data = source.data || {};
  const { triggers } = source;
  const filteredTriggers = triggers?.filter(
    (trg: any) => trg.triggerAt === target.id
  );
  const children = source.children || [];
  const idx = children.indexOf(target.id);
  return data.options ? (
    <div>
      <div>{data.options[idx]}</div>
      <div>
        {filteredTriggers?.map((trg: any) =>
          trg.provider === 'twitter' ? (
            <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
          ) : (
            <span key={trg.id || Math.random()}>{trg.provider}</span>
          )
        )}
      </div>
    </div>
  ) : (
    <div>
      {filteredTriggers?.map((trg: any) =>
        trg.provider === 'twitter' ? (
          <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
        ) : (
          <span key={trg.id || Math.random()}>{trg.provider}</span>
        )
      )}
    </div>
  );
};
// label: label.length > 20 ? `${label.substring(0, 20)}...` : label,

const getIcon = () => {
  return <FormOutlined />;
};

const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: Interface.IData;
}) => {
  if (!checkpoint) {
    return <></>;
  }
  const noOfOptions = checkpoint.children ? checkpoint.children.length : 0;
  const optionsDescription = checkpoint.optionsDescription;
  const docs = data.docs || [];
  const renderOption = ({
    data,
    index,
  }: {
    data: Interface.IData;
    index: number;
  }) => {
    const { options } = data;
    const { delays, delayUnits, delayNotes } = checkpoint;
    const option = options[index];
    const delay = delays ? delays[index] : 0;
    const delayUnit = delayUnits ? delayUnits[index] : DelayUnit.MINUTE;
    const delayNote = delayNotes ? delayNotes[index] : '';
    return option ? (
      <>
        <div>
          <span className='text-violet-500'>{option}</span>{' '}
          {delay ? (
            <span>
              - Timelock:{' '}
              <span className='text-violet-500'>
                {displayDuration(moment.duration(delay, delayUnit))}
              </span>
            </span>
          ) : null}
        </div>
        <div className='py-1'>
          <SideNote value={delayNote} />
        </div>
      </>
    ) : null;
  };
  const p1 = (
    <>
      <div className='text-zinc-400'>Voting format</div>
      <ul className='list-disc ml-4'>
        <li>
          Voting method: <span className='text-violet-500'>Document Input</span>
          , only applicant can interact
        </li>
        {noOfOptions ? (
          <li>
            Voting options:{' '}
            <ul className='flex flex-col gap-1'>
              {data.options.map((option: string, index: number) => {
                return <li key={index}>{renderOption({ data, index })}</li>;
              })}
            </ul>
          </li>
        ) : null}
        {/* {docs.map((doc: DocInput.IDoc, index: number) => {
          return (
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-violet-500 '>
                {doc.action} {doc.id}
              </div>

              <div className='w-full'>{parse(doc.description)}</div>
            </Space>
          );
        })} */}
        <SideNote value={optionsDescription} />
      </ul>
    </>
  );
  return p1;
};
const abstract = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: DocInput.IData;
}) => {
  const { docs } = data;
  return docs && docs.length > 0 ? (
    <div className='p-2'>
      {docs.map((doc: DocInput.IDoc, index: number) => {
        if (index < 3) {
          return (
            <div>
              <div>
                {doc.action} <span className='text-violet-500'>{doc.id}</span>
              </div>
            </div>
          );
        } else if (index === 3) {
          return <div>...</div>;
        } else {
          return null;
        }
      })}
    </div>
  ) : null;
};

const VoteMachine: IVoteMachine = {
  ConfigPanel: ConfigPanel,
  getProgramAddress: Funcs.getProgramAddress,
  getName: Funcs.getName,
  deleteChildNode: Funcs.deleteChildNode,
  getLabel,
  getType: Funcs.getType,
  getIcon,
  getInitialData: Funcs.getInitialData,
  explain,
  validate: Funcs.validate,
  abstract,
};

export default VoteMachine;
