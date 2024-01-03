import { useEffect, useState } from 'react';
import { Card, Button, Timeline, Tag } from 'antd';
import { AuditOutlined, BranchesOutlined } from '@ant-design/icons';
import { createIdString, extractIdFromIdString, useGetDataHook } from 'utils';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { shortenString } from 'directed-graph';
interface Props {
  missionData: any;
}

const HistoryItem = ({ item }: { item: any }) => {
  const { endedAt, tallyResult, options, checkpoint_title, arweave_id } = item;
  // TODO: this is a hack, should use votemachine function instead
  console.log(tallyResult?.index);
  const selectedOption = tallyResult?.index
    ? options[parseInt(tallyResult?.index)]
    : null;
  const linkDiscourse = tallyResult?.submission?.linkDiscourse || null;
  const linkSnapshot = tallyResult?.linkSnapshot || null;
  console.log(item);
  return (
    <div>
      <div>
        {checkpoint_title}{' '}
        <span className='text-xs'>
          {arweave_id ? (
            <a href={arweave_id}>
              {endedAt ? moment(endedAt).fromNow() : null}
              <AuditOutlined className='ml-1' />
            </a>
          ) : null}
        </span>
      </div>
      {endedAt && (
        <div className='text-xs'>
          {selectedOption ? <Tag>{selectedOption}</Tag> : null}{' '}
          {linkDiscourse ? (
            <a href={linkDiscourse} target='_blank' className='text-green-500'>
              {shortenString(linkDiscourse, 30)}
            </a>
          ) : null}
          {linkSnapshot ? (
            <a href={linkSnapshot} target='_blank' className='text-green-500'>
              {shortenString(linkSnapshot, 30)}
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
};

const MissionProgress: React.FC<Props> = ({ missionData }) => {
  const { orgIdString } = useParams();
  const navigate = useNavigate();

  const workflowId = missionData?.workflow_id?.toString();
  const workflowTitle = missionData?.workflow_title;
  const versionIdString = missionData?.workflow_version_id;

  const publicUrl = `/public/${orgIdString}/${createIdString(
    workflowTitle,
    workflowId
  )}/${versionIdString}`;
  const items: any[] = [];
  missionData?.progress?.forEach((item: any, index: any) => {
    if (!item || item.vote_machine_type === 'joinNode') return;
    let color =
      index === missionData?.progress.length - 1 ? 'green' : '#D9D9D9';
    items.push({
      color: color,
      children: <HistoryItem item={item} />,
    });
  });

  const handleViewLiveWorkflow = () => {
    if (publicUrl) window.open(publicUrl, '_blank');
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
