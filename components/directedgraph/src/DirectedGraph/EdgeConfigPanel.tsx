import { Input, Popover, Space } from 'antd';
import MarkerEditEdge from './MarkerEdit/MarkerEditEdge';
import { GraphContext } from './context';
import { useContext } from 'react';
import { DelayUnit } from './interface';
import { displayDelayDuration } from './utils';
import moment from 'moment';
import parse from 'html-react-parser';
import { LockOutlined } from '@ant-design/icons';

const EdgeConfigPanel = ({
  selectedEdge,
  nodes,
}: {
  selectedEdge: any;
  nodes: any[];
}) => {
  const sourceNode: any =
    nodes.find((node: any) => node.id === selectedEdge.source) || {};
  const targetNode: any =
    nodes.find((node: any) => node.id === selectedEdge.target) || {};
  const label = selectedEdge.label; // reactjs element
  const selectedEdgeData = selectedEdge?.data?.data || {};
  const target = selectedEdge?.target || '';

  const optIdx = (selectedEdge?.data?.children || []).findIndex(
    (child: any) => child === target
  );
  const delay =
    optIdx !== -1 && selectedEdgeData?.delays
      ? selectedEdgeData?.delays[optIdx]
      : 0;
  const delayUnit =
    optIdx !== -1 && selectedEdgeData?.delayUnits
      ? selectedEdgeData?.delayUnits[optIdx]
      : DelayUnit.MINUTE;
  const delayNote =
    optIdx !== -1 && selectedEdgeData?.delayNotes
      ? selectedEdgeData?.delayNotes[optIdx]
      : '';
  return (
    <Space direction='vertical' size='middle' className='w-full'>
      <Space
        direction='vertical'
        size='middle'
        className='w-full bg-white rounded-lg p-4'
      >
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-zinc-400'>Result</div>
          <div className='flex items-center'>
            <div className='text-md' style={{ ...selectedEdge?.labelStyle }}>
              {label}
            </div>
            {parseInt(delay) > 0 ? (
              <Popover trigger='hover' content={parse(delayNote)}>
                <div className='text-violet-300 cursor-pointer inline ml-2 border border-solid border-violet-500 p-1 rounded-lg text-xs'>
                  {displayDelayDuration(
                    moment.duration(delay, delayUnit ? delayUnit : 'minute')
                  )}
                </div>
              </Popover>
            ) : null}
          </div>
        </Space>
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-zinc-400'>From checkpoint</div>
          {/* <div style={{ ...selectedEdge?.labelStyle }}> */}
          <div className='p-2 border border-solid rounded-md'>
            {sourceNode.data.label}
          </div>
        </Space>
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-zinc-400'>Navigate to checkpoint</div>
          {/* <div style={{ ...selectedEdge?.labelStyle }}> */}
          <div className='p-2 border border-solid rounded-md'>
            {targetNode.data.label}
          </div>
        </Space>
      </Space>

      <Space
        direction='vertical'
        size='middle'
        className='w-full bg-white rounded-lg p-4'
      >
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-zinc-400'>Path Color</div>
          <MarkerEditEdge selectedEdge={selectedEdge} />
        </Space>
      </Space>
    </Space>
  );
};

export default EdgeConfigPanel;
