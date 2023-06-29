import {
  Tabs,
} from 'antd';
import { ICheckPoint, IWorkflowVersionLayout, IWorkflowVersionLayoutMarker } from '../../../types';
import ContextTab from './ContextTab';
import RulesTab from './RulesTab';
import TriggerTab from './TriggerTab';
import '../styles.scss';

const MachineConfigPanel = ({
  selectedNode, onChange, web2Integrations, allNodes, editable = false, vmConfigPanel, selectedLayout, onChangeLayout,
}:{
  selectedNode: any,
  onChange: (changedData:ICheckPoint) => void;
  onChangeLayout: (changedData:IWorkflowVersionLayout) => void;
  web2Integrations: any[];
  allNodes: any[];
  editable?: boolean;
  vmConfigPanel:JSX.Element;
  selectedLayout: IWorkflowVersionLayout;
}) => {
  const items = [
    {
      key: '1',
      label: 'Content',
      children: (
        <ContextTab
          selectedNode={selectedNode}
          selectedLayout={selectedLayout}
          onChange={onChange}
          onChangeLayout={onChangeLayout}
          editable={editable}
        />
      ),
    },
    {
      key: '2',
      label: 'Rules and conditions',
      children: (
        <RulesTab
          selectedNode={selectedNode}
          onChange={onChange}
          editable={editable}
          vmConfigPanel={vmConfigPanel}
        />
      ),
    },
    {
      key: '3',
      label: 'Automated actions',
      children: <TriggerTab
        web2Integrations={web2Integrations}
        triggers={selectedNode?.triggers || []}
        onChange={onChange}
        children={selectedNode?.children}
        selectedNode={selectedNode}
        allNodes={allNodes}
        editable={editable}
      />,
    },
  ];
  return (
    <Tabs
      className="w-full machine-config-panel-tabs"
      defaultActiveKey="1"
      items={items}
    />
  );
};

export default MachineConfigPanel;
