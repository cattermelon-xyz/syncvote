import { Tabs } from 'antd';
import ContextTab from './ContextTab';
import RulesTab from './RulesTab';
import TriggerTab from './TriggerTab';
import '../styles.scss';
import { useContext } from 'react';
import { GraphPanelContext } from '../context';
import { GraphViewMode } from '../interface';

const MachineConfigPanel = ({
  vmConfigPanel,
}: {
  vmConfigPanel: JSX.Element;
}) => {
  const items = [
    {
      key: '1',
      label: 'Summary',
      children: <ContextTab />,
    },
    {
      key: '2',
      label: 'Rules and conditions',
      children: <RulesTab vmConfigPanel={vmConfigPanel} />,
    },
    // {
    //   key: '3',
    //   label: 'Automated actions',
    //   children: <TriggerTab />,
    // },
  ];
  const { viewMode } = useContext(GraphPanelContext);
  const editable =
    viewMode !== undefined &&
    (viewMode === GraphViewMode.EDIT_MISSION ||
      viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION);
  return (
    <>
      {editable ? (
        <Tabs
          className='w-full machine-config-panel-tabs'
          defaultActiveKey='1'
          items={items}
        />
      ) : (
        <div style={{ backgroundColor: '#f6f6f6' }} className='p-4'>
          <ContextTab />
        </div>
      )}
    </>
  );
};

export default MachineConfigPanel;
