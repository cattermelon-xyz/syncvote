import { Modal, Spin, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Spinner() {
  return (
    <Space size="large">
      <Spin size="large" />
    </Space>
  );
}

const GlobalLoading = () => {
  const { loading } = useSelector((state:any) => state.ui);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(loading);
  }, [loading]);
  return (
    <div>
      <Modal
        open={open}
        modalRender={Spinner}
        width="62px"
        centered
      />
    </div>
  );
};

export default GlobalLoading;
