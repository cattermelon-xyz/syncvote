import React from 'react';
import { Space, Avatar, Button } from 'antd';

interface SpaceCardProps {
  title: string;
  imageUrl: string;
  amountWorkflow: number;
}

const SpaceCard: React.FC<SpaceCardProps> = ({
  title,
  imageUrl,
  amountWorkflow,
}) => {
  return (
    <div className='w-[200px] h-[111px] px-4 py-3 bg-white rounded-xl border border-neutral-200 flex-col justify-start items-start gap-2'>
      <div>
        <Avatar
          shape='circle'
          src={imageUrl}
          className='bg-[#FFE1EF] w-9 h-9'
        />
      </div>
      <div className='justify-start items-center gap-2'>
        <div className='flex-col justify-start items-start gap-1'>
          <div className='text-neutral-800 text-[16px] font-medium'>
            {title}
          </div>
          <div className='text-zinc-500 text-[13px] font-medium'>
            {amountWorkflow} workflows
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
