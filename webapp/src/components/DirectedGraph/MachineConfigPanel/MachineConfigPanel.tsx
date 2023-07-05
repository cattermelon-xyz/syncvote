import { Tabs } from 'antd';
import ContextTab from './ContextTab';
import RulesTab from './RulesTab';
import TriggerTab from './TriggerTab';
import '../styles.scss';

const MachineConfigPanel = ({
  vmConfigPanel,
}: {
  vmConfigPanel: JSX.Element;
}) => {
  const items = [
    {
      key: '1',
      label: 'Content',
      children: <ContextTab />,
    },
    {
      key: '2',
      label: 'Rules and conditions',
      children: <RulesTab vmConfigPanel={vmConfigPanel} />,
    },
    {
      key: '3',
      label: 'Automated actions',
      children: <TriggerTab />,
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
