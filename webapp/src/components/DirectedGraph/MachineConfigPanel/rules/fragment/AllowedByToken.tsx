import BSC from '@assets/icons/svg-icons/BSC';
import Solana from '@assets/icons/svg-icons/Solana';
import { Input, Select, Space } from 'antd';
import { FaEthereum } from 'react-icons/fa6';

type AllowedByTokenProps = {
  editable: boolean;
  address?: string;
  setAddress: (token: string) => void;
  min?: number;
  setMin: (min: number) => void;
};

const AllowedByToken = (props: AllowedByTokenProps) => {
  const { address: tokenInfo, setAddress, min, setMin, editable } = props;
  const chain = tokenInfo?.split('.')[0] || '';
  const tokenName = tokenInfo?.split('.')[1] || '';
  const address = tokenInfo?.replace(`${chain}.${tokenName}.`, '') || '';
  return (
    <Space direction='vertical' size='middle' className='w-full'>
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm'>Token/NFT info</div>
        <Space.Compact className='w-full'>
          <Select
            style={{ width: '150px' }}
            value={chain}
            onChange={(value) => {
              setAddress(`${value}.${tokenName}.${address}`);
            }}
            options={[
              {
                value: 'eth',
                label: (
                  <div className='flex items-center'>
                    <FaEthereum className='mr-1' /> ETH
                  </div>
                ),
              },
              {
                value: 'bsc',
                label: (
                  <div className='flex items-center gap-1'>
                    <BSC className='mr-1' /> BSC
                  </div>
                ),
              },
              {
                value: 'sol',
                label: (
                  <div className='flex items-center gap-1'>
                    <Solana />
                    SOL
                  </div>
                ),
              },
            ]}
          />
          <Input
            placeholder='Token/NFT name'
            style={{ width: '200px' }}
            value={tokenName}
            onChange={(e) => {
              setAddress(`${chain}.${e.target.value}.${address}`);
            }}
          />
          <Input
            placeholder='Token/NFT address'
            className='w-full'
            value={address}
            onChange={(e) =>
              setAddress(`${chain}.${tokenName}.${e.target.value}`)
            }
            disabled={!editable}
          />
        </Space.Compact>
      </Space>
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm'>Minimum holding quantity (optional)</div>
        <Input
          type='number'
          className='w-full'
          value={min}
          onChange={(e) => {
            const num = parseInt(e.target.value, 10);
            if (num > 0) {
              setMin(num);
            } else {
              setMin(0);
            }
          }}
          disabled={!editable}
        />
      </Space>
    </Space>
  );
};

export default AllowedByToken;
