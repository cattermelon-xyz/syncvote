import { CheckCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const QuickStartDialog = () => {
  return (
    <Space direction="vertical" size="middle" className="my-4">
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Workflow name/icon/description/edit cover
      </div>
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Add checkpoint
      </div>
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Add checkpoint rules & conditions
      </div>
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Add checkpoint related actions (optional)
      </div>
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Add checkpoint color/label
      </div>
      <div className="flex items-center">
        <CheckCircleOutlined className="pr-2" />
        Preview
      </div>
    </Space>
  );
};

export default QuickStartDialog;
