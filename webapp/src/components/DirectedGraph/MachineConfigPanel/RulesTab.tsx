import { Space, Drawer, Tabs, Collapse, Input, Modal, Button } from 'antd';
import { useContext, useState } from 'react';
import {
  CommentOutlined,
  EditOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { GraphViewMode, ICheckPoint, IVoteMachine } from '../../../types';
import ChooseVoteMachine from './ChooseVoteMachine';
import VotingPartipation from './rules/VotingParticipant';
import VotingDuration from './rules/VotingDuration';
import { getVoteMachine } from '../voteMachine';
import { GraphPanelContext } from '../context';
import CollapsiblePanel from './fragments/CollapsiblePanel';
import TextEditor from '@components/Editor/TextEditor';
import MarkerEditNode from '../MarkerEdit/MarkerEditNode';
import parse from 'html-react-parser';

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
    selectedNode?.votingLocation || 'Discorse or Forum'
  );
  const [showParticipationSideNote, setshowParticipationSideNote] =
    useState(false);
  const [newParticipationDescription, setNewParticipationDescription] =
    useState(selectedNode?.participationDescription || '');
  return (
    <>
      <Modal
        open={showParticipationSideNote}
        onCancel={() => setshowParticipationSideNote(false)}
        onOk={() => {
          const newNode = structuredClone(selectedNode);
          if (newNode) {
            newNode.participationDescription = newParticipationDescription;
            onChange(newNode);
          }
          setshowParticipationSideNote(false);
        }}
        title='Set sidenote'
      >
        <TextEditor
          value={newParticipationDescription}
          setValue={(val: any) => {
            setNewParticipationDescription(val);
          }}
        />
      </Modal>
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
        {!selectedNode?.isEnd ? (
          <CollapsiblePanel title='Participants'>
            <VotingPartipation />
            {!selectedNode?.participationDescription ? (
              <Button
                icon={<CommentOutlined />}
                onClick={() => setshowParticipationSideNote(true)}
                className='mt-4'
              >
                Add side note
              </Button>
            ) : (
              <Space
                direction='vertical'
                className='w-full border border-zinc-300 border-solid rounded-lg p-2 mt-4'
                size='middle'
              >
                <Space
                  direction='horizontal'
                  className='w-full justify-between'
                >
                  <div>
                    <MessageOutlined className='mr-1' />
                    Sidenote
                  </div>
                  <Button
                    type='text'
                    icon={<EditOutlined />}
                    className='hover:text-violet-500'
                    onClick={() => setshowParticipationSideNote(true)}
                  />
                </Space>
                {parse(selectedNode?.participationDescription)}
              </Space>
            )}
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
        <CollapsiblePanel title='General info'>
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
          </Space>
        </CollapsiblePanel>
      </Space>
    </>
  );
};

export default RulesTab;
