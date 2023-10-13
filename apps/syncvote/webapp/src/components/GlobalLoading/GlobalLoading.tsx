import { Modal, Spin, Space } from 'antd';
import { useEffect, useState } from 'react';

function Spinner() {
  return (
    <Space size='large'>
      <Spin size='large' />
    </Space>
  );
}

const GlobalLoading = ({ loading }: { loading: any }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(loading);
  }, [loading]);
  return (
    <div>
      <Modal
        open={open}
        modalRender={Spinner}
        width='62px'
        style={{ zIndex: 999 }}
        centered
      />
    </div>
  );
};

export default GlobalLoading;
