import {
  SettingOutlined,
  TwitterOutlined,
  CaretRightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  FlagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { memo, useContext } from 'react';
import { Handle, Position } from 'reactflow';

import parse from 'html-react-parser';
import moment from 'moment';
import { displayDelayDuration, shortenString } from '../utils';
import { GraphContext } from '../context';

// TODO: how to register getIcon in 1 place?
const getIcon = (provider: string, id: number | undefined) => {
  let rs = <></>;
  switch (provider) {
    case 'twitter':
      rs = <TwitterOutlined key={id || Math.random()} />;
      break;
    case 'custom':
      rs = <SettingOutlined key={id || Math.random()} />;
      break;
    default:
      rs = <span key={id || Math.random()}>{provider}</span>;
      break;
  }
  return rs;
};

const Node = memo(
  ({
    data,
    isConnectable = true,
    id,
  }: {
    data: any;
    isConnectable?: boolean;
    id: string | undefined;
  }) => {
    const duration = data.raw?.duration * 1000 || 0;
    const selected = data.selected
      ? 'border-2 border-violet-500 border-dashed'
      : 'border border-slate-700 border-solid';
    const style = data.style;
    const { openCreateProposalModal } = useContext(GraphContext);
    const type = data.raw?.vote_machine_type;
    const participation = data.raw?.participation || {};
    let partipationIcon =
      participation?.type === 'identity' ? (
        <TeamOutlined title='Admin(s) make the decision' />
      ) : null;
    partipationIcon =
      participation?.type === 'identity' &&
      (participation?.data[0] === 'author' ||
        participation?.data[0] === 'proposer') ? (
        <UserOutlined title='Only author make the decision' />
      ) : (
        partipationIcon
      );
    const env = import.meta.env.VITE_ENV;
    const { subWorkflowId, isStart } = data;
    return (
      <>
        <>
          <Handle
            id={`t-${Position.Top}`}
            type='target'
            position={Position.Top}
            style={{ background: '#aca' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`t-${Position.Left}`}
            type='target'
            position={Position.Left}
            style={{ background: '#aca' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`t-${Position.Bottom}`}
            type='target'
            position={Position.Bottom}
            style={{ background: '#aca' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`t-${Position.Right}`}
            type='target'
            position={Position.Right}
            style={{ background: '#aca' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`s-${Position.Top}`}
            type='source'
            position={Position.Top}
            style={{ background: '#ccc' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`s-${Position.Left}`}
            type='source'
            position={Position.Left}
            style={{ background: '#ccc' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`s-${Position.Bottom}`}
            type='source'
            position={Position.Bottom}
            style={{ background: '#ccc' }}
            isConnectable={isConnectable}
          />
          <Handle
            id={`s-${Position.Right}`}
            type='source'
            position={Position.Right}
            style={{ background: '#ccc' }}
            isConnectable={isConnectable}
          />
        </>
        <>
          {(env !== 'production' && isStart === true && (
            <div
              className='absolute -top-8'
              onClick={(e) => {
                if (subWorkflowId === '') {
                  e.stopPropagation();
                  if (openCreateProposalModal) {
                    openCreateProposalModal();
                  }
                }
              }}
            >
              {subWorkflowId === '' ? (
                <div className='bg-violet-100 py-1 px-2 rounded-md text-blue-500'>
                  <CaretRightOutlined />
                </div>
              ) : (
                <div className='flex flex-row gap-2 items-center'>
                  <div className='bg-violet-100 py-1 px-2 rounded-md'>
                    <FlagOutlined />
                  </div>
                  <div>{subWorkflowId}</div>
                </div>
              )}
            </div>
          )) ||
            (env !== 'production' &&
              isStart !== true &&
              subWorkflowId !== '' && (
                <div className='absolute -top-5'>{subWorkflowId}</div>
              ))}
        </>
        {((type === 'forkNode' || type === 'joinNode') && (
          <div>{data.abstract}</div>
        )) ||
          (data.isEnd === true && (
            <div className='items-center flex flex-col'>
              <div
                className={`rounded-full text-base w-4 h-4 ${selected} bg-zinc-700 text-white items-center justify-center flex`}
              >
                <div
                  className={`rounded-full text-base w-3 h-3 ${selected} bg-zinc-100 text-white`}
                ></div>
              </div>
              <div>{data.label}</div>
            </div>
          )) || (
            <>
              <div className={`rounded-md text-base ${selected}`}>
                <div className='hover:opacity-50'>
                  <div
                    className={`p-2 font-bold`}
                    style={style.title ? style.title : {}}
                  >
                    {data.label
                      ? typeof data.label === 'string'
                        ? parse(shortenString(data.label, 30))
                        : data.label
                      : 'untitled'}
                  </div>

                  {data.abstract ? (
                    <div
                      style={style.content ? style.content : {}}
                      className='py-2'
                    >
                      {data.abstract}
                    </div>
                  ) : null}
                </div>
              </div>
              {duration > 0 ? (
                <div className='mt-2 py-1 px-2 bg-violet-200 rounded-md text-violet-500 flex items-center text-xs'>
                  {displayDelayDuration(moment.duration(duration))}
                  {partipationIcon ? (
                    <div className='px-1'>{partipationIcon}</div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
      </>
    );
  }
);

const getType = () => {
  return {
    multipleDirectionNode: Node,
  };
};

const getTypeName = () => {
  return 'multipleDirectionNode';
};

export default {
  Node,
  getType,
  getTypeName,
};
