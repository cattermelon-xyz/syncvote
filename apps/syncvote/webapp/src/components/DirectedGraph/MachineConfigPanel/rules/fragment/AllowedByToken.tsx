import BSC from '@assets/icons/svg-icons/BSC';
import Solana from '@assets/icons/svg-icons/Solana';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
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
  const { address, setAddress, min, setMin, editable } = props;

  return (
    <Space direction='vertical' size='middle' className='w-full'>
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm'>Token/NFT info</div>
        <TokenInput
          address={address || ''}
          setAddress={(str) => {
            setAddress(str);
          }}
          editable={editable}
        />
      </Space>
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm'>Minimum holding quantity (optional)</div>
        <Input
          type='number'
          className='w-full'
          value={min}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (num > 0) {
              setMin(num);
            } else {
              setMin(0);
            }
          }}
          disabled={!editable}
          suffix={'Token(s)'}
        />
      </Space>
    </Space>
  );
};

export default AllowedByToken;
