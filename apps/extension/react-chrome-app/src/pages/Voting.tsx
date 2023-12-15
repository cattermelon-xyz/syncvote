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

interface Props {
  setPage: any;
  currentProposalData: any;
  currentCheckpointData: any;
  setCurrentProposalId: any;
  setCurrentProposalData: any;
}

const frontEndUrl = 'http://localhost:3001';

const Voting: React.FC<Props> = ({
  setPage,
  currentProposalData,
  currentCheckpointData,
  setCurrentProposalId,
  setCurrentProposalData,
}) => {
  const [openDescDiscuss, setOpenDescDiscuss] = useState(false);
  const handleOpenDescDiscuss = () => setOpenDescDiscuss(!openDescDiscuss);

  useEffect(() => {
    console.log('currentProposalData', currentProposalData);
    console.log('currentCheckpointData', currentCheckpointData);
  }, [currentProposalData, currentCheckpointData]);

  const handlePostDiscourse = async () => {
    await chrome.runtime.sendMessage({
      action: 'handlePostDiscourse',
      payload: {
        url: `${frontEndUrl}/${createIdString(
          currentProposalData?.org_title,
          currentProposalData?.org_id
        )}/${createIdString(
          currentProposalData?.m_title,
          currentProposalData?.mission_id
        )}`,
      },
    });
  };

  return (
    <div className='pb-2'>
      <div>
        <LeftOutlined
          onClick={() => {
            setPage(PAGE_ROUTER.HOME_PAGE);
            setCurrentProposalData(null);
            setCurrentProposalId(-1);
          }}
        />
        <p className='w-full mt-3 text-[15px]'>
          {trimTitle(currentProposalData?.title)}
        </p>
        {/* <p
          className='w-full mt-2 text-[10px] cursor-pointer text-[#6200EE]'
          onClick={() => openInNewTab(urlViewWorkflow)}
        >
          View workflow on Syncvote
        </p> */}
        <div className='mb-3'>
          <Card
            className='w-full mt-9 flex flex-col  bg-white rounded-lg'
            bodyStyle={{ padding: '12px' }}
          >
            <div className='flex flex-col gap-1'>
              {/* {currentProposalData?.discourse_topic_id !== null ? (
                <p className='text-[10px]'>Completed</p>
              ) : (
                <></>
              )} */}
              <div className='flex justify-between items-center'>
                <p className='text-[13px] font-semibold'>Idea discussion</p>
                {openDescDiscuss ? (
                  <UpOutlined onClick={handleOpenDescDiscuss} />
                ) : (
                  <DownOutlined onClick={handleOpenDescDiscuss} />
                )}
              </div>
            </div>
            {openDescDiscuss && (
              <div>
                <hr className='my-2' />
                <p>
                  Share a post in the Governance forum following this guideline
                </p>
              </div>
            )}
          </Card>
          {/* {currentProposalData?.discourse_topic_id !== null ? (
            <Card className='w-full mt-1' bodyStyle={{ padding: '12px' }}>
              {currentProposalData.status !== 'idea_discussion' ? (
                <div className='mb-2'>
                  <Tag color='green'>Success</Tag>
                </div>
              ) : null}
              <div className='flex'>
                <DoneIcon />
                <p
                  className='w-[190px] ml-1 text-[10px] cursor-pointer truncate ... '
                  onClick={() =>
                    openInNewTab(currentProposalData?.discourse_topic_id)
                  }
                >
                  {currentProposalData?.discourse_topic_id}
                </p>
              </div>
            </Card>
          ) : ( */}
          <Button
            className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
            type='primary'
            onClick={handlePostDiscourse}
          >
            <Discourse />
            <p className='text-[13px] ml-[2px]'>
              Create a Proposal on Discourse
            </p>
          </Button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Voting;
