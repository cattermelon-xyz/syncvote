import React from 'react';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';

interface SpaceCardProps {
  dataSpace: any;
  isMySpace?: boolean;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ dataSpace, isMySpace }) => {
  const navigate = useNavigate();

  return (
    <div
      className='w-[200px] h-[111px] px-4 py-3 bg-white rounded-xl border border-neutral-200 flex-col justify-start items-start gap-2'
      onClick={() => {
        if (isMySpace) {
          navigate(
            `/my-spaces/${createIdString(
              dataSpace.org.title,
              dataSpace.org.id.toString()
            )}`,
            {
              state: { dataSpace },
            }
          );
        } else {
          navigate(
            `/shared-spaces/${createIdString(
              dataSpace.org.title,
              dataSpace.org.id.toString()
            )}`,
            {
              state: { dataSpace },
            }
          );
        }
      }}
    >
      <div>
        <Avatar
          shape='circle'
          src={dataSpace.org.icon_url}
          className='bg-[#FFE1EF] w-9 h-9'
        />
      </div>
      <div className='justify-start items-center gap-2'>
        <div className='flex-col justify-start items-start gap-1'>
          <div className='text-neutral-800 text-[16px] font-medium truncate'>
            {dataSpace.org.title}
          </div>
          <div className='text-zinc-500 text-[13px] font-medium'>
            {dataSpace.org.workflows?.length} workflows
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
