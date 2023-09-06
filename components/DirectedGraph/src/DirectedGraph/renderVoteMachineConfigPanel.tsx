import {
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import MachineConfigPanel from './MachineConfigPanel/MachineConfigPanel';
import { getVoteMachine } from './voteMachine';
import { GraphViewMode, IConfigPanel } from './interface';
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
              viewMode={viewMode}
              currentNodeId={selectedNodeId}
              onChange={onChange}
              children={selectedNode.children || []}
              allNodes={versionData.checkpoints}
              data={structuredClone(data)}
              quorum={selectedNode.quorum}
              includedAbstain={selectedNode.includedAbstain}
              delays={selectedNode.delays}
              delayUnits={selectedNode.delayUnits}
              delayNotes={selectedNode.delayNotes}
              resultDescription={selectedNode.resultDescription}
              optionsDescription={selectedNode.optionsDescription}
            />
          }
        />
      </GraphPanelContext.Provider>
    );
  }
  return (
    <Drawer
      closeIcon={<></>}
      extra={
        window.innerWidth > 700 ? (
          <></>
        ) : (
          <Button icon={<CloseOutlined />} shape='circle' onClick={onClose} />
        )
      }
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
      size={window.innerWidth > 700 ? 'large' : 'default'}
    >
      {configPanel}
    </Drawer>
  );
};
