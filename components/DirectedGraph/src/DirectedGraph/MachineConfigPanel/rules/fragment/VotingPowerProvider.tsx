import { Select, Space } from 'antd';

const VotingPowerProvider = () => {
  return (
    <>
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-lg font-bold'>Voting Power Provider</div>
        <div className='text-sm'>Use the vote machine or use 3rd party</div>
      </Space>
      <Select
        style={{ width: '100%' }}
        defaultValue='default'
        options={[
          {
            key: 'default',
            label: 'Use voting power provided by voting program',
            value: '',
          },
          {
            key: 'a_system_owned_address',
            label: 'Provide by SyncVote',
            value: 'a_system_owned_address',
          },
        ]}
      />
    </>
  );
};

export default VotingPowerProvider;
