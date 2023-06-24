import {
  Space, Drawer, Tabs,
} from 'antd';
import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ICheckPoint, IVoteMachine } from '../../../types';
import ChooseVoteMachine from './ChooseVoteMachine';
import VotingPartipation from './rules/VotingParticipant';
import VotingDuration from './rules/VotingDuration';
import { getVoteMachine } from '../voteMachine';

const RulesTab = ({
  selectedNode, onChange, editable = false, vmConfigPanel,
}:{
  selectedNode:ICheckPoint;
  onChange: (changedData:ICheckPoint) => void;
  editable?: boolean;
  vmConfigPanel: JSX.Element;
}) => {
  const [vmDrawerVisbibility, setvmDrawerVisbibility] = useState(false);
  const setVoteMachine = ({
    type, initialData,
  }: {
    type:string;
    initialData:any;
  }) => {
    if (type !== 'isEnd') {
      const newNode = structuredClone(selectedNode);
      newNode.vote_machine_type = type;
      newNode.data = initialData;
      newNode.children = [];
      newNode.isEnd = false;
      onChange(newNode);
    } else {
      onChange({
        isEnd: true,
      });
    }
    setvmDrawerVisbibility(false);
  };
  const machine:IVoteMachine = getVoteMachine(selectedNode?.vote_machine_type || '');
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
      <Space direction="vertical" size="large" className="w-full">
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
        )
        :
          <></>
        }
        {editable && selectedNode?.isEnd ? (
          <ChooseVoteMachine
            changeVoteMachineType={setVoteMachine}
            currentType={undefined}
          />
        )
        :
          <></>
        }
        {!selectedNode?.isEnd ? (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Options & Results',
                children: vmConfigPanel,
              },
              {
                key: '2',
                label: 'Voting participants',
                children: <VotingPartipation
                  onChange={onChange}
                  editable={editable}
                  selectedNode={selectedNode}
                />,
              },
              {
                key: '3',
                label: 'Voting Duration',
                children: <VotingDuration
                  onChange={onChange}
                  editable={editable}
                  selectedNode={selectedNode}
                />,
              },
            ]}
          />
        )
        : null
        }
      </Space>
    </>
  );
};

export default RulesTab;
