import React from 'react';
import { Avatar, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';
import { EllipsisOutlined, TeamOutlined } from '@ant-design/icons';
import { getImageUrl } from '@utils/helpers';
import { FaShareNodes, FaShield } from 'react-icons/fa6';
import { FiShare, FiShield } from 'react-icons/fi';

interface SpaceCardProps {
  dataSpace: any;
  isMySpace?: boolean;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ dataSpace, isMySpace }) => {
  const navigate = useNavigate();
  console.log(dataSpace.title, ',', isMySpace);
  return (
    <Card
      className='w-[189px] bg-white rounded-xl border border-neutral-200 flex-col justify-start items-start gap-2'
      onClick={() => {
        navigate(
          `/${createIdString(dataSpace.title, dataSpace.id.toString())}`,
          {
            state: { dataSpace },
          }
        );
      }}
      hoverable={true}
    >
      <div>
        {dataSpace?.icon_url ? (
          <Avatar
            shape='circle'
            src={getImageUrl({
              filePath: dataSpace?.icon_url?.replace('preset:', ''),
              isPreset: dataSpace?.icon_url?.indexOf('preset:') === 0,
              type: 'icon',
            })}
            className='w-9 h-9 mb-2 border-1 border-gray-300'
          />
        ) : (
          <Avatar
            shape='circle'
            className='w-9 h-9 mb-2'
            style={{
              backgroundColor: '#D3D3D3',
            }}
          />
        )}
      </div>
      <div className='justify-start items-center gap-2'>
        <div className='flex-col justify-start items-start gap-1'>
          <div
            className='text-neutral-800 text-base font-medium truncate flex items-center hover:text-violet-500'
            title={`${isMySpace ? 'You are an ADMIN' : 'You are a Member'}`}
          >
            {dataSpace.title ? dataSpace.title : 'Untitled'}
            {isMySpace ? (
              <FiShield className='ml-1' />
            ) : (
              <TeamOutlined className='ml-1' />
            )}
          </div>
          <div className='flex justify-between'>
            <div className='text-zinc-500 text-sm font-medium'>
              {dataSpace.workflows?.length} workflows
            </div>
            <EllipsisOutlined style={{ fontSize: '16px', color: '#000000' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpaceCard;
