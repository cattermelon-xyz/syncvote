import React from 'react';
import { Avatar, Card } from 'antd';
import './AntCard.css';

interface WorkflowCardProps {
  dataWorkflow: any;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ dataWorkflow }) => (
  <Card
    style={{ position: 'relative' }}
    className='w-64 h-[176px] relative rounded-xl '
  >
    <img
      className='w-full h-[86px] rounded-lg m-0'
      alt='example'
      src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
    />
    <Avatar
      src='https://xsgames.co/randomusers/avatar.php?g=pixel'
      style={{ position: 'absolute', top: '78px', left: '24px', zIndex: 10 }}
    />
    <p className='text-xs text-[#252422] mt-[18px] mb-2 truncate'>
      {dataWorkflow.title}
    </p>
    <div className='flex'>
      <Avatar
        src='https://xsgames.co/randomusers/avatar.php?g=pixel'
        className='w-[16px] h-[16px]'
      />
      <p className='text-xs text-[#575655] self-center ml-[4px]'>
        Avatar and Name fixed
      </p>
    </div>
  </Card>
);

export default WorkflowCard;
