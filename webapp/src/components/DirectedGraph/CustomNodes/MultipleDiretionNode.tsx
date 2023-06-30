import {
  ClockCircleOutlined,
  SettingOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

import parse from 'html-react-parser';
import moment from 'moment';
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
    const description = data.raw?.description || '';
    const duration = data.raw?.duration * 1000 || 0;
    const selected = data.selected
      ? 'border-2 border-violet-500'
      : 'border border-slate-700 ';
    const style = data.style;
    return (
      <>
        <Handle
          id={`t-${Position.Top}`}
          type="target"
          position={Position.Top}
          style={{ background: '#aca' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`t-${Position.Left}`}
          type="target"
          position={Position.Left}
          style={{ background: '#aca' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`t-${Position.Bottom}`}
          type="target"
          position={Position.Bottom}
          style={{ background: '#aca' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`t-${Position.Right}`}
          type="target"
          position={Position.Right}
          style={{ background: '#aca' }}
          isConnectable={isConnectable}
        />

        <Handle
          id={`s-${Position.Top}`}
          type="source"
          position={Position.Top}
          style={{ background: '#ccc' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`s-${Position.Left}`}
          type="source"
          position={Position.Left}
          style={{ background: '#ccc' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`s-${Position.Bottom}`}
          type="source"
          position={Position.Bottom}
          style={{ background: '#ccc' }}
          isConnectable={isConnectable}
        />
        <Handle
          id={`s-${Position.Right}`}
          type="source"
          position={Position.Right}
          style={{ background: '#ccc' }}
          isConnectable={isConnectable}
        />
        <div
          className={`rounded-md text-base border-solid ${selected} ${
            data.isEnd ? 'bg-slate-700 text-white' : ''
          }`}
        >
          {duration > 0 ? (
            <div className="absolute -top-8 py-1 px-2 bg-violet-200 rounded-md text-violet-500 flex items-center text-xs">
              <ClockCircleOutlined className="pr-2" />
              {moment.duration(duration).humanize()}
            </div>
          ) : null}
          <div
            className={
              description ? 'bg-zinc-100 p-2 rounded-t-md' : 'p-2 rounded-md'
            }
            style={style.title ? style.title : {}}
          >
            {data.label ? parse(data.label) : id}
          </div>
          {data.triggers && data.triggers.length > 0 ? (
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
          ) : null}
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
