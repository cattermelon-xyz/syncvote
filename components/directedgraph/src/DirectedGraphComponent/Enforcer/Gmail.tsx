import { GoogleOutlined } from '@ant-design/icons';

const getName = () => 'gmail';

const getIcon = () => <GoogleOutlined />;

const Add = () => {
  return (
    <div>
      <GoogleOutlined />
      Placeholder for Gmail
    </div>
  );
};

const Display = () => {
  return (
    <div>
      <GoogleOutlined />
      Placeholder for Gmail
    </div>
  );
};

export default {
  Add,
  Display,
  getName,
  getIcon,
};
