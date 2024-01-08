import { UploadOutlined } from '@ant-design/icons';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';
import { Button, Card, Space, Tag, message } from 'antd';
import { Icon } from 'icon';
import ShowDescription from './ShowDescription';
import ProposalDocuments from './ProposalDocuments';
import { shortenString } from 'directed-graph';
import moment from 'moment';

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
  return (
    <>
      <div className='flex flex-col mb-10 gap-6'>
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
          <Card>
            <Space direction='horizontal' size={'small'}>
              <p>Author</p>
              <Icon
                iconUrl={missionData.author_icon_url}
                presetIcon=''
                size='medium'
              />
              <p>{shortenString(missionData.author_email, 30)}</p>
            </Space>
          </Card>
          <Card>
            <Space direction='horizontal' size={'small'}>
              <p>Created On</p>
              <p>{moment(created_at).format('MMM Do, YYYY')}</p>
            </Space>
          </Card>
        </Space>

        <ShowDescription
          titleDescription={'Proposal content'}
          description={missionData?.m_desc}
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
