import { Select, Avatar, Tabs } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import CheckpointCard from '@components/CheckpointCard';
import { PAGE_ROUTER } from '@constants/common';

interface Props {
  setPage: any;
}

const HomePage: React.FC<Props> = ({ setPage }) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'For you',
      children: (
        <div className='flex flex-col gap-2'>
          <CheckpointCard />
          <CheckpointCard />
        </div>
      ),
    },
  ];

  const onChangeTabs = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <div className='flex justify-between mb-6'>
        <Select
          defaultValue='lucy'
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
        />
        <div className='flex gap-3 items-center'>
          <div className='flex rounded-full h-[28px] w-[28px] bg-[#E6E6E6] justify-center cursor-pointer'>
            <BellOutlined style={{ fontSize: '20px' }} />
          </div>
          <Avatar />
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <p>Proposal</p>
        <div
          className='flex rounded-full h-[36px] w-[36px] bg-[#E6E6E6] justify-center cursor-pointer'
          onClick={() => {
            setPage(PAGE_ROUTER.CREATE_PROPOSAL);
          }}
        >
          <PlusOutlined />
        </div>
      </div>
      <Tabs defaultActiveKey='1' items={items} onChange={onChangeTabs} />
    </div>
  );
};

export default HomePage;
