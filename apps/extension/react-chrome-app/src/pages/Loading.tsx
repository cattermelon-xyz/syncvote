import { LoadingOutlined } from '@ant-design/icons';
import LogoSyncVote from '@assets/icons/LogoSyncVote';
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center gap-6 flex-col'>
      <LogoSyncVote color='#383838' width='130' height='100' />
      <Spin
        style={{ width: 34, height: 34 }}
        indicator={
          <LoadingOutlined style={{ fontSize: 34, color: '#383838' }} />
        }
      />
    </div>
  );
};

export default Loading;
