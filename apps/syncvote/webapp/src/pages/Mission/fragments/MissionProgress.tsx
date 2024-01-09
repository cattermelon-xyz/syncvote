import { useEffect, useState } from 'react';
import { Card, Button, Timeline, Tag } from 'antd';
import {
  AuditOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { createIdString, extractIdFromIdString, useGetDataHook } from 'utils';
import { getTransformArweaveLink } from '@utils/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { shortenString } from 'directed-graph';

interface Props {
  missionData: any;
  setHistoricalCheckpointData?: any;
}

const HistoryItem = ({
  item,
  setHistoricalCheckpointData,
  isSelected,
  onSelectItem,
}: {
  item: any;
  setHistoricalCheckpointData?: any;
  isSelected?: boolean;
  onSelectItem?: any;
}) => {
  const { endedAt, tallyResult, options, checkpoint_title, arweave_id } = item;
  // TODO: this is a hack, should use votemachine function instead
  const selectedOption = tallyResult?.index
    ? options[parseInt(tallyResult?.index)]
    : null;
  const linkDiscourse = tallyResult?.submission?.linkDiscourse || null;
  const linkSnapshot = tallyResult?.linkSnapshot || null;
  const transformedArweaveLink = arweave_id
    ? getTransformArweaveLink(arweave_id)
    : null;

  return (
    <div
      className={`p-1 rounded-md ${
        isSelected ? 'bg-gray-100' : 'hover:bg-gray-100'
      } cursor-pointer`}
      onClick={() => {
        onSelectItem(item?.id);
        item.endedAt
          ? setHistoricalCheckpointData(item)
          : setHistoricalCheckpointData(null);
      }}
    >
      <div className={!endedAt ? 'font-bold' : ''}>
        <div>
          {checkpoint_title}{' '}
          <span className='text-xs'>
            {transformedArweaveLink ? (
              <a href={transformedArweaveLink} target='_blank'>
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
              <a
                href={linkDiscourse}
                target='_blank'
                className='text-green-500'
              >
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
    </div>
  );
};

const buildFutureHappyNode = ({
  checkpoints,
  current,
  existed,
}: {
  checkpoints: any;
  current: any;
  existed: any;
}) => {
  const originCheckpointId = current.checkpoint_id.replace(
    current.mission_id + '-',
    ''
  );
  const originCheckpoint = (checkpoints || []).find(
    (item: any) => item.id === originCheckpointId
  );
  let happyNodes: any[] = [];
  const pickNextHappyPathNode = (
    cp: any,
    checkpoints: any,
    happyNodes: any
  ) => {
    if (cp.isEnd) return;
    for (var i = 0; i < cp.children.length; i++) {
      var child = checkpoints.find((item: any) => item.id === cp.children[i]);
      if (child.inHappyPath === true) {
        const found =
          happyNodes.find((item: any) => item.id === child.id) ||
          existed.find((id: any) => id === child.id);
        if (!found) {
          happyNodes.push(child);
          pickNextHappyPathNode(child, checkpoints, happyNodes);
        }
      }
    }
  };
  if (originCheckpoint && originCheckpoint.inHappyPath === true) {
    pickNextHappyPathNode(originCheckpoint, checkpoints, happyNodes);
    return happyNodes;
  }
  return [];
};

const MissionProgress: React.FC<Props> = ({
  missionData,
  setHistoricalCheckpointData,
}) => {
  const { orgIdString } = useParams();
  const navigate = useNavigate();

  const workflowId = missionData?.workflow_id?.toString();
  const workflowTitle = missionData?.workflow_title;
  const versionIdString = missionData?.workflow_version_id;
  const [selectedItemId, setSelectedItemId] = useState<number>();
  const handleSelectItem = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  const publicUrl = `/public/${orgIdString}/${createIdString(
    workflowTitle,
    workflowId
  )}/${versionIdString}`;
  const items: any[] = [];
  const existed: any[] = [];
  let lastItem = missionData?.progress?.[missionData?.progress?.length - 1];
  const checkpoints = missionData?.data?.checkpoints || [];
  missionData?.progress?.forEach((item: any, index: any) => {
    const originalCheckpoint = checkpoints.find(
      (cp: any) =>
        cp.id === item.checkpoint_id.replace(item.mission_id + '-', '')
    );
    if (!item || item.vote_machine_type === 'joinNode') return;
    let dot = undefined;
    let color = '#D9D9D9';
    if (originalCheckpoint.inHappyPath) {
      dot = <CheckCircleOutlined />;
      color = 'green';
    }
    if (index === missionData?.progress.length - 1) {
      color = 'purple';
      dot = (
        <div className='rounded-full bg-violet-500 w-[10px] h-[10px]'></div>
      );
    }
    if (originalCheckpoint.isEnd && !originalCheckpoint.inHappyPath) {
      color = 'red';
      dot = <CloseCircleOutlined />;
    }
    items.push({
      color: color,
      children: (
        <HistoryItem
          item={item}
          isSelected={selectedItemId === item.id}
          setHistoricalCheckpointData={setHistoricalCheckpointData}
          onSelectItem={handleSelectItem}
        />
      ),
      dot: dot,
    });
    existed.push(originalCheckpoint?.id);
  });
  const futureHappyNodes = buildFutureHappyNode({
    checkpoints: missionData?.data.checkpoints,
    current: lastItem,
    existed,
  });
  futureHappyNodes.forEach((item: any, index: any) => {
    items.push({
      color: '#D9D9D9',
      children: <div className='rounded text-slate-300'>{item.title}</div>,
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
