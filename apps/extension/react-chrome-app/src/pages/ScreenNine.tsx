import { Button, Card } from 'antd';
import {
  CloseCircleOutlined,
  DownOutlined,
  LeftOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import DoneIcon from '@assets/icons/DoneIcon';

const ScreenNine = () => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const toggleCardVisibility = () => setIsCardVisible(!isCardVisible);

  return (
    <div>
      <LeftOutlined />
      <p className='w-full mt-3 text-[15px]'>IDLE transfer to Leagues</p>
      <div className='mb-[34px]'>
        <Card
          className='w-full mt-9 flex flex-col  bg-white rounded-lg'
          bodyStyle={{ padding: '12px' }}
        >
          <div className='flex flex-col gap-1'>
            <p className='text-[10px]'>Completed</p>
            <div className='flex justify-between items-center'>
              <p className='text-[13px] font-semibold'>Idea discussion</p>
              {isCardVisible ? (
                <UpOutlined onClick={toggleCardVisibility} />
              ) : (
                <DownOutlined onClick={toggleCardVisibility} />
              )}
            </div>
          </div>
          {isCardVisible && (
            <div>
              <hr className='my-2' />
              <p className='text-[10px]'>
                Share a post in the Governance forum following this guideline
              </p>
            </div>
          )}
        </Card>
        <Card className='w-full mt-1 ' bodyStyle={{ padding: '12px' }}>
          <div className='flex'>
            <DoneIcon />
            <p className='w-[190px] ml-1 text-[10px] truncate ...'>
              https://gov.idle.finance/t/prime-staehjehjejhjhejhejheh
            </p>
          </div>
        </Card>
      </div>

      <div className='w-full'>
        <Button
          className='h-[38px] w-full mt-[34px] text-[13px]'
          type='primary'
        >
          Move to the next checkpoint
        </Button>

        <Button
          className='h-[38px] w-full mb-[18px] flex justify-center items-center mt-1'
          type='default'
          size='large'
          icon={<CloseCircleOutlined />}
        >
          <p className='text-[13px]'>Abandon</p>
        </Button>
      </div>
    </div>
  );
};

export default ScreenNine;
