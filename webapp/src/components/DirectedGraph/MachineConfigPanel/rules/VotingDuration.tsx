import { LockFilled, UnlockOutlined } from '@ant-design/icons';
import {
  Space, Input, Button, Modal,
} from 'antd';

const VotingDuration = ({
  selectedNode,
  onChange, editable,
}:{
  selectedNode: any;
  onChange: (data:any) => void;
  editable: boolean;
}) => {
  const duration = selectedNode?.duration || 0;
  const days = duration ? Math.floor(duration / 86400) : 0;
  const mins = duration ? Math.floor((duration % 86400) / 60) : 0;
  const seconds = duration ? duration % 60 : 0;
  const dateChange = (durationChanged:number) => {
    const node = structuredClone(selectedNode);
    node.duration = durationChanged;
    onChange(node);
  };
  const locked = selectedNode?.locked ? selectedNode?.locked : {};
  return (
    <>
      <Space direction="horizontal">
        {/* {`Voting duration (${duration ? moment.duration(duration,
          'seconds').humanize() : 'missing'})`} */}
        <Space direction="horizontal">
          <Input
            addonAfter="days"
            value={days}
            onChange={(e) => {
              dateChange(
                parseInt(e.target.value, 10) * 86400 + mins * 60 + seconds,
              );
            }}
            disabled={locked.duration}
          />
          <Input
            addonAfter="minutes"
            value={mins}
            onChange={(e) => {
              dateChange(
                days * 86400 + parseInt(e.target.value, 10) * 60 + seconds,
              );
            }}
            disabled={locked.duration}
          />
          <Input
            addonAfter="seconds"
            value={seconds}
            onChange={(e) => {
              dateChange(
                days * 86400 + mins * 60 + parseInt(e.target.value, 10),
              );
            }}
            disabled={locked.duration}
          />
        </Space>
        <Button
          icon={locked.duration ? <LockFilled /> : <UnlockOutlined />}
          onClick={() => {
            if (duration === undefined || Number.isNaN(duration) || duration === 0) {
              Modal.error({
                title: 'Invalid data',
                content: 'Cannot lock duration if it is not set',
              });
            } else {
              const newLocked = { ...locked, duration: !locked.duration };
              const newNode = structuredClone(selectedNode);
              newNode.locked = newLocked;
              onChange(newNode);
            }
          }}
          disabled={!editable}
        />
      </Space>
    </>
  );
};

export default VotingDuration;
