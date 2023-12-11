import { Input, Modal, Select, Space } from 'antd';
import { useState } from 'react';

const NewSubWorkflowModal = ({
  data,
  onOK,
  onCancel,
  isShown,
}: {
  data: any;
  onOK: any;
  onCancel: any;
  isShown: boolean;
}) => {
  const [newSubWorkflowId, setNewSubWorkflowId] = useState('');
  const [startCheckPointId, setStartCheckPointId] = useState('');
  const allCheckPoints =
    data?.checkpoints?.filter(
      (c: any) =>
        !c.isEnd &&
        c.vote_machine_type !== 'forkNode' &&
        c.vote_machine_type !== 'joinNode'
    ) || [];
  return (
    <Modal
      open={isShown}
      title='Add new sub-workflow'
      onOk={() => {
        onOK({ refIdString: newSubWorkflowId, startId: startCheckPointId });
        setNewSubWorkflowId('');
        setStartCheckPointId('');
      }}
      onCancel={() => {
        onCancel();
        setNewSubWorkflowId('');
        setStartCheckPointId('');
      }}
    >
      <Space direction='vertical' className='w-full'>
        <div className='w-full flex justify-between flex-row items-center'>
          <div>New sub-workflow ID</div>
          <Input
            className='w-1/2'
            value={newSubWorkflowId}
            onChange={(e) => setNewSubWorkflowId(e.target.value)}
          />
        </div>
        <div className='w-full flex justify-between flex-row items-center'>
          <div>Start CheckPoint</div>
          <Select
            className='w-1/2'
            options={allCheckPoints?.map((c: any) => {
              return {
                value: c.id,
                label: c.title,
              };
            })}
            onChange={(v) => setStartCheckPointId(v)}
          />
        </div>
      </Space>
    </Modal>
  );
};
export default NewSubWorkflowModal;
