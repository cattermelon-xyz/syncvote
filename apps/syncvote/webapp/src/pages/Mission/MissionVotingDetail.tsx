import { useEffect, useState } from 'react';
import { Card, Button, Progress, Space, Tag, Timeline, Radio } from 'antd';
import {
  UploadOutlined,
  ReloadOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { Icon } from 'icon';
import { useParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';
import ModalListParticipants from './fragments/ModalListParticipants';
import ModalVoterInfo from './fragments/ModalVoterInfo';

const MissionVotingDetail = () => {
  const { missionIdString } = useParams();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [isReachedQuorum, setIsReachedQuorum] = useState<boolean>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [openModalVoterInfo, setOpenModalVoterInfo] = useState<boolean>(false);
  const [listParticipants, setListParticipants] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchData = () => {
    queryAMissionDetail({
      missionId,
      onSuccess: (data: any) => {
        setMissionData(data);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (missionData) {
      const totalVotes = Object.values(missionData.result).reduce(
        (acc: number, vote: any) => acc + vote,
        0
      );
      if (totalVotes < missionData.quorum) {
        setIsReachedQuorum(false);
      }

      const participationObj = JSON.parse(missionData.participation);
      setListParticipants(participationObj.data);
    }
  }, [missionData, selectedOption]);

  return (
    <>
      {missionData && (
        <div className='w-[1033px] flex gap-4'>
          <div className='w-2/3'>
            <div className='flex flex-col mb-10 gap-6'>
              <div className='flex gap-4'>
                <Tag bordered={false} color='green' className='text-base'>
                  Active
                </Tag>
                <Button
                  style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
                  className='text-[#6200EE]'
                  icon={<UploadOutlined />}
                >
                  Share
                </Button>
              </div>
              <div className='flex items-center'>
                <Icon presetIcon='' iconUrl='' size='large' />
                <div className='flex flex-col ml-2'>
                  <p className='font-semibold text-xl	'>{missionData.m_title}</p>
                  <p>Investment Process</p>
                </div>
              </div>
            </div>
            <Space direction='vertical' size={16}>
              <Card className='w-[271px]'>
                <Space direction='horizontal' size={'small'}>
                  <p>Author</p>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p className='w-[168px] truncate ...'>{missionData.author}</p>
                </Space>
              </Card>
              <Card className='p-4'>
                <Space direction='vertical' size={24}>
                  <p className='text-xl font-medium'>Proposal content</p>
                  <p>{parse(missionData.desc)}</p>
                  <Button
                    style={{
                      border: 'None',
                      padding: '0px',
                      boxShadow: 'None',
                    }}
                    className=''
                  >
                    {/* <p className='text-[#6200EE]'>View more</p> */}
                  </Button>
                </Space>
              </Card>
              <Card className='p-4'>
                <div className='flex flex-col gap-6'>
                  <p className='text-xl font-medium'>Vote</p>
                  {missionData.options.map((option: any, index: any) => (
                    <Card className='w-full' key={index}>
                      <Radio
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                      >
                        {`${index + 1}. ${option}`}
                      </Radio>
                    </Card>
                  ))}
                  <Button
                    type='primary'
                    className='w-full'
                    onClick={() => setOpenModalVoterInfo(true)}
                    disabled={selectedOption ? false : true}
                  >
                    Vote
                  </Button>
                </div>
              </Card>
              <Card className='p-4'>
                <div className='flex flex-col gap-4'>
                  <p className='text-xl font-medium'>Votes</p>
                  <div className='flex'>
                    <p className='w-8/12'>Identity</p>
                    <p className='w-4/12 text-right'>Vote</p>
                  </div>
                  <div className='flex mb-4'>
                    <div className='w-8/12 flex items-center gap-2'>
                      <Icon iconUrl='' presetIcon='' size='medium' />
                      <p>limon@gmail.com</p>
                    </div>
                    <p className='w-4/12 text-right'>Yes</p>
                  </div>
                  <div className='flex mb-4'>
                    <div className='w-8/12 flex items-center gap-2'>
                      <Icon iconUrl='' presetIcon='' size='medium' />
                      <p>k2@hectagon.finance</p>
                    </div>
                    <p className='w-4/12 text-right'>Yes</p>
                  </div>
                  <div className='flex mb-4'>
                    <div className='w-8/12 flex items-center gap-2'>
                      <Icon iconUrl='' presetIcon='' size='medium' />
                      <p>tony@refine.net</p>
                    </div>
                    <p className='w-4/12 text-right'>Yes</p>
                  </div>
                </div>
                <div className='w-full flex justify-center items-center'>
                  <Button className='mt-4' icon={<ReloadOutlined />}>
                    View More
                  </Button>
                </div>
              </Card>
            </Space>
          </div>
          <div className='flex-1 flex flex-col gap-4'>
            <Card className=''>
              <p className='mb-6 text-base font-semibold'>Progress</p>
              <Timeline
                items={[
                  {
                    color: '#D9D9D9',
                    children: 'Temperature Check',
                  },
                  {
                    color: '#D9D9D9',
                    children: 'Proposal revision',
                  },
                  {
                    color: 'green',
                    children: 'Consensus Check',
                  },
                ]}
              />
              <div className='w-full flex justify-center items-center'>
                <Button className='w-full' icon={<BranchesOutlined />}>
                  View More
                </Button>
              </div>
            </Card>
            <Card className=''>
              <p className='mb-6 text-base font-semibold'>Voting results</p>
              {missionData.options.map((option: any, index: any) => {
                const totalVotes = Object.values(missionData.result).reduce(
                  (acc: number, vote: any) => acc + vote,
                  0
                );

                let percentage;
                if (missionData.quorum > totalVotes) {
                  percentage =
                    (missionData.result[option] / missionData.quorum) * 100;
                } else {
                  percentage = (missionData.result[option] / totalVotes) * 100;
                }
                percentage = parseFloat(percentage.toFixed(2));
                return (
                  <div key={index} className='flex flex-col gap-2'>
                    <p className='text-base font-semibold'>{option}</p>
                    <p className='text-base'>
                      {missionData.result[option]} votes
                    </p>
                    <Progress percent={percentage} size='small' />
                  </div>
                );
              })}
              {isReachedQuorum ? (
                <div className='w-full flex justify-center items-center mt-2'>
                  <Button className='w-full bg-[#EAF6EE] text-[#29A259]'>
                    Reached required quorum
                  </Button>
                </div>
              ) : (
                <div className='w-full flex justify-center items-center mt-2'>
                  <Button className='w-full'>Not reached quorum</Button>
                </div>
              )}
            </Card>
            <Card className=''>
              <p className='mb-4 text-base font-semibold'>Rules & conditions</p>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <p className='text-base '>Start time</p>
                  <p className='text-base font-semibold'>
                    {getTimeElapsedSinceStart(missionData.startToVote)}
                  </p>
                </div>
                <p className='text-right'>
                  {formatDate(missionData.startToVote)}
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <p className='text-base '>Remaining duration</p>
                  <p className='text-base font-semibold'>
                    {getTimeRemainingToEnd(missionData.endToVote)}
                  </p>
                </div>
                <p className='text-right'>
                  {formatDate(missionData.endToVote)}
                </p>
              </div>
              <hr className='w-full my-4' />
              <div className='flex justify-between'>
                <p className='text-base '>Who can vote</p>
                <p
                  className='text-base font-semibold text-[#6200EE] cursor-pointer'
                  onClick={() => setOpenModalListParticipants(true)}
                >
                  View details
                </p>
              </div>
              <hr className='w-full my-4' />
              <div className='flex justify-between'>
                <p className='text-base '>Threshold counted by</p>
                <p className='text-base font-semibold'>Total votes made</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-base '>Threshold</p>
                <p className='text-base font-semibold'>51 votes</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-base '>Quorum</p>
                <p className='text-base font-semibold'>
                  {missionData.quorum} votes
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
      <ModalListParticipants
        open={openModalListParticipants}
        onClose={() => setOpenModalListParticipants(false)}
        listParticipants={listParticipants}
      />
      <ModalVoterInfo
        option={[selectedOption]}
        open={openModalVoterInfo}
        onClose={() => setOpenModalVoterInfo(false)}
        missionId={missionId}
      />
    </>
  );
};

export default MissionVotingDetail;
