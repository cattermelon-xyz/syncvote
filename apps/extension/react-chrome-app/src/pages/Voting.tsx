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
import Success from '@assets/icons/Success';
import axios from 'axios';
import { trimTitle } from '../utils';

interface Props {
  setPage: any;
  currentProposalData: any;
  setCurrentProposalId: any;
  setCurrentProposalData: any;
}

const Voting: React.FC<Props> = ({
  setPage,
  currentProposalData,
  setCurrentProposalId,
  setCurrentProposalData,
}) => {
  const [openDescDiscuss, setOpenDescDiscuss] = useState(false);
  const [openDescTempCheck, setOpenDescTempCheck] = useState(false);
  const [openDescFormalization, setOpenDescFormalization] = useState(false);
  const [openDescOnchainVoting, setOpenDescOnchainVoting] = useState(false);
  const handleOpenDescDiscuss = () => setOpenDescDiscuss(!openDescDiscuss);
  const handleOpenDescTempCheck = () =>
    setOpenDescTempCheck(!openDescTempCheck);
  const handleOpenDescFormalization = () =>
    setOpenDescFormalization(!openDescFormalization);
  const handleOpenDescOnchainVoting = () =>
    setOpenDescOnchainVoting(!openDescOnchainVoting);

  const frontEndUrl = 'https://main.syncvote.com';
  const backEndUrl = 'https://syncvote-test.onrender.com/api';
  const urlViewWorkflow =
    'https://main.syncvote.com/public/idle-governance-process-229/idle-dao-governance-process-300/320';

  const handlePostDiscourse = async () => {
    await chrome.runtime.sendMessage({
      action: 'handlePostDiscourse',
      payload: {
        url: `${frontEndUrl}/demo/create_topic/${currentProposalData.id}`,
      },
    });
  };

  const handleCreateSnapshotIdle = async () => {
    await chrome.runtime.sendMessage({
      action: 'handleCreateSnapshotIdle',
      payload: {
        url: `${frontEndUrl}/demo/create_snapshot/${currentProposalData.id}?type=idle`,
      },
    });
  };

  const handleCreateSnapshotStIdle = async () => {
    await chrome.runtime.sendMessage({
      action: 'handleCreateSnapshotStIdle',
      payload: {
        url: `${frontEndUrl}/demo/create_snapshot/${currentProposalData.id}?type=stidle`,
      },
    });
  };

  const handleMoveDiscourse = async () => {
    updateProposalDemo({
      demoProposalId: currentProposalData?.id,
      status: 'onchain_voting',
      onSuccess: (data) => {
        console.log('update proposal success', data);
        setCurrentProposalData(data);
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  };

  const handleCreateTally = async () => {
    await chrome.runtime.sendMessage({
      action: 'handleCreateTally',
      payload: { url: 'https://www.google.com.vn/?hl=vi' },
    });
  };

  const handleMoveToTempCheck = async () => {
    updateProposalDemo({
      demoProposalId: currentProposalData?.id,
      status: 'temperature_check',
      onSuccess: (data) => {
        console.log('update proposal success', data);
        setCurrentProposalData(data);
      },
      onError: (error) => {
        console.log('error', error);
      },
    });

    // call back-end and move to formal proposal
    const discourseData = {
      name_category: 'Formal Proposal',
      mission_id: currentProposalData?.id,
    };
    const response = await axios.post(
      `${backEndUrl}/api/demo/update-category`,
      discourseData
    );

    console.log('response update category', response.data);
  };

  const openInNewTab = (url: any) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    console.log('currentProposalData in voting page', currentProposalData);
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

  return (
    <div>
      {/* UI for idea_discussion */}
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
        <p
          className='w-full mt-2 text-[10px] cursor-pointer text-[#6200EE]'
          onClick={() => openInNewTab(urlViewWorkflow)}
        >
          View workflow on Syncvote
        </p>
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
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handlePostDiscourse}
            >
              <Discourse />
              <p className='text-[13px] ml-[2px]'>
                Create a topic on Discourse
              </p>
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
              {currentProposalData?.snapshot_idle_status === 'Done' ? (
                <Tag color='green'>Success</Tag>
              ) : (
                <Tag color='orange'>Ongoing</Tag>
              )}
              <div className='flex mt-2'>
                <DoneIcon />
                <p
                  className='w-[190px] ml-1 text-[10px] cursor-pointer truncate ...'
                  onClick={() =>
                    openInNewTab(currentProposalData?.snapshot_idle_id)
                  }
                >
                  {currentProposalData?.snapshot_idle_id}
                </p>
              </div>
            </Card>
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handleCreateSnapshotIdle}
            >
              {/* <Discourse /> */}
              <p className='text-[13px] ml-[2px]'>Create a Snapshot IDLE</p>
            </Button>
          )}
          {currentProposalData?.snapshot_stidle_id !== null ? (
            <Card
              className='w-full mt-1 flex flex-col'
              bodyStyle={{ padding: '12px' }}
            >
              {currentProposalData?.snapshot_stidle_status === 'Done' ? (
                <Tag color='green'>Success</Tag>
              ) : (
                <Tag color='orange'>Ongoing</Tag>
              )}
              <div className='flex mt-2'>
                <DoneIcon />
                <p
                  className='w-[190px] ml-1 text-[10px] cursor-pointer truncate ...'
                  onClick={() =>
                    openInNewTab(currentProposalData?.snapshot_stidle_id)
                  }
                >
                  {currentProposalData?.snapshot_stidle_id}
                </p>
              </div>
            </Card>
          ) : (
            <Button
              className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
              type='primary'
              onClick={handleCreateSnapshotStIdle}
            >
              {/* <Discourse /> */}
              <p className='text-[13px] ml-[2px]'>Create a Snapshot stkIDLE</p>
            </Button>
          )}
          {currentProposalData?.snapshot_stidle_id !== null &&
          currentProposalData?.snapshot_idle_id !== null ? (
            <></>
          ) : (
            <Button
              className='h-[38px] w-full mb-[18px] flex justify-center items-center my-2'
              type='default'
              size='large'
              icon={<CloseCircleOutlined />}
            >
              <p className='text-[13px]'>Abandon</p>
            </Button>
          )}
        </div>
      )}
      {/* UI for proposal_formalization */}
      {currentProposalData?.status !== 'idea_discussion' &&
        currentProposalData?.status !== 'temperature_check' && (
          <div className='mt-2'>
            <hr className='mb-2' />
            <Card
              className='w-full flex flex-col  bg-white rounded-lg'
              bodyStyle={{ padding: '12px' }}
            >
              <div className='flex flex-col gap-1'>
                {currentProposalData?.status === 'onchain_voting' ||
                currentProposalData?.status === 'execution' ? (
                  <p className='text-[10px]'>Completed</p>
                ) : (
                  <></>
                )}
                <div className='flex justify-between items-center'>
                  <p className='text-[13px] font-semibold'>
                    Proposal Formalization
                  </p>
                  {openDescFormalization ? (
                    <UpOutlined onClick={handleOpenDescFormalization} />
                  ) : (
                    <DownOutlined onClick={handleOpenDescFormalization} />
                  )}
                </div>
              </div>
              {openDescFormalization && (
                <div>
                  <hr className='my-2' />
                  <p>
                    Move your proposal to the Formal Proposals category on
                    Forum.
                  </p>
                </div>
              )}
            </Card>
            {currentProposalData?.status === 'onchain_voting' ||
            currentProposalData?.status === 'execution' ? (
              <Card
                className='w-full mt-1 flex flex-col'
                bodyStyle={{ padding: '12px' }}
              >
                <div className='flex mt-2'>
                  <DoneIcon />
                  <p
                    className='w-[190px] ml-1 text-[10px] cursor-pointer truncate ...'
                    onClick={() =>
                      openInNewTab(currentProposalData?.discourse_topic_id)
                    }
                  >
                    {currentProposalData?.discourse_topic_id}
                  </p>
                </div>
              </Card>
            ) : (
              <Button
                className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
                type='primary'
                onClick={handleMoveDiscourse}
              >
                <Discourse />
                <p className='text-[13px] ml-[2px] w-[190px] truncate ...'>
                  Update and move topic on Discourse
                </p>
              </Button>
            )}
            {currentProposalData?.status === 'onchain_voting' ||
            currentProposalData?.status === 'execution' ? (
              <></>
            ) : (
              <Button
                className='h-[38px] w-full mb-[18px] flex justify-center items-center my-2'
                type='default'
                size='large'
                icon={<CloseCircleOutlined />}
              >
                <p className='text-[13px]'>Abandon</p>
              </Button>
            )}
          </div>
        )}
      {/* UI for onchain_voting */}
      {currentProposalData?.status !== 'idea_discussion' &&
        currentProposalData?.status !== 'temperature_check' &&
        currentProposalData?.status !== 'proposal_formalization' && (
          <div className='mt-2'>
            <hr className='mb-2' />
            <Card
              className='w-full flex flex-col  bg-white rounded-lg'
              bodyStyle={{ padding: '12px' }}
            >
              <div className='flex flex-col gap-1'>
                {currentProposalData?.tally_id ? (
                  <p className='text-[10px]'>Completed</p>
                ) : (
                  <></>
                )}
                <div className='flex justify-between items-center'>
                  <p className='text-[13px] font-semibold'>
                    IDLE on-chain voting
                  </p>
                  {openDescOnchainVoting ? (
                    <UpOutlined onClick={handleOpenDescOnchainVoting} />
                  ) : (
                    <DownOutlined onClick={handleOpenDescOnchainVoting} />
                  )}
                </div>
              </div>
              {openDescOnchainVoting && (
                <div>
                  <hr className='my-2' />
                  <div className='flex flex-col gap-1'>
                    <p>
                      1. Move your proposal to the Formal Proposals category on
                      Forum.
                    </p>
                    <p>2. Create an on-chain proposal on Tally.</p>
                    <p>
                      3. Create a proposal with content following the template
                      in the Note below.
                    </p>
                    <p>
                      4. Set up the poll with parameters defined in below rules
                      & conditions.
                    </p>
                    <p>
                      5. Include a link to the updated governance post as a
                      reference.
                    </p>
                    <p>6. Include executable code.</p>
                    <p>
                      7. Include links to the voting pools (IDLE and stkIDLE) as
                      a reply to your IIP post.
                    </p>
                  </div>
                </div>
              )}
            </Card>
            {currentProposalData?.tally_id !== null ? (
              <Card
                className='w-full mt-1 flex flex-col'
                bodyStyle={{ padding: '12px' }}
              >
                {currentProposalData?.tally_status === 'Done' ? (
                  <Tag color='green'>Success</Tag>
                ) : (
                  <Tag color='orange'>Ongoing</Tag>
                )}
                <div className='flex mt-2'>
                  <DoneIcon />
                  <p
                    className='w-[190px] ml-1 text-[10px] cursor-pointer truncate ...'
                    onClick={() => openInNewTab(currentProposalData?.tally_id)}
                  >
                    {currentProposalData?.tally_id}
                  </p>
                </div>
              </Card>
            ) : (
              <Button
                className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
                type='primary'
                onClick={handleCreateTally}
              >
                {/* <Discourse /> */}
                <p className='text-[13px] ml-[2px]'>Create a Tally proposal</p>
              </Button>
            )}
            {currentProposalData?.tally_id !== null ? (
              <></>
            ) : (
              <Button
                className='h-[38px] w-full mb-[18px] flex justify-center items-center my-2'
                type='default'
                size='large'
                icon={<CloseCircleOutlined />}
              >
                <p className='text-[13px]'>Abandon</p>
              </Button>
            )}
          </div>
        )}

      {/* UI for Execution */}
      {currentProposalData?.status === 'execution' && (
        <div className='mt-2'>
          <hr className='mb-2' />
          <Card
            className='w-full flex flex-col  bg-white rounded-lg'
            bodyStyle={{ padding: '12px' }}
          >
            <div className='flex flex-col gap-1'>
              {currentProposalData?.tally_id ? (
                <p className='text-[10px]'>Completed</p>
              ) : (
                <></>
              )}
              <div className='flex justify-between items-center'>
                <p className='text-[13px] font-semibold text-left'>Execution</p>
                {/* {openDescOnchainVoting ? (
                  <UpOutlined onClick={handleOpenDescOnchainVoting} />
                ) : (
                  <DownOutlined onClick={handleOpenDescOnchainVoting} />
                )} */}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Voting;
