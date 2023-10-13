import { MacCommandOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

const TriggerEmptyStage = ({
  onClick,
  editable,
}: {
  onClick: () => void;
  editable: boolean;
}) => {
  return (
    <Space
      direction='vertical'
      size='large'
      className='mx-16 p-4 border-1 rounded-lg border-2 bg-white'
    >
      <div>
        {`Streamline your tasks with Syncvote. 
          From updating records and tweeting to sending emails and initiating transfers - set actions to trigger at voting checkpoints. 
          Boost efficiency seamlessly with Automated Action.`}
      </div>
      <div className='flex items-center w-full justify-center'>
        <Button
          type='primary'
          className='flex items-center w-6/12 justify-center text-md'
          icon={<MacCommandOutlined />}
          onClick={onClick}
          disabled={!editable}
        >
          Add an automated action
        </Button>
      </div>
    </Space>
  );
};

export default TriggerEmptyStage;
