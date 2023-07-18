import { Alert, Button, Input, Modal, Popover, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  CommentOutlined,
  DeleteOutlined,
  LockFilled,
  UnlockOutlined,
} from '@ant-design/icons';
import { validateWorkflow, validateMission } from '@middleware/logic';
import parse from 'html-react-parser';
import TextEditor from '@components/Editor/TextEditor';
import { getVoteMachine } from '../voteMachine';
import { Markers } from '../markers';
import { useContext } from 'react';
import { GraphPanelContext } from '../context';
import MarkerEditNode from '../MarkerEdit/MarkerEditNode';
import { GraphViewMode } from '../interface';
import CollapsiblePanel from './fragments/CollapsiblePanel';

const ContextTab = () => {
  const {
    data,
    selectedNodeId,
    selectedLayoutId,
    onChange,
    viewMode,
    onChangeLayout,
    onDelete,
  } = useContext(GraphPanelContext);
  const selectedNode = data.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const selectedLayout = data.cosmetic?.layouts?.find(
    (l: any) => l?.id === selectedLayoutId
  );
  const layoutNode = selectedLayout?.nodes?.find(
    (node: any) => node.id === selectedNode?.id
  ) || {
    style: {
      title: {
        backgroundColor: '#fff',
      },
    },
  };
  const style = layoutNode?.style;
  const markers = selectedLayout?.markers || [];
  const summary = getVoteMachine(selectedNode?.vote_machine_type)?.explain({
    checkpoint: selectedNode,
    data: selectedNode?.data,
  });
  const vmValidation = getVoteMachine(
    selectedNode?.vote_machine_type
  )?.validate({
    checkpoint: selectedNode,
  }) || {
    isValid: true,
  };
  const locked = selectedNode?.locked ? selectedNode?.locked : {};
  let validation = { isValid: true, message: [''] };
  if (viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION) {
    // this is workflow
    validation = validateWorkflow({ checkPoint: selectedNode });
  } else if (viewMode === GraphViewMode.EDIT_MISSION) {
    // this is mission
    validation = validateMission({ checkPoint: selectedNode });
  }
  const renderValidation = (params: any) => {
    let rs = null;
    if (!params.isValid) {
      rs = (
        <>
          {params.message.map((msg: string) => {
            return <Alert key={msg} message={msg} type='error' />;
          })}
        </>
      );
    }
    return rs;
  };
  return (
    <Space direction='vertical' size='large' className='w-full'>
      {/* <Space.Compact className="w-full">
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
      </Space.Compact> */}
      {!selectedNode?.isEnd && selectedNode?.vote_machine_type ? (
        <>
          <CollapsiblePanel title='Rules & conditions' collapsable={false}>
            <Space direction='vertical' size='small'>
              {summary}
              {renderValidation(validation)}
              {renderValidation(vmValidation)}
            </Space>
          </CollapsiblePanel>
        </>
      ) : (
        <></>
      )}
      <Space direction='vertical' size='middle' className='w-full'></Space>
      <CollapsiblePanel title='Note' collapsable={false}>
        {parse(selectedNode?.description || 'Not added')}
      </CollapsiblePanel>
      {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ? (
        <Button
          type='default'
          className='flex items-center w-full justify-center'
          size='large'
          onClick={() => {
            Modal.confirm({
              title: `Delete '${selectedNode?.title}'`,
              content:
                'Are you sure you want to delete this checkpoint? This action cannot be undone and all associated data will be permanently removed from the system.',
              onOk: () => {
                onDelete(selectedNodeId || '');
              },
            });
          }}
          danger
        >
          <DeleteOutlined />
          Delete this checkpoint
        </Button>
      ) : null}
    </Space>
  );
};

export default ContextTab;
