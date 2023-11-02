import { useEffect, useState } from 'react';
import { Card, Button, Timeline } from 'antd';
import { BranchesOutlined } from '@ant-design/icons';
import { createIdString, extractIdFromIdString, useGetDataHook } from 'utils';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  missionData: any;
}

const MissionProgress: React.FC<Props> = ({ missionData }) => {
  const { orgIdString } = useParams();
  const navigate = useNavigate();

  const workflowId = missionData?.workflow_id?.toString();
  const workflowTitle = missionData?.workflow_title;
  const versionIdString = missionData?.workflow_version_id;

  const publicUrl = `/public/${orgIdString}/${createIdString(workflowTitle, workflowId)}/${versionIdString}`
  

  const items = missionData?.progress?.map((item: any, index: any) => {
    let color = index === missionData?.progress.length - 1 ? 'green' : '#D9D9D9';
    return {
      color: color,
      children: item.checkpoint_title,
    };
  }) || [];

  const handleViewLiveWorkflow = () => {
    if (publicUrl) navigate(publicUrl);
  };

  return (
    <Card>
      <p className='mb-6 text-base font-semibold'>Progress</p>
      <Timeline items={items} />
      <div className='w-full flex justify-center items-center'>
        <Button
          className='w-full'
          icon={<BranchesOutlined />}
          onClick={handleViewLiveWorkflow}
        >
          View live workflow
        </Button>
      </div>
    </Card>
  );
};

export default MissionProgress;
