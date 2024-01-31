import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  ExportOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { PAGE_ROUTER } from '@constants/common';
import { openMissionPage, openWorkflowPage, shortenString } from '../utils';
import HistoryItem from '@components/HistoryItem';
import VoteUI from '@components/VoteUI';
import moment from 'moment';
import { MissionStatusTag } from '@components/MissionStatusTag';
import { Divider } from 'antd';

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
  const {
    workflow_id,
    workflow_version_id,
    org_id,
    mission_id,
    created_at,
    author_full_name,
  } = currentProposalData;
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
  const renderPhaseHeader = (
    phase: string,
    completed: boolean,
    startAt: any,
    endedAt?: any
  ) => {
    const expanded = expandedPhases.indexOf(phase) !== -1;
    return (
      <>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row justify-between items-start'>
            <div className='flex flex-row items-center pl-1'>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center'>
                  {completed ? (
                    <div className='rounded-full w-[8px] h-[8px] bg-gray-400'></div>
                  ) : (
                    <div className='rounded-full w-[8px] h-[8px] bg-[#6200EE]'></div>
                  )}
                  <div className='ml-[12px] font-semibold text-base'>
                    {shortenString(phase, 25)}
                  </div>
                </div>
                {completed ? (
                  <div className='text-xs text-gray-600 ml-[20px]'>
                    {moment(endedAt || '').format('MMM DD, hh:mm A')}
                  </div>
                ) : null}
              </div>
            </div>
            {completed ? (
              <div
                className='text-[12px] w-[28px] h-[28px] bg-white text-center items-center rounded hover:shadow-xl cursor-pointer'
                style={{ paddingTop: '8px' }}
                onClick={() => {
                  if (expanded) {
                    setExpandedPhases(
                      expandedPhases.filter((p) => p !== phase)
                    );
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
      </>
    );
  };
  const lastCkPofPhaseEndedAt = (phase: string) => {
    const ckps = currentProposalData?.progress.filter(
      (ckp: any) => ckp.phase === phase
    );
    const lastChkp = ckps[ckps.length - 1];
    return lastChkp.endedAt;
  };
  return (
    <div className='pb-2 text-gray-600'>
      <div>
        <div className='flex flex-col mb-9'>
          <div className='flex flex-row justify-between mb-6'>
            <LeftOutlined
              className='text-base cursor-pointer'
              onClick={() => {
                setPage(PAGE_ROUTER.HOME_PAGE);
                setCurrentProposalData(null);
                setCurrentProposalId(-1);
              }}
            />
            <span
              className='underline font-medium cursor-pointer text-xs'
              onClick={() => {
                openWorkflowPage(
                  org_id,
                  workflow_id,
                  workflow_version_id,
                  'overview'
                );
              }}
            >
              Open workflow page
            </span>
          </div>
          <div className='mb-3'>
            <MissionStatusTag user={user} mission={currentProposalData} />
          </div>
          <div>
            <p
              // onClick={() => {
              //   openMissionPage(org_id, mission_id);
              // }}
              className='w-full pl-1 mb-3 text-xl text-gray-700 font-bold'
            >
              {shortenString(currentProposalData?.m_title)}
              {/* <ExportOutlined className='ml-1' /> */}
            </p>
            <div className='text-xs pl-1 text-gray-500 font-medium'>
              {moment(created_at).format('MMM DD, YYYY h:mm A')} &bull;{' '}
              {shortenString(author_full_name, 15)}
            </div>
          </div>
        </div>
        <div className='mb-3 flex flex-col gap-3'>
          {historyItems.map((item: any, index: number) => {
            lastPhase = index !== 0 ? historyItems[index - 1].phase : '';
            return (
              <>
                {index !== 0 && lastPhase !== item?.phase ? (
                  <Divider className='my-2' />
                ) : null}
                {item?.phase && (index === 0 || lastPhase !== item?.phase)
                  ? renderPhaseHeader(
                      item.phase,
                      runningPhase !== item?.phase ? true : false,
                      // TODO: possible err if checkpoint starting is delayed
                      item.startToVote,
                      runningPhase !== item?.phase
                        ? lastCkPofPhaseEndedAt(item.phase)
                        : null
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
          {currentCheckpointData?.phase &&
          lastHistoryItemPhase !== currentCheckpointData?.phase
            ? renderPhaseHeader(
                currentCheckpointData?.phase,
                false,
                // TODO: possible err if checkpoint starting is delayed
                currentCheckpointData?.created_at
              )
            : null}
          {historyItems.length > 1 ? <Divider className='my-2' /> : null}
          <VoteUI
            currentProposalData={currentProposalData}
            checkpointData={currentCheckpointData}
            user={user}
            reload={reload}
            setLoading={setLoading}
            isFirstCheckPoint={historyItems.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Voting;
