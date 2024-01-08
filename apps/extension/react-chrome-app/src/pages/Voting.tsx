import React, { useEffect, useState } from 'react';
import { LeftOutlined, ExportOutlined } from '@ant-design/icons';
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
    console.log('currentProposalData', currentProposalData);
    console.log('currentCheckpointData', currentCheckpointData);
  }, [currentProposalData, currentCheckpointData]);
  const historyItems = currentProposalData?.progress || [];
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
            return <HistoryItem key={index} item={item} />;
          })}
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
