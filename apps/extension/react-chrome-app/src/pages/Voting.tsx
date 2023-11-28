import { Button, Card, Tag } from 'antd';
import {
  CloseCircleOutlined,
  DownOutlined,
  LeftOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Discourse from '@assets/icons/Discourse';
import { useEffect, useState } from 'react';
import { PAGE_ROUTER } from '@constants/common';
import DoneIcon from '@assets/icons/DoneIcon';
import { updateProposalDemo } from '@data/org';

interface Props {
  setPage: any;
  currentProposalData: any;
  setCurrentProposalId: any;
  refreshPage: any;
}

const Voting: React.FC<Props> = ({
  setPage,
  currentProposalData,
  setCurrentProposalId,
  refreshPage,
}) => {
  const [openDescDiscuss, setOpenDescDiscuss] = useState(false);
  const [openDescTempCheck, setOpenDescTempCheck] = useState(false);
  const handleOpenDescDiscuss = () => setOpenDescDiscuss(!openDescDiscuss);
  const handleOpenDescTempCheck = () =>
    setOpenDescTempCheck(!openDescTempCheck);

  const handlePostDiscourse = async () => {
    await chrome.runtime.sendMessage({
      action: 'handlePostDiscourse',
      payload: { url: 'https://www.google.com.vn/?hl=vi' },
    });
  };

  const handleCreateSnapshot = async () => {
    await chrome.runtime.sendMessage({
      action: 'handleCreateSnapshot',
      payload: { url: 'https://www.google.com.vn/?hl=vi' },
    });
  };

  const handleMoveToTempCheck = async () => {
    updateProposalDemo({
      demoProposalId: currentProposalData?.id,
      status: 'temperature_check',
      onSuccess: (data) => {
        console.log('update proposal success', data);
        refreshPage();
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  };

  useEffect(() => {
    console.log('currentProposalData in voting page', currentProposalData);
  }, [currentProposalData]);

  return (
    <div>
      {/* UI for idea_discussion */}
      <div>
        <LeftOutlined
          onClick={() => {
            setPage(PAGE_ROUTER.HOME_PAGE);
          }}
        />
        <p className='w-full mt-3 text-[15px]'>{currentProposalData?.title}</p>
        <div className='mb-3'>
          <Card
            className='w-full mt-9 flex flex-col  bg-white rounded-lg'
            bodyStyle={{ padding: '12px' }}
          >
            <div className='flex flex-col gap-1'>
              {currentProposalData?.discourse_topic_id !== null ? (
                <p className='text-[10px]'>Completed</p>
              ) : (
                <></>
              )}
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
          {currentProposalData?.discourse_topic_id !== null ? (
            <Card className='w-full mt-1' bodyStyle={{ padding: '12px' }}>
              <div className='flex'>
                <DoneIcon />
                <p className='w-[190px] ml-1 text-[10px] truncate ...'>
                  {currentProposalData?.discourse_topic_id}
                </p>
              </div>
            </Card>
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handlePostDiscourse}
            >
              <Discourse />
              <p className='text-[13px] ml-[2px]'>Create a post on Discourse</p>
            </Button>
          )}
        </div>
        {currentProposalData?.status === 'idea_discussion' && (
          <div className='w-full'>
            <Button
              className='h-[38px] w-full mt-3 text-[13px]'
              type='primary'
              disabled={
                currentProposalData?.status === 'idea_discussion' &&
                currentProposalData?.discourse_topic_id !== null
                  ? false
                  : true
              }
              onClick={async () => {
                await handleMoveToTempCheck();
              }}
            >
              Move to the next checkpoint
            </Button>

            <Button
              className='h-[38px] w-full mb-[18px] flex justify-center items-center mt-1'
              type='default'
              size='large'
              icon={<CloseCircleOutlined />}
            >
              <p className='text-[13px]'>Abandon</p>
            </Button>
          </div>
        )}
      </div>
      {/* UI for temperature_check */}
      {currentProposalData?.status !== 'idea_discussion' && (
        <div className='mt-2'>
          <hr className='mb-2' />
          <Card
            className='w-full flex flex-col  bg-white rounded-lg'
            bodyStyle={{ padding: '12px' }}
          >
            <div className='flex flex-col gap-1'>
              {currentProposalData?.snapshot_idle_id &&
              currentProposalData?.snapshot_stidle_id ? (
                <p className='text-[10px]'>Completed</p>
              ) : (
                <></>
              )}
              <div className='flex justify-between items-center'>
                <p className='text-[13px] font-semibold'>Temperature Check</p>
                {openDescTempCheck ? (
                  <UpOutlined onClick={handleOpenDescTempCheck} />
                ) : (
                  <DownOutlined onClick={handleOpenDescTempCheck} />
                )}
              </div>
            </div>
            {openDescTempCheck && (
              <div>
                <hr className='my-2' />
                <p>Open Snapshot pools for IDLE and stkIDLE</p>
              </div>
            )}
          </Card>
          {currentProposalData?.snapshot_idle_id !== null ? (
            <Card
              className='w-full mt-1 flex flex-col'
              bodyStyle={{ padding: '12px' }}
            >
              <Tag color='orange'>Ongoing</Tag>
              <div className='flex mt-[2px]'>
                <DoneIcon />
                <p className='w-[190px] ml-1 text-[10px] truncate ...'>
                  {currentProposalData?.snapshot_idle_id}
                </p>
              </div>
            </Card>
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handleCreateSnapshot}
            >
              {/* <Discourse /> */}
              <p className='text-[13px] ml-[2px]'>Create a Snapshot IDLE</p>
            </Button>
          )}
          {currentProposalData?.snapshot_stidle_id !== null ? (
            <Card
              className='w-full mt-1 flex flex-col '
              bodyStyle={{ padding: '12px' }}
            >
              <Tag color='orange'>Ongoing</Tag>
              <div className='flex mt-[2px]'>
                <DoneIcon />
                <p className='w-[190px] ml-1 text-[10px] truncate ...'>
                  {currentProposalData?.snapshot_stidle_id}
                </p>
              </div>
            </Card>
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handleCreateSnapshot}
            >
              {/* <Discourse /> */}
              <p className='text-[13px] ml-[2px]'>Create a Snapshot stkIDLE</p>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Voting;
