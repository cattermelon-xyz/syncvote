import {
  Alert,
  Button, Input, Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CommentOutlined, LockFilled, UnlockOutlined } from '@ant-design/icons';
import {
  validateWorkflow, validateMission,
} from '@middleware/logic';
import { ICheckPoint } from '../../../types';
import { getVoteMachine } from '../voteMachine';

const ContextTab = ({
  selectedNode = {}, onChange, editable,
} : {
  selectedNode?: any;
  onChange: (changedData:ICheckPoint) => void;
  editable?: boolean;
}) => {
  const summary = getVoteMachine(selectedNode.vote_machine_type)?.explain({
    checkpoint: selectedNode,
    data: selectedNode.data,
  });
  const vmValidation = getVoteMachine(selectedNode.vote_machine_type)?.validate({
    checkpoint: selectedNode,
  }) || {
    isValid: true,
  };
  const locked = selectedNode?.locked ? selectedNode?.locked : {};
  let validation;
  // TODO: change edible to workflow or mission state!
  if (editable) { // this is workflow
    validation = validateWorkflow({ checkPoint: selectedNode });
  } else { // this is mission
    validation = validateMission({ checkPoint: selectedNode });
  }
  const renderValidation = (params: any) => {
    let rs = null;
    if (!params.isValid) {
      rs = (
        <>
          {
            params.message.map((msg: string) => {
              return (
                <Alert key={msg} message={msg} type="error" />
              );
            })
          }
        </>
      );
    }
    return rs;
  };
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space.Compact className="w-full">
        <Input
          value={selectedNode?.title ? selectedNode.title : selectedNode.id}
          onChange={(e) => {
            const newNode = structuredClone(selectedNode);
            newNode.title = e.target.value;
            onChange(newNode);
          }}
          disabled={locked.title}
        />
        <Button
          icon={locked.title ? <LockFilled /> : <UnlockOutlined />}
          onClick={() => {
            const newLocked = { ...locked, title: !locked.title };
            const newNode = structuredClone(selectedNode);
            newNode.locked = newLocked;
            onChange(newNode);
          }}
          disabled={!editable}
        />
      </Space.Compact>
      <Space direction="vertical" size="small" className="w-full">
        <Space direction="horizontal" className="justify-between w-full">
          <span>Information supporting the decision</span>
          <Button
            icon={locked.description ? <LockFilled /> : <UnlockOutlined />}
            onClick={() => {
              const newLocked = { ...locked, description: !locked.description };
              const newNode = structuredClone(selectedNode);
              newNode.locked = newLocked;
              onChange(newNode);
            }}
            disabled={!editable}
          />
        </Space>
        <TextArea
          value={selectedNode?.description}
          onChange={(e) => {
            const newNode = structuredClone(selectedNode);
            newNode.description = e.target.value;
            onChange(newNode);
          }}
          disabled={locked.description}
        />
      </Space>
      {!selectedNode?.isEnd && selectedNode.vote_machine_type ?
      (
        <>
          <Space direction="vertical" className="p-4 rounded-md bg-slate-100 border-1 w-full">
            <div className="flex items-center text-lg font-bold">
              <CommentOutlined className="mr-2" />
              Summary
            </div>
            {
              summary
            }
          </Space>
        </>
      )
      :
        <></>
      }
      <Space direction="vertical" size="middle" className="w-full">
        {renderValidation(validation)}
        {renderValidation(vmValidation)}
      </Space>
    </Space>
  );
};

export default ContextTab;
