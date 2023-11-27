import { Card, Tag } from 'antd';

const CheckpointCard = () => {
  return (
    <Card bodyStyle={{ padding: '12px' }}>
      <Tag color='default'>Completed</Tag>
      <div className='flex flex-col gap-1 mt-1'>
        <p className='text-[13px]'>
          Deploy Friendly Fork of Uniswap Protocol V2
        </p>
        <p className='text-[10px]'>End at Oct 12th, 2023 • 09:21 AM</p>
      </div>
    </Card>
  );
};

export default CheckpointCard;
