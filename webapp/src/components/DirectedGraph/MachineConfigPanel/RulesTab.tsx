import { Space, Drawer, Tabs } from 'antd';
import { useContext, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ICheckPoint, IVoteMachine } from '../../../types';
import ChooseVoteMachine from './ChooseVoteMachine';
import VotingPartipation from './rules/VotingParticipant';
import VotingDuration from './rules/VotingDuration';
import { getVoteMachine } from '../voteMachine';
import { GraphPanelContext } from '../context';

const RulesTab = ({ vmConfigPanel }: { vmConfigPanel: JSX.Element }) => {
  const { data, selectedNodeId, onChange, editable } =
    useContext(GraphPanelContext);
  const selectedNode = data.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const [vmDrawerVisbibility, setvmDrawerVisbibility] = useState(false);
  const setVoteMachine = ({
    type,
    initialData,
  }: {
    type: string;
    initialData: any;
  }) => {
    if (type !== 'isEnd') {
      const newNode = structuredClone(selectedNode);
      if (newNode) {
        newNode.vote_machine_type = type;
        newNode.data = initialData;
        newNode.children = [];
        newNode.isEnd = false;
        onChange(newNode);
      }
    } else {
      onChange({
        isEnd: true,
      });
    }
    setvmDrawerVisbibility(false);
  };
  const machine: any = getVoteMachine(selectedNode?.vote_machine_type || '');
  return (
    <>
      <Drawer
        open={vmDrawerVisbibility}
        onClose={() => {
          setvmDrawerVisbibility(false);
        }}
        title="Choose Vote Machine"
      >
        <ChooseVoteMachine
          changeVoteMachineType={setVoteMachine}
          currentType={selectedNode?.vote_machine_type}
        />
      </Drawer>
      <div className="w-full">
        <div className="pt-4 px-4 bg-white rounded-t-lg">
          <div className="mb-2">Voting method</div>
          {editable && !selectedNode?.isEnd ? (
            <div
              className="w-full flex justify-between items-center text-lg p-2 cursor-pointer rounded-lg border-2 hover:border-violet-500 hover:text-violet-500"
              onClick={() => {
                setvmDrawerVisbibility(true);
              }}
            >
              <div className="flex items-center gap-4">
                {machine?.getIcon()}
                {machine?.getName()}
              </div>
              <EditOutlined />
            </div>
          ) : (
            <></>
          )}
          {editable && selectedNode?.isEnd ? (
            <ChooseVoteMachine
              changeVoteMachineType={setVoteMachine}
              currentType={undefined}
            />
          ) : (
            <></>
          )}
        </div>
        {!selectedNode?.isEnd ? (
          <Space direction="vertical" size="middle" className="w-full mb-4">
            {vmConfigPanel}
            <VotingPartipation />
            <VotingDuration />
          </Space>
        ) : null}
      </div>
    </>
  );
};

export default RulesTab;
