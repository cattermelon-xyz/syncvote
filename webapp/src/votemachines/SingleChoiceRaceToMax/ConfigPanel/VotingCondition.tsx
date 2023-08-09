import {
  QuestionCircleOutlined,
  CarryOutOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import BSC from '@assets/icons/svg-icons/BSC';
import Solana from '@assets/icons/svg-icons/Solana';
import { Space, Tooltip, Input, Popover, Select } from 'antd';
import { FaEthereum } from 'react-icons/fa6';

type VotingConditionProps = {
  getThresholdText: () => string;
  maxStr: string;
  editable: boolean;
  setMaxStr: (value: string) => void;
  changeMaxHandler: (e: any) => void;
  countedBy: string;
  token: string;
  changeTokenHandler: (e: any) => void;
};

const VotingCondition = (props: VotingConditionProps) => {
  const {
    getThresholdText,
    maxStr,
    editable,
    setMaxStr,
    changeMaxHandler,
    countedBy,
    token,
    changeTokenHandler,
  } = props;
  const tokenInfo = token ? token : '';
  const chain = tokenInfo?.split('.')[0] || '';
  const tokenName = tokenInfo?.split('.')[1] || '';
  const address = tokenInfo?.replace(`${chain}.${tokenName}.`, '') || '';
  return (
    <Space direction='vertical' size='small' className='w-full'>
      {/* <Space className="text-md" direction="horizontal" size="small">
        <span className="text-lg">
          Voting condition
        </span>
        <div className="items-center flex">
          <Tooltip title="Condition for wining option">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </Space> */}
      {/* <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm text-slate-600">
          Threshold calculated by
        </div>
        <Input
          type="text"
          className="w-full"
          disabled
          value={getThresholdText()}
        />
      </Space> */}
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm text-slate-600 flex items-center gap-2'>
          Threshold value for each result (at least)
          <Popover content='Threshold is the minimum number of votes/tokens an option needs to reach to win.'>
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <Input
          type='text'
          className='w-full'
          prefix={
            <div className='text-slate-600'>
              <CarryOutOutlined className='inline-flex items-center pr-2' />
            </div>
          }
          value={maxStr}
          disabled={!editable}
          onChange={(e) => setMaxStr(e.target.value)}
          onBlur={changeMaxHandler}
        />
      </Space>
      {countedBy === 'token' ? (
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-sm'>Token using for voting</div>
          <Space.Compact className='w-full'>
            <Select
              style={{ width: '150px' }}
              value={chain}
              onChange={(value) => {
                changeTokenHandler(`${value}.${tokenName}.${address}`);
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
                changeTokenHandler(`${chain}.${e.target.value}.${address}`);
              }}
            />
            <Input
              placeholder='Token/NFT address'
              className='w-full'
              value={address}
              onChange={(e) =>
                changeTokenHandler(`${chain}.${tokenName}.${e.target.value}`)
              }
              disabled={!editable}
            />
          </Space.Compact>
        </Space>
      ) : (
        // <Space direction='vertical' size='small' className='w-full'>
        //   <div className='text-sm text-slate-600'>Token using for voting</div>
        //   <Input
        //     type='text'
        //     className='w-full'
        //     prefix={
        //       <div className='text-slate-300'>
        //         <MoneyCollectOutlined className='inline-flex items-center pr-2' />
        //       </div>
        //     }
        //     value={token}
        //     disabled={!editable}
        //     onChange={changeTokenHandler}
        //   />
        // </Space>
        <></>
      )}
    </Space>
  );
};

export default VotingCondition;
