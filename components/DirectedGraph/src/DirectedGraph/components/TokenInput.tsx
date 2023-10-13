import { Space, Select, Input } from 'antd';
import { TbExternalLink } from 'react-icons/tb';

const networks = [
  {
    value: 'sol',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/black/sol.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        SOL
      </div>
    ),
    explorer: 'https://explorer.solana.com/',
  },
  {
    value: 'eth',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/black/eth.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        ETH
      </div>
    ),
    explorer: 'https://etherscan.io/',
  },
  {
    value: 'matic',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/black/matic.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        Polygon
      </div>
    ),
    explorer: 'https://polygonscan.com/',
  },
  {
    value: 'bsc',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        BSC
      </div>
    ),
    explorer: 'https://bscscan.io/',
  },
  {
    value: 'tron',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/trx.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        Tron
      </div>
    ),
    explorer: 'https://tronscan.org/',
  },
  {
    value: 'avax',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/avax.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        Avalanche
      </div>
    ),
    explorer: 'https://cchain.explorer.avax.network/',
  },
  {
    value: 'eos',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eon.svg'
          width={14}
          height={14}
          className='mr-1'
        />
        EOS
      </div>
    ),
    explorer: 'https://bloks.io/',
  },
  {
    value: 'near',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cryptologos.cc/logos/near-protocol-near-logo.svg?v=026'
          width={14}
          height={14}
          className='mr-1'
        />
        Aura NEAR
      </div>
    ),
    explorer: 'https://explorer.mainnet.near.org/',
  },
  {
    value: 'ftm',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=026'
          width={14}
          height={14}
          className='mr-1'
        />
        FTM
      </div>
    ),
    explorer: 'https://ftmscan.com/',
  },
  {
    value: 'arb1',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=026'
          width={14}
          height={14}
          className='mr-1'
        />
        Arbitrum
      </div>
    ),
    explorer: 'https://arbiscan.io/',
  },
  {
    value: 'oeth',
    label: (
      <div className='flex items-center'>
        <img
          src='https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg?v=026'
          width={14}
          height={14}
          className='mr-1'
        />
        Optimism
      </div>
    ),
    explorer: 'https://optimistic.etherscan.io/',
  },
];

const TokenInput = ({
  address,
  setAddress = undefined,
  editable = true,
}: {
  address: string;
  setAddress?: (newAddress: string) => void;
  editable?: boolean;
}) => {
  const chain = address?.split('.')[0] || '';
  const tokenName = address?.split('.')[1] || '';
  const tokenAddress = address?.replace(`${chain}.${tokenName}.`, '') || '';
  const existedExplorer = networks.find((n) => n.value === chain)?.explorer;
  const explorer = existedExplorer
    ? existedExplorer + 'address/' + tokenAddress
    : address;

  return editable && setAddress !== undefined ? (
    <Space.Compact className='w-full'>
      <Select
        style={{ width: '200px' }}
        value={chain}
        onChange={(value) =>
          setAddress(`${value}.${tokenName}.${tokenAddress}`)
        }
        options={networks}
        disabled={!editable}
      />
      <Input
        placeholder='Token/NFT name'
        style={{ width: '200px' }}
        value={tokenName}
        onChange={(e) =>
          setAddress(`${chain}.${e.target.value}.${tokenAddress}`)
        }
        disabled={!editable}
      />
      <Input
        placeholder='Token/NFT address'
        className='w-full'
        value={tokenAddress}
        onChange={(e) => setAddress(`${chain}.${tokenName}.${e.target.value}`)}
        disabled={!editable}
        suffix={
          explorer ? (
            <span
              onClick={() => window.open(explorer, '_blank')}
              className='user-select-none h-5'
            >
              <TbExternalLink className='text-violet-500 w-5 h-5 cursor-pointer' />
            </span>
          ) : null
        }
      />
    </Space.Compact>
  ) : tokenName ? (
    <a
      href={explorer}
      target='_blank'
      title={tokenAddress}
      className='text-violet-500'
    >
      {tokenName}
    </a>
  ) : null;
};

export default TokenInput;
