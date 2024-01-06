import React, { useEffect, useState } from 'react';

import { Button, Card, Tag, Input } from 'antd';
import {
  CloseCircleOutlined,
  DownOutlined,
  LeftOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Discourse from '@assets/icons/Discourse';
import { PAGE_ROUTER } from '@constants/common';
import DoneIcon from '@assets/icons/DoneIcon';
import { updateProposalDemo } from '@data/org';
import Success from '@assets/icons/Success';
import axios from 'axios';
import { trimTitle, createIdString } from '../utils';
import HistoryItem from '@components/HistoryItem';
import VoteUI from '@components/VoteUI';

interface Props {
  setPage: any;
  currentProposalData: any;
  currentCheckpointData: any;
  setCurrentProposalId: any;
  setCurrentProposalData: any;
  user: any;
}

const frontEndUrl = 'http://localhost:3001';

const Voting: React.FC<Props> = ({
  setPage,
  currentProposalData,
  currentCheckpointData,
  setCurrentProposalId,
  setCurrentProposalData,
  user,
}) => {
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
          <p className='w-full mt-3 text-[15px]'>
            {trimTitle(currentProposalData?.m_title)}
          </p>
        </div>
        <div className='mb-3 flex flex-col gap-2'>
          {historyItems.map((item: any, index: number) => {
            return <HistoryItem key={index} item={item} />;
          })}
          <VoteUI
            currentProposalData={currentProposalData}
            checkpointData={currentCheckpointData}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default Voting;
