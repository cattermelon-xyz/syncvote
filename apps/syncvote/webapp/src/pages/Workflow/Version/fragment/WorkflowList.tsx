import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space } from 'antd';
import { useState } from 'react';

const NewSubWorkflowModal = ({
  version,
  isShown,
  setVersion,
  setShowAddNewSubWorkflowModal,
}: {
  version: any;
  isShown: boolean;
  setVersion: any;
  setShowAddNewSubWorkflowModal: any;
}) => {
  const [newSubWorkflowId, setNewSubWorkflowId] = useState('');
  const [startCheckPointId, setStartCheckPointId] = useState('');
  const allCheckPoints =
    version.data?.checkpoints?.filter(
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
        const existed =
          version?.data?.subWorkflows?.filter(
            (w: any) => w.refId === newSubWorkflowId
          ) || [];
        setShowAddNewSubWorkflowModal(false);
        if (existed.length > 0) {
          Modal.error({
            title: 'Error',
            content: 'Sub-workflow already existed',
          });
          return;
        } else {
          const newData = { ...version.data };
          const subWorkflows = newData.subWorkflows
            ? [...newData.subWorkflows]
            : [];
          const checkpoints = [...newData.checkpoints];
          let chkp = undefined;
          for (var i = 0; i < checkpoints.length; i++) {
            chkp = structuredClone(checkpoints[i]);
            if (chkp.id === startCheckPointId) {
              checkpoints.splice(i, 1);
              break;
            }
          }
          subWorkflows.push({
            refId: newSubWorkflowId,
            start: startCheckPointId,
            checkpoints: [chkp],
          });
          newData.subWorkflows = [...subWorkflows];
          newData.checkpoints = [...checkpoints];
          setVersion({
            ...version,
            data: newData,
          });
        }
        setNewSubWorkflowId('');
        setStartCheckPointId('');
      }}
      onCancel={() => {
        setShowAddNewSubWorkflowModal(false);
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

const WorkflowList = ({
  version,
  setVersion,
  allCheckPoints,
}: {
  version: any;
  setVersion: any;
  allCheckPoints: any;
}) => {
  const [showAddNewSubWorkflowModal, setShowAddNewSubWorkflowModal] =
    useState(false);
  return (
    <Space direction='vertical' size='small'>
      <NewSubWorkflowModal
        isShown={showAddNewSubWorkflowModal}
        version={version}
        setVersion={setVersion}
        setShowAddNewSubWorkflowModal={setShowAddNewSubWorkflowModal}
      />
      <div className='flex gap-2 flex-row items-center'>
        <div>List of subworkflows</div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setShowAddNewSubWorkflowModal(true);
          }}
        />
      </div>
      {version?.data?.subWorkflows?.map((s: any) => {
        return (
          <div className='flex gap-2 flex-row items-center' key={s.refId}>
            <Button
              icon={
                <DeleteOutlined
                  onClick={() => {
                    const newData = structuredClone(version?.data);

                    const index = newData.subWorkflows.findIndex(
                      (v: any) => v.refId === s.refId
                    );
                    const subWorkflowStartNode = newData.subWorkflows.find(
                      (v: any) => v.refId === s.refId
                    ).start;
                    if (index !== -1) {
                      newData.subWorkflows.splice(index, 1);
                      const fk = newData.checkpoints.find(
                        (ckp: any) =>
                          ckp.vote_machine_type === 'forkNode' &&
                          ckp.data?.start?.includes(s.refId)
                      );
                      if (fk) {
                        fk.data.start.splice(fk.data.start.indexOf(s.refId), 1);
                        const idxStart =
                          fk.children?.indexOf(subWorkflowStartNode);
                        if (idxStart !== -1) {
                          fk.children?.splice(idxStart, 1);
                        }
                        const endIdx = fk.data.end?.indexOf(s.refId);
                        if (endIdx !== -1) {
                          fk.data.end.splice(endIdx, 1);
                        }
                      }
                      setVersion({
                        ...version,
                        data: newData,
                      });
                    }
                  }}
                />
              }
              danger
            />
            <div>{s.refId}</div>
            <div>
              {allCheckPoints.find((ckp: any) => ckp.id === s.start)?.title}
            </div>
          </div>
        );
      })}
    </Space>
  );
};

export default WorkflowList;
