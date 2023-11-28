import { Select, Avatar, Tabs } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import CheckpointCard from '@components/CheckpointCard';
import { PAGE_ROUTER } from '@constants/common';

interface Props {
  setPage: any;
  dataDemo: any;
  setCurrentProposalId: any;
}

const HomePage: React.FC<Props> = ({
  setPage,
  dataDemo,
  setCurrentProposalId,
}) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'For you',
      children: (
        <div className='flex flex-col gap-2'>
          {dataDemo &&
            dataDemo.map((proposal: any, index: any) => (
              <CheckpointCard
                key={index}
                proposal={proposal}
                setPage={setPage}
                setCurrentProposalId={setCurrentProposalId}
              />
            ))}
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
          defaultValue='Idle DAO'
          style={{ width: 120 }}
          onChange={handleChange}
          options={[{ value: 'Idle DAO', label: 'Idle DAO' }]}
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
      <Tabs
        className='mb-2'
        defaultActiveKey='1'
        items={items}
        onChange={onChangeTabs}
      />
    </div>
  );
};

export default HomePage;
