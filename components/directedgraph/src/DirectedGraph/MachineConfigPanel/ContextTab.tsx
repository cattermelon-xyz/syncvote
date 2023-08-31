import { Alert, Button, Input, Modal, Popover, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  CommentOutlined,
  DeleteOutlined,
  LockFilled,
  UnlockOutlined,
} from '@ant-design/icons';
import parse from 'html-react-parser';
import { getVoteMachine } from '../voteMachine';
import { Markers } from '../markers';
import { useContext } from 'react';
import { GraphPanelContext } from '../context';
import MarkerEditNode from '../MarkerEdit/MarkerEditNode';
import { GraphViewMode, ICheckPoint } from '../interface';
import CollapsiblePanel from '../components/CollapsiblePanel';
import GeneralInfo from '../components/GeneralInfo';
import { isRTE } from '../utils';

export const validateWorkflow = ({
  checkPoint,
}: {
  checkPoint: ICheckPoint | undefined;
}) => {
  const message = [];
  let isValid = true;
  if (checkPoint?.isEnd) {
    // End checkPoint require no condition
    isValid = true;
  } else {
    if (
      checkPoint?.participation === undefined ||
      checkPoint?.participation?.data === undefined
    ) {
      isValid = false;
      message.push('Missing voting participation condition');
    }
    if (checkPoint?.vote_machine_type === undefined) {
      isValid = false;
      message.push('Missing voting machine type');
    }
    if (!checkPoint?.duration) {
      isValid = false;
      message.push('Missing duration');
    }
    if (!checkPoint?.data) {
      isValid = false;
      message.push('Vote configuration is missing');
    }
  }
  return {
    isValid,
    message,
  };
};

export const validateMission = ({
  checkPoint,
}: {
  checkPoint: ICheckPoint | undefined;
}) => {
  let message: string[] = [];
  let isValid = true;
  if (checkPoint?.isEnd) {
    // End checkPoint require no condition
    isValid = true;
  } else {
    isValid = true;
    message = ['nothing has been done'];
  }
  return {
    isValid,
    message,
  };
};

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
    <Space direction='vertical' size='large' className='w-full pb-4'>
      <CollapsiblePanel title='Purpose & Description' collapsable={false}>
        {parse(selectedNode?.description || 'Not added')}
      </CollapsiblePanel>
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
            <Space direction='vertical' size='small' className='w-full'>
              <GeneralInfo checkpoint={selectedNode} />
              <hr className='my-2' style={{ borderTop: '1px solid #E3E3E2' }} />
              {summary}
              {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ? (
                <>
                  {renderValidation(validation)}
                  {renderValidation(vmValidation)}
                </>
              ) : null}
            </Space>
          </CollapsiblePanel>
        </>
      ) : (
        <></>
      )}
      <Space direction='vertical' size='middle' className='w-full'></Space>
      {isRTE(selectedNode?.note) ? (
        <CollapsiblePanel title='Note' collapsable={false}>
          {parse(selectedNode?.note || 'Not added')}
        </CollapsiblePanel>
      ) : null}
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
