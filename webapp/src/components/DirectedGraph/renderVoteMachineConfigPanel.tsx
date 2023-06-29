import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import MachineConfigPanel from './MachineConfigPanel/MachineConfigPanel';
import { getVoteMachine } from './voteMachine';
import { IVoteMachine, IWorkflowVersionLayout } from '@types';

export const renderVoteMachineConfigPanel = ({
  // TODO: change versionData to a better name
  versionData, selectedNodeId, onChange, onDelete, onClose, web2Integrations,
  editable = false, selectedLayoutId,
  onChangeLayout,
}: {
  versionData: any, selectedNodeId:string, onChange: (data:any) => void,
  onDelete: (data:any) => void, onClose: () => void,
  web2Integrations: any[],
  editable?: boolean,
  selectedLayoutId?: string,
  onChangeLayout: (data:IWorkflowVersionLayout) => void,
}) => {
  const selectedNode = versionData.checkpoints?.find((chk:any) => chk.id === selectedNodeId);
  const layout = versionData.cosmetic?.layouts?.find((l:any) => l?.id === selectedLayoutId);
  let configPanel = (<></>);
  if (selectedNode !== undefined) {
    const machine:IVoteMachine = getVoteMachine(selectedNode.vote_machine_type) || {
      ConfigPanel: () => (<></>),
    };
    const { ConfigPanel } = machine;
    const data = selectedNode.data ? selectedNode.data : {};
    configPanel = (
      <MachineConfigPanel
        selectedNode={selectedNode}
        onChangeLayout={onChangeLayout}
        selectedLayout={layout}
        onChange={onChange}
        web2Integrations={web2Integrations}
        allNodes={versionData.checkpoints}
        editable={editable}
        vmConfigPanel={
          (
            <ConfigPanel
              editable={editable}
              currentNodeId={selectedNodeId}
              onChange={onChange}
              children={selectedNode.children}
              allNodes={versionData.checkpoints}
              data={structuredClone(data)}
            />
          )
        }
      />
    );
  }
  return (
    <Drawer
      closeIcon={<></>}
      className="directed-graph-config-panel"
      open={selectedNodeId !== '' && selectedNodeId !== undefined}
      onClose={onClose}
      title={<Typography.Paragraph
        className="text-2xl font-bold"
        style={{marginBottom:"0px"}}
        editable={editable ? { onChange: (value) => {
          const newNode = structuredClone(selectedNode);
          newNode.title = value;
          onChange(newNode);
        }} : false}
      >
        {selectedNode?.title ? selectedNode.title : selectedNodeId}
      </Typography.Paragraph>}
      bodyStyle={{ padding:'0px', backgroundColor:'#f6f6f6' }}
      extra={
        (
          <Button
            type="link"
            icon={<DeleteOutlined />}
            className="flex items-center"
            onClick={() => {
              let data = structuredClone(selectedNode.data);
              const newVersionData = structuredClone(versionData);
              const vm = getVoteMachine(selectedNode.vote_machine_type);
              if (vm) {
                data = vm.deleteChildNode(
                  data, selectedNode.children, selectedNodeId,
                );
                newVersionData.data = data;
              }
              onChange(newVersionData);
              onDelete(selectedNodeId);
            }}
            disabled={!editable}
            danger
          >
            Delete
          </Button>
        )
      }
      size="large"
    >
      { configPanel }
    </Drawer>
  );
};
