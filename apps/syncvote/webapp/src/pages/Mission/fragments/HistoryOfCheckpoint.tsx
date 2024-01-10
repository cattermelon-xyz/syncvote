import { Card, Radio } from 'antd';
import React from 'react';
import { AuditOutlined } from '@ant-design/icons';
import { getTransformArweaveLink } from '@utils/helpers';
import { VM_TYPE } from '@utils/constants/votemachine';
import { formatDate } from '@utils/helpers';

interface Props {
  historicalCheckpointData?: any;
}

const HistoryOfCheckpoint: React.FC<Props> = ({ historicalCheckpointData }) => {
  const transformedArweaveLink = historicalCheckpointData?.arweave_id
    ? getTransformArweaveLink(historicalCheckpointData?.arweave_id)
    : null;

  const handleOpenLink = (link?: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const getDiscourseLink = (submission: any) => {
    if (submission?.linkDiscourse) {
      return submission.linkDiscourse;
    }
    if (submission?.discourse_topic) {
      return `https://discourse.syncvote.shop/p/${submission.discourse_topic}`;
    }
    return null;
  };

  return (
    <div>
      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
          <p className='text-xl font-medium truncate'>
            {historicalCheckpointData?.checkpoint_title}
          </p>
          <hr className='w-full h-px bg-gray-200 border-0 dark:bg-gray-200' />
          <div className='flex flex-col gap-1'>
            <div className='flex justify-between'>
              <p className='text-xl font-medium'>Result</p>
              <div
                className='flex items-center hover:cursor-pointer'
                onClick={() => {
                  if (transformedArweaveLink)
                    handleOpenLink(transformedArweaveLink);
                }}
              >
                <p>View proof</p>
                <AuditOutlined className='ml-1' />
              </div>
            </div>
            <p>End date: {formatDate(historicalCheckpointData?.endedAt)}</p>
          </div>

          {historicalCheckpointData?.vote_machine_type ===
          VM_TYPE?.DISCOURSE ? (
            //TODO: Update first post for discourse but name's variable is discourse_topic in historicalCheckpointData?.tallyResult?.submission.
            // It can be confusing
            <p
              className='text-[#6200EE] hover:cursor-pointer truncate'
              onClick={() => {
                const discourseLink = getDiscourseLink(
                  historicalCheckpointData?.tallyResult?.submission
                );
                if (discourseLink) handleOpenLink(discourseLink);
              }}
            >
              {getDiscourseLink(
                historicalCheckpointData?.tallyResult?.submission
              )}
            </p>
          ) : historicalCheckpointData?.vote_machine_type ===
            VM_TYPE?.SNAPSHOT ? (
            <p
              className='text-[#6200EE] hover:cursor-pointer truncate'
              onClick={() => {
                if (historicalCheckpointData?.tallyResult?.linkSnapshot)
                  handleOpenLink(
                    historicalCheckpointData?.tallyResult?.linkSnapshot
                  );
              }}
            >
              {historicalCheckpointData?.tallyResult?.linkSnapshot}
            </p>
          ) : historicalCheckpointData?.vote_machine_type ===
            VM_TYPE?.SINGLE_VOTE ? (
            <>
              {historicalCheckpointData?.options.map(
                (option: any, index: any) => {
                  const isChecked =
                    +historicalCheckpointData?.tallyResult?.index === index;
                  return (
                    <Card
                      className={`w-full ${
                        isChecked ? 'border-2 border-[#6200EE]' : ''
                      }`}
                      key={index}
                    >
                      {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                      <Radio
                        checked={
                          +historicalCheckpointData?.tallyResult?.index ===
                          index
                        }
                      >
                        {`${index + 1}. ${option}`}
                      </Radio>
                    </Card>
                  );
                }
              )}
            </>
          ) : historicalCheckpointData?.vote_machine_type === VM_TYPE?.TALLY ? (
            <p
              className='text-[#6200EE] hover:cursor-pointer truncate'
              onClick={() => {
                if (historicalCheckpointData?.tallyResult?.proposalLink)
                  handleOpenLink(
                    historicalCheckpointData?.tallyResult?.proposalLink
                  );
              }}
            >
              {historicalCheckpointData?.tallyResult?.proposalLink}
            </p>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HistoryOfCheckpoint;
