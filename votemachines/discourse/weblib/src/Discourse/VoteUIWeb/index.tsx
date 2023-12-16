import { Button, Input, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { TextEditor } from 'rich-text-editor';

interface Props {
  currentCheckpointData: any;
  setSubmission: any;
  setOpenModalVoterInfo: any;
}

const VoteUIWeb = (props: Props): JSX.Element => {
  const {
    currentCheckpointData,
    setSubmission,
    setOpenModalVoterInfo,
  } = props;

  const [title, setTitle] = useState<any>();
  const [missionDesc, setMissionDesc] = useState<any>();

  useEffect(() => {
    console.log('currentCheckpointData', currentCheckpointData);
  }, [currentCheckpointData]);

  const handleConfirm = () => {
    const submissionData = {
      action: currentCheckpointData?.data?.action,
      variable: currentCheckpointData?.data?.variables[0],
      title,
      raw: missionDesc,
    };
    setSubmission(submissionData);
    setOpenModalVoterInfo(true);
  };

  return (
    <>
      <p className='text-xl font-medium'>Checkpoint requirements</p>
      <div className='flex flex-col gap-4 mt-5'>
        <Space direction='vertical' className='w-full'>
          <div className='text-sm text-[#575655]'>Title discourse </div>
          <div>
            <Input
              className='w-full'
              placeholder={'Governance revision'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='text-sm text-[#575655] mb-2'>
            Proposal description
          </div>
          <div>
            <TextEditor
              value={missionDesc}
              setValue={(val: any) => {
                setMissionDesc(val);
              }}
              id='text-editor'
            />
          </div>
          <Button
            type='primary'
            className='w-full'
            onClick={handleConfirm}
            // disabled={
            //   selectedOption &&
            //   getTimeRemainingToEnd(currentCheckpointData.endToVote) !=
            //     'expired'
            //     ? false
            //     : true
            // }
          >
            Confirm
          </Button>
        </Space>
      </div>
    </>
  );
};

export default VoteUIWeb;
