import { CheckCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const QuickStartDialog = () => {
  return (
    <Space direction='vertical' size='middle' className='my-4'>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Edit workflow general info
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Add a new checkpoint
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Setup checkpoint rules & conditions
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Review checkpoint summary
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Add an end node
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Rearrange checkpoints positions
      </div>
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Preview the workflow
      </div>
      {/* <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Invite workflow editors
      </div> */}
      <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Publish the workflow
      </div>
      {/* <div className='flex items-center'>
        <CheckSquareOutlined className='pr-2 text-violet-500' />
        Share the workflow to Syncvote community
      </div> */}
    </Space>
  );
};

export default QuickStartDialog;
