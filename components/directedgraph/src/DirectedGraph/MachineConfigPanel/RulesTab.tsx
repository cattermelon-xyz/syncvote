import { Space, Drawer, Tabs, Collapse, Input, Modal, Button } from 'antd';
import { useContext, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { GraphViewMode, ICheckPoint, IVoteMachine } from '../../../types';
import ChooseVoteMachine from './ChooseVoteMachine';
import VotingPartipation from './rules/VotingParticipant';
import VotingDuration from './rules/VotingDuration';
import { getVoteMachine } from '../voteMachine';
import { GraphPanelContext } from '../context';
import CollapsiblePanel from '../components/CollapsiblePanel';
import TextEditor from '@components/Editor/TextEditor';
import MarkerEditNode from '../MarkerEdit/MarkerEditNode';
import SideNote from '../components/SideNote';

const RulesTab = ({ vmConfigPanel }: { vmConfigPanel: JSX.Element }) => {
  const { data, selectedNodeId, onChange, viewMode } =
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
  const [votingLocation, setVotingLocation] = useState(
    selectedNode?.votingLocation || ''
  );
  return (
    <>
      <Drawer
        open={vmDrawerVisbibility}
        onClose={() => {
          setvmDrawerVisbibility(false);
        }}
        headerStyle={{ display: 'none' }}
      >
        <ChooseVoteMachine
          changeVoteMachineType={setVoteMachine}
          currentType={selectedNode?.vote_machine_type}
        />
      </Drawer>
      <Space className='w-full pb-4' direction='vertical' size='large'>
        <CollapsiblePanel title='Purpose & description'>
          <Space direction='vertical' size='small' className='w-full'>
            {/* <Space direction="horizontal" className="justify-between w-full">
                <span>Information supporting the decision</span>
                <Button
                  icon={locked.description ? <LockFilled /> : <UnlockOutlined />}
                  onClick={() => {
                    const newLocked = { ...locked, description: !locked.description };
                    const newNode = structuredClone(selectedNode);
                    newNode.locked = newLocked;
                    onChange(newNode);
                  }}
                  disabled={!editable}
                />
              </Space> */}
            <TextEditor
              value={selectedNode?.description}
              setValue={(val: any) => {
                const newNode = structuredClone(selectedNode);
                if (newNode) {
                  newNode.description = val;
                  onChange(newNode);
                }
              }}
            />
          </Space>
        </CollapsiblePanel>
        {!selectedNode?.isEnd ? (
          <CollapsiblePanel title='Participants'>
            <Space direction='vertical' size='small' className='w-full'>
              <div>Who can propose</div>
              <Input
                value={selectedNode?.proposerDescription}
                onChange={(e) => {
                  const newNode = structuredClone(selectedNode);
                  if (newNode) {
                    newNode.proposerDescription = e.target.value;
                    onChange(newNode);
                  }
                }}
              />
            </Space>
            <VotingPartipation />
            <SideNote
              value={selectedNode?.participationDescription}
              className='mt-4'
              setValue={(val: string) => {
                const newNode = structuredClone(selectedNode);
                if (newNode) {
                  newNode.participationDescription = val;
                  onChange(newNode);
                }
              }}
            />
          </CollapsiblePanel>
        ) : null}
        <CollapsiblePanel title='Voting method'>
          <>
            {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION &&
            !selectedNode?.isEnd ? (
              <div
                className='w-full flex justify-between items-center text-lg p-2 cursor-pointer rounded-lg border-2 border-solid border-violet-500 hover:text-violet-500'
                onClick={() => {
                  setvmDrawerVisbibility(true);
                }}
              >
                <div className='flex items-center gap-4'>
                  {machine?.getIcon()}
                  {machine?.getName()}
                </div>
                <EditOutlined />
              </div>
            ) : (
              <></>
            )}
            {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION &&
            selectedNode?.isEnd ? (
              <ChooseVoteMachine
                changeVoteMachineType={setVoteMachine}
                currentType={undefined}
              />
            ) : (
              <></>
            )}
          </>
        </CollapsiblePanel>
        {vmConfigPanel}
        {!selectedNode?.isEnd ? <VotingDuration /> : null}
        <CollapsiblePanel title='Other info'>
          <Space direction='vertical' size='middle' className='w-full'>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-gray-400'>Voting location</div>
              <TextEditor
                value={votingLocation}
                setValue={(val: any) => {
                  setVotingLocation(val);
                }}
                onBlur={async () => {
                  if (votingLocation !== selectedNode?.votingLocation) {
                    const newNode = structuredClone(selectedNode);
                    if (newNode) {
                      newNode.votingLocation = votingLocation;
                      onChange(newNode);
                    }
                  }
                }}
              />
            </Space>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-gray-400'>Checkpoint color & label</div>
              <MarkerEditNode />
            </Space>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-gray-400'>Note</div>
              {/* <Space direction="horizontal" className="justify-between w-full">
                <span>Information supporting the decision</span>
                <Button
                  icon={locked.description ? <LockFilled /> : <UnlockOutlined />}
                  onClick={() => {
                    const newLocked = { ...locked, description: !locked.description };
                    const newNode = structuredClone(selectedNode);
                    newNode.locked = newLocked;
                    onChange(newNode);
                  }}
                  disabled={!editable}
                />
              </Space> */}
              <TextEditor
                value={selectedNode?.note}
                setValue={(val: any) => {
                  const newNode = structuredClone(selectedNode);
                  if (newNode) {
                    newNode.note = val;
                    onChange(newNode);
                  }
                }}
              />
            </Space>
          </Space>
        </CollapsiblePanel>
      </Space>
    </>
  );
};

export default RulesTab;
