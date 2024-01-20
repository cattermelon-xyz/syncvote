import { LockFilled, UnlockOutlined } from '@ant-design/icons';
import { GraphPanelContext } from '../../context';
import { Space, Input, Button, Modal } from 'antd';
import moment from 'moment';
import { useContext } from 'react';
import CollapsiblePanel from '../../components/CollapsiblePanel';
import SideNote from '../../components/SideNote';

const MinDuration = () => {
  const { data, onChange, viewMode, selectedNodeId } =
    useContext(GraphPanelContext);
  const allCheckPoints = data.checkpoints ? [...data.checkpoints] : [];
  data.subWorkflows?.map((sw: any) => {
    sw.checkpoints?.map((chk: any) => {
      allCheckPoints.push({ ...chk });
    });
  });
  const selectedNode = allCheckPoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const duration = selectedNode?.minDuration || 0;
  const days = duration ? Math.floor(duration / 86400) : 0;
  const hours = duration ? Math.floor((duration - days * 86400) / 3600) : 0;
  const mins = duration
    ? Math.floor((duration - days * 86400 - hours * 3600) / 60)
    : 0;

  const dateChange = (durationChanged: number) => {
    const node = structuredClone(selectedNode);
    console.log('dateChange in duration ', node);
    if (node) {
      console.log('durationChanged', durationChanged);
      onChange({
        ...node,
        minDuration: durationChanged,
      });
    }
  };

  const locked = selectedNode?.locked ? selectedNode?.locked : {};
  return (
    <CollapsiblePanel title='Min Duration'>
      {/* <Space direction="horizontal" className="w-full flex justify-between"> */}
      {/* {`Voting duration (${duration ? moment.duration(duration,
          'seconds').humanize() : 'missing'})`} */}
      <Space direction='vertical'>
        {duration ? (
          <span>apprx. {moment.duration(duration, 'seconds').humanize()}</span>
        ) : null}
        <Space direction='horizontal' className='w-full flex justify-between'>
          <Input
            addonAfter='Days'
            value={days}
            placeholder='Day'
            className='text-center'
            onChange={(e) => {
              dateChange(
                parseInt(e.target.value || '0', 10) * 86400 +
                  hours * 3600 +
                  mins * 60
              );
            }}
            disabled={locked.duration}
          />
          <Input
            value={hours}
            addonAfter='Hour'
            placeholder='Hour'
            className='text-center'
            onChange={(e) => {
              dateChange(
                days * 86400 +
                  parseInt(e.target.value || '0', 10) * 3600 +
                  mins * 60
              );
            }}
            disabled={locked.duration}
          />
          <Input
            value={mins}
            addonAfter='Minute'
            placeholder='Minute'
            className='text-center'
            onChange={(e) => {
              dateChange(
                days * 86400 +
                  hours * 3600 +
                  parseInt(e.target.value || '0', 10) * 60
              );
            }}
            disabled={locked.duration}
          />
        </Space>
        <SideNote
          value={selectedNode?.durationDescription}
          setValue={(val: string) => onChange({ durationDescription: val })}
        />
      </Space>
    </CollapsiblePanel>
  );
};

export default MinDuration;
