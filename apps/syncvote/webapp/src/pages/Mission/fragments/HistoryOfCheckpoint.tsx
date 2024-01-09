import { Button, Card, Radio } from 'antd';
import React from 'react';
import { AuditOutlined } from '@ant-design/icons';
import { getTransformArweaveLink } from '@utils/helpers';
import { VM_TYPE } from '@utils/constants/votemachine';

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

  return (
    <div>
      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
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
          {historicalCheckpointData?.vote_machine_type ===
          VM_TYPE?.DISCOURSE ? (
            <p
              className='text-[#6200EE] hover:cursor-pointer truncate'
              onClick={() => {
                if (
                  historicalCheckpointData?.tallyResult?.submission
                    ?.linkDiscourse
                )
                  handleOpenLink(
                    historicalCheckpointData?.tallyResult?.submission
                      ?.linkDiscourse
                  );
              }}
            >
              {historicalCheckpointData?.tallyResult?.submission?.linkDiscourse}
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
                (option: any, index: any) => (
                  <Card className='w-full' key={index}>
                    {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                    <Radio
                      checked={
                        +historicalCheckpointData?.tallyResult?.index === index
                      }
                    >
                      {`${index + 1}. ${option}`}
                    </Radio>
                  </Card>
                )
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HistoryOfCheckpoint;
