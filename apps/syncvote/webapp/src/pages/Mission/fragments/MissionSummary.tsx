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
  return (
    <>
      <div className='flex flex-col mb-10 gap-6'>
        <div className='flex gap-4'>
          {!currentCheckpointData.isEnd &&
          getTimeRemainingToEnd(currentCheckpointData.endToVote) !=
            'expired' ? (
            <Tag bordered={false} color='green' className='text-base '>
              Active
            </Tag>
          ) : (
            <Tag bordered={false} color='default' className='text-base'>
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
          <Icon presetIcon='' iconUrl='' size='large' />
          <div className='flex flex-col ml-2'>
            <p className='font-semibold text-xl	'>{missionData.m_title}</p>
            <p>{missionData.workflow_title}</p>
          </div>
        </div>
      </div>
      <Space direction='vertical' size='middle' className='w-full'>
        <Space direction='horizontal'>
          <Card className='w-[271px]'>
            <Space direction='horizontal' size={'small'}>
              <p>Author</p>
              <Icon iconUrl='' presetIcon='' size='medium' />
              <p className='w-[168px] truncate ...'>{missionData.author}</p>
            </Space>
          </Card>
        </Space>

        <ShowDescription
          titleDescription={'Proposal content'}
          description={missionData?.m_desc}
        />
        <ShowDescription
          titleDescription={'Checkpoint description'}
          description={currentCheckpointData?.description}
          bgColor='bg-[#F6F6F6]'
        />
        {missionData?.progress && (
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
