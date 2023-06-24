import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import MachineConfigPanel from './MachineConfigPanel/MachineConfigPanel';
import { getVoteMachine } from './voteMachine';
import { IVoteMachine } from '../../types';

export const renderVoteMachineConfigPanel = ({
  // TODO: change versionData to a better name
  versionData, selectedNodeId, onChange, onDelete, onClose, web2Integrations,
  editable = false,
}: {
  versionData: any, selectedNodeId:string, onChange: (data:any) => void,
  onDelete: (data:any) => void, onClose: () => void,
  web2Integrations: any[],
  editable?: boolean,
}) => {
  const selectedNode = versionData.checkpoints?.find((chk:any) => chk.id === selectedNodeId);
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
      open={selectedNodeId !== '' && selectedNodeId !== undefined}
      onClose={onClose}
      title={`${selectedNode?.title ? selectedNode.title : selectedNodeId}`}
      // TODO: use Paragraph instead
      bodyStyle={{ paddingTop: '0px' }}
      extra={
        (
          <Button
            type="link"
            icon={<DeleteOutlined />}
            className="text-red-500 flex items-center"
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
