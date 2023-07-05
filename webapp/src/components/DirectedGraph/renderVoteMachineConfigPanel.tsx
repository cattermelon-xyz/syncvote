import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import MachineConfigPanel from './MachineConfigPanel/MachineConfigPanel';
import { getVoteMachine } from './voteMachine';
import { IConfigPanel } from '@types';
import { GraphPanelContext } from './context';

export const renderVoteMachineConfigPanel = (props: IConfigPanel) => {
  const {
    data,
    selectedNodeId,
    onChange,
    onDelete,
    onClose,
    editable = false,
  } = props;
  const versionData = data;
  const selectedNode = versionData.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  let configPanel = <></>;
  if (selectedNode !== undefined) {
    const machine: any = getVoteMachine(
      selectedNode.vote_machine_type || ''
    ) || {
      ConfigPanel: () => <></>,
    };
    const { ConfigPanel } = machine;
    const data = selectedNode.data ? selectedNode.data : {};
    configPanel = (
      <GraphPanelContext.Provider value={props}>
        <MachineConfigPanel
          vmConfigPanel={
            <ConfigPanel
              editable={editable}
              currentNodeId={selectedNodeId}
              onChange={onChange}
              children={selectedNode.children || []}
              allNodes={versionData.checkpoints}
              data={structuredClone(data)}
            />
          }
        />
      </GraphPanelContext.Provider>
    );
  }
  return (
    <Drawer
      closeIcon={<></>}
      className="directed-graph-config-panel"
      open={selectedNodeId !== '' && selectedNodeId !== undefined}
      onClose={onClose}
      title={
        <Typography.Paragraph
          className="text-2xl font-bold"
          style={{ marginBottom: '0px' }}
          editable={
            editable
              ? {
                  onChange: (value) => {
                    const newNode = structuredClone(selectedNode);
                    if (newNode) {
                      newNode.title = value;
                      onChange(newNode);
                    }
                  },
                }
              : false
          }
        >
          {selectedNode?.title ? selectedNode.title : selectedNodeId}
        </Typography.Paragraph>
      }
      bodyStyle={{ padding: '0px', backgroundColor: '#f6f6f6' }}
      extra={
        <Button
          type="link"
          icon={<DeleteOutlined />}
          className="flex items-center"
          onClick={() => {
            onDelete(selectedNodeId || '');
          }}
          disabled={!editable}
          danger
        >
          Delete
        </Button>
      }
      size="large"
    >
      {configPanel}
    </Drawer>
  );
};
