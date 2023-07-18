import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import MachineConfigPanel from './MachineConfigPanel/MachineConfigPanel';
import { getVoteMachine } from './voteMachine';
import { GraphViewMode, IConfigPanel } from '@types';
import { GraphPanelContext } from './context';

export const renderVoteMachineConfigPanel = (props: IConfigPanel) => {
  const { data, selectedNodeId, onChange, onDelete, onClose, viewMode } = props;
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
              // TODO: change to viewMode
              editable={
                viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ||
                viewMode === GraphViewMode.EDIT_MISSION
              }
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
      className='directed-graph-config-panel'
      headerStyle={{ paddingLeft: '0px' }}
      open={selectedNodeId !== '' && selectedNodeId !== undefined}
      onClose={onClose}
      title={
        <Typography.Paragraph
          className='text-2xl font-bold pl-0'
          style={{ marginBottom: '0px' }}
          editable={
            viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION
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
      size='large'
    >
      {configPanel}
    </Drawer>
  );
};
