import {
  ClockCircleOutlined,
  SettingOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

import parse from 'html-react-parser';
import moment from 'moment';
import { displayDelayDuration } from '../utils';
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
    return (
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
        <div
          className={`rounded-md text-base hover:opacity-30 ${selected} ${
            data.isEnd ? 'bg-zinc-700 text-white' : ''
          }`}
        >
          {duration > 0 ? (
            <div className='absolute -top-8 py-1 px-2 bg-violet-200 rounded-md text-violet-500 flex items-center text-xs'>
              {displayDelayDuration(moment.duration(duration))}
            </div>
          ) : null}
          <div
            className={`p-2 font-bold`}
            style={style.title ? style.title : {}}
          >
            {data.label
              ? typeof data.label === 'string'
                ? parse(
                    data.label.length > 30
                      ? data.label.substr(0, 30) + '...'
                      : data.label
                  )
                : data.label
              : 'untitled'}
          </div>
          {data.abstract ? (
            <div style={style.content ? style.content : {}} className='py-2'>
              {data.abstract}
            </div>
          ) : null}

          {/* {data.triggers && data.triggers.length > 0 ? (
            <div className="text-xs flex justify-center gap-0.5 p-2">
              {data.triggers.map((trigger: any) => {
                const icon = getIcon(trigger.provider, trigger.id);
                if (trigger.triggerAt === 'this') {
                  return icon;
                }
                return null;
              })}
            </div>
          ) : null}
          {description ? (
            <div
              className="text-xs justify-left gap-0.5 py-2 px-3 bg-white rounded-b-md"
              style={style.content ? style.content : {}}
            >
              {parse(description)}
            </div>
          ) : null} */}
        </div>
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
