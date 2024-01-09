import {
  ClockCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';
import { Button, Card, Empty, Space, Tag, message } from 'antd';
import { Icon } from 'icon';
import ShowDescription from './ShowDescription';
import ProposalDocuments from './ProposalDocuments';
import { shortenString } from 'directed-graph';
import moment from 'moment';
import axios from 'axios';
import { useEffect, useState } from 'react';

const MissionSummary = ({
  currentCheckpointData,
  missionData,
  listVersionDocs,
  dataOfAllDocs,
}: {
  currentCheckpointData: any;
  missionData: any;
  listVersionDocs: any;
  dataOfAllDocs: any;
}) => {
  const isForkNode = currentCheckpointData.vote_machine_type === 'forkNode';
  const isEnd = currentCheckpointData.isEnd;
  const isExpired =
    getTimeRemainingToEnd(currentCheckpointData.endToVote) === 'expired';
  const { created_at, workflow_icon_url } = missionData;
  console.log('missionData: ', missionData);
  const proposal = missionData?.data?.variables?.proposal;
  const [proposalContent, setProposalContent] = useState(
    proposal ? 'Loading proposal content...' : ''
  );
  useEffect(() => {
    if (proposal) {
      const url = proposal.includes('https://arweave.net/')
        ? proposal
        : `https://arweave.net/${proposal}`;
      axios.get(url).then((res) => {
        setProposalContent(res.data.raw);
      });
    }
  }, []);

  return (
    <>
      <div className='flex flex-col mb-4 gap-6'>
        <div className='flex gap-4'>
          {isForkNode || (!isExpired && !isEnd) ? (
            <Tag color='green' className='text-base'>
              Active
            </Tag>
          ) : (
            <Tag color='default' className='text-base'>
              Closed
            </Tag>
          )}
          <Button
            style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
            className='text-[#6200EE]'
            icon={<UploadOutlined />}
            onClick={() =>
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => message.success('URL copied to clipboard!'))
                .catch((err) => {
                  console.error('Failed to copy URL: ', err);
                  message.error('Failed to copy URL');
                })
            }
          >
            Share
          </Button>
        </div>
        <div className='flex items-center'>
          <Icon
            presetIcon=''
            iconUrl={workflow_icon_url}
            size='large'
            className='border border-solid border-gray-500 rounded-full'
          />
          <div className='flex flex-col ml-2'>
            <p className='font-semibold text-xl	'>{missionData.m_title}</p>
            <p>{missionData.workflow_title}</p>
          </div>
        </div>
      </div>
      <Space direction='vertical' size='middle' className='w-full'>
        <Space direction='horizontal'>
          <Icon
            iconUrl={missionData.author_icon_url}
            presetIcon=''
            size='medium'
          />
          <p>{shortenString(missionData.author_email, 30)}</p>-
          <p>{moment(created_at).format('MMM Do, YYYY')}</p>
        </Space>
        {!isExpired && !isEnd ? (
          <div className='flex flex-row gap-1 bg-violet-100 border border-violet-500 border-solid px-2 py-3 rounded-md'>
            <ClockCircleOutlined className='text-violet-500' />
            This proposal is in progress
          </div>
        ) : null}
        <ShowDescription
          titleDescription={'Proposal content'}
          description={proposalContent}
        />
        {/* {currentCheckpointData?.description ? (
          <ShowDescription
            titleDescription={'Voting Guideline'}
            description={currentCheckpointData?.description}
          />
        ) : (
          <></>
        )} */}

        {missionData?.progress && dataOfAllDocs.length > 0 && (
          <ProposalDocuments
            titleDescription={'Proposal documents'}
            missionData={missionData}
            listVersionDocs={listVersionDocs}
            dataOfAllDocs={dataOfAllDocs}
          />
        )}
      </Space>
    </>
  );
};

export default MissionSummary;
