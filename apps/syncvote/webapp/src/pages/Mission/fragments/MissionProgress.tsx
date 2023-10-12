import { useEffect, useState } from 'react';
import { Card, Button, Timeline } from 'antd';
import { BranchesOutlined } from '@ant-design/icons';

interface Props {
  progress: any[];
}

const MissionProgress: React.FC<Props> = ({ progress }) => {

  const items = progress.map((item, index) => {
    let color;
    if (index === progress.length - 1) {
      color = 'green';
    } else {
      color = '#D9D9D9';
    }
    return {
      color: color,
      children: item.checkpoint_title,
    };
  });

  return (
    <Card className=''>
      <p className='mb-6 text-base font-semibold'>Progress</p>
      <Timeline items={items} />
      <div className='w-full flex justify-center items-center'>
        <Button className='w-full' icon={<BranchesOutlined />}>
          View live workflow
        </Button>
      </div>
    </Card>
  );
};

export default MissionProgress;
