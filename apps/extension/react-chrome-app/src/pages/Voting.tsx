import { Button, Card } from 'antd';
import {
  CloseCircleOutlined,
  DownOutlined,
  LeftOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Discourse from '@assets/icons/Discourse';
import { useState } from 'react';

interface Props {
  setPage: any;
}

const Voting: React.FC<Props> = ({ setPage }) => {
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCardVisibility = () => setIsCardVisible(!isCardVisible);

  const handlePostDiscourse = async () => {
    await chrome.runtime.sendMessage({
      action: 'handlePostDiscourse',
      payload: { url: 'https://www.google.com.vn/?hl=vi' },
    });
  };

  return (
    <div>
      <LeftOutlined />
      <p className='w-full mt-3 text-[15px]'>IDLE transfer to Leagues</p>
      <div className='mb-[34px]'>
        <Card
          className='w-full mt-9 flex flex-col  bg-white rounded-lg'
          bodyStyle={{ padding: '12px' }}
        >
          <div className='flex justify-between items-center'>
            <p className='text-[13px] font-semibold'>Idea discussion</p>
            {isCardVisible ? (
              <UpOutlined onClick={toggleCardVisibility} />
            ) : (
              <DownOutlined onClick={toggleCardVisibility} />
            )}
          </div>
          {isCardVisible && (
            <div>
              <hr className='my-2' />
              <p>
                Share a post in the Governance forum following this guideline
              </p>
            </div>
          )}
        </Card>
        <Button
          className='h-[38px] w-full px-4 mt-2 flex justify-center items-center bg-[#000]'
          type='primary'
          onClick={handlePostDiscourse}
        >
          <Discourse />
          <p className='text-[13px] ml-[2px]'>Create a post on Discourse</p>
        </Button>
      </div>

      <div className='w-full'>
        <Button
          className='h-[38px] w-full mt-[34px] text-[13px]'
          type='primary'
          disabled
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

export default Voting;
