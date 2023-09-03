import React from 'react';
import { Input, Tag, Space, Button, Popover } from 'antd';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';

const SortButton = () => {
  return (
    <div>
      {' '}
      {/* <Popover title='Title' trigger='click'> */}
      <Button
        style={{ border: 'None', padding: '5px' }}
        className='w-[44px] bg-[#F6F6F6]'
      >
        <SortAscendingOutlined style={{ fontSize: '20px', color: '#6200EE' }} />
      </Button>
      {/* </Popover> */}
    </div>
  );
};

export default SortButton;
