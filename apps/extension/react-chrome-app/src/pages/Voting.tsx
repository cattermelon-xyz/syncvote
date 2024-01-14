import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  ExportOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { PAGE_ROUTER } from '@constants/common';
import { openMissionPage, openWorkflowPage, trimTitle } from '../utils';
import HistoryItem from '@components/HistoryItem';
import VoteUI from '@components/VoteUI';

interface Props {
  setPage: any;
  currentProposalData: any;
  currentCheckpointData: any;
  setCurrentProposalId: any;
  setCurrentProposalData: any;
  user: any;
  reload: any;
  setLoading: any;
}

const Voting: React.FC<Props> = ({
  setPage,
  currentProposalData,
  currentCheckpointData,
  setCurrentProposalId,
  setCurrentProposalData,
  user,
  reload,
  setLoading,
}) => {
  const { workflow_id, workflow_version_id, org_id, mission_id } =
    currentProposalData;
  useEffect(() => {
    // let's persist the data
    if (currentProposalData) {
      const saveLastProposalId = async () => {
        await chrome.runtime.sendMessage({
          action: 'saveLastProposalId',
          payload: currentProposalData.id,
        });
      };
      saveLastProposalId();
    }
  }, [currentProposalData]);
  const allCkps = currentProposalData?.data?.checkpoints || [];
  currentProposalData?.data?.subWorkflows?.map((w: any) =>
    allCkps.push(...(w.checkpoints || []))
  );
  const historyItems = currentProposalData?.progress || [];
  for (var i = 0; i < historyItems.length; i++) {
    const item = historyItems[i];
    const itm = allCkps.find(
      (ckp: any) =>
        ckp.id === item.checkpoint_id.replace(item.mission_id + '-', '')
    );
    item.phase = itm?.phase;
  }

  let lastPhase = '';
  const runningPhase = currentCheckpointData?.phase;
  const lastHistoryItemPhase =
    currentCheckpointData?.phase && historyItems.length
      ? historyItems[historyItems.length - 1]?.phase
      : null;
  const [expandedPhases, setExpandedPhases] = useState<string[]>(
    runningPhase ? [runningPhase] : []
  );
  const renderPhaseHeader = (phase: string, completed: boolean) => {
    const expanded = expandedPhases.indexOf(phase) !== -1;
    return (
      <div className='flex flex-col gap-2'>
        <div className='bg-white p-3 rounded flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            {completed ? <div>Completed</div> : null}
            <div className='font-bold text-md'>{phase}</div>
          </div>
          {completed ? (
            <div
              onClick={() => {
                if (expanded) {
                  setExpandedPhases(expandedPhases.filter((p) => p !== phase));
                } else {
                  setExpandedPhases([...expandedPhases, phase]);
                }
              }}
            >
              {expanded ? <UpOutlined /> : <DownOutlined />}
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  return (
    <div className='pb-2'>
      <div>
        <div className='mb-2'>
          <LeftOutlined
            onClick={() => {
              setPage(PAGE_ROUTER.HOME_PAGE);
              setCurrentProposalData(null);
              setCurrentProposalId(-1);
            }}
          />
          <div>
            <p
              onClick={() => {
                openMissionPage(org_id, mission_id);
              }}
              className='w-full mt-3 text-[15px] cursor-pointer'
            >
              {trimTitle(currentProposalData?.m_title)}
              <ExportOutlined className='ml-1' />
            </p>
            <span
              className='text-violet-500 font-bold cursor-pointer'
              onClick={() => {
                openWorkflowPage(org_id, workflow_id, workflow_version_id);
              }}
            >
              View Live Workflow
            </span>
          </div>
        </div>
        <div className='mb-3 flex flex-col gap-2'>
          {historyItems.map((item: any, index: number) => {
            lastPhase = index !== 0 ? historyItems[index - 1].phase : '';
            return (
              <>
                {item?.phase && (index === 0 || lastPhase !== item?.phase)
                  ? renderPhaseHeader(
                      item.phase,
                      runningPhase !== item?.phase ? true : false
                    )
                  : null}
                {!item?.phase || expandedPhases.indexOf(item.phase) !== -1 ? (
                  <HistoryItem
                    key={index}
                    item={{ ...item, phase: item?.phase }}
                  />
                ) : null}
              </>
            );
          })}
          {lastHistoryItemPhase !== currentCheckpointData?.phase &&
          currentCheckpointData?.phase
            ? renderPhaseHeader(currentCheckpointData?.phase, false)
            : null}
          <VoteUI
            currentProposalData={currentProposalData}
            checkpointData={currentCheckpointData}
            user={user}
            reload={reload}
            setLoading={setLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Voting;
