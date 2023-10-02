import SideNote from './SideNote';
import { Popover, Select, Space, Tag } from 'antd';
import { useState } from 'react';
import { MdHelpOutline } from 'react-icons/md';
import NumberWithPercentageInput from './NumberWithPercentageInput';
import {
  CarryOutOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import TokenInput from './TokenInput';

type ResultCalculatorProps = {
  quorum?: number;
  winnerThreshold?: number;
  sideNote?: string;
  tokenAddress?: string;
  excluded?: any;
  setValue: (value: any) => void;
};

type VotingResultProps = {
  countedBy: string;
  setCountedBy: (value: string) => void;
};

type VotingConditionProps = {
  getThresholdText: () => string;
  max: number;
  changeMaxHandler?: (e: any) => void;
  countedBy: string;
  token: string;
  changeTokenHandler?: (e: any) => void;
};

const ResultCalculator = (props: ResultCalculatorProps) => {
  const {
    quorum,
    winnerThreshold,
    sideNote,
    tokenAddress,
    setValue,
    excluded,
  } = props;
  const [countedBy, setCountedBy] = useState(tokenAddress ? 'token' : 'count');
  return (
    <Space direction='vertical' size='small' className='w-full'>
      <Space direction='vertical' size='small' className='w-full'>
        {/* <Space className="text-md" direction="horizontal" size="small">
        <span className="text-lg">Voting results</span>
        <div className="items-center flex">
          <Tooltip title="Counted by number of votes (address showing up) or tokens">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </Space> */}
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-sm text-slate-600'>Results counted by</div>
          <Select
            className='w-full'
            value={countedBy}
            options={[
              {
                label: 'Number of votes',
                value: 'count',
              },
              {
                label: 'Number of token',
                value: 'token',
              },
            ]}
            onChange={(value) => {
              setCountedBy(value);
              value === 'count' ? setValue({ tokenAddress: '' }) : null;
            }}
          />
        </Space>
      </Space>

      {excluded && excluded.indexOf('quorum') !== -1 ? null : (
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-sm text-slate-600 flex items-center gap-2'>
            Quorum
            <Popover content='Quorum is the minimum number of votes/tokens needed for a proposal to be considered valid.'>
              <MdHelpOutline />
            </Popover>
          </div>
          <NumberWithPercentageInput
            value={quorum}
            prefix={
              <div className='text-slate-600'>
                <SolutionOutlined className='inline-flex items-center pr-2' />
              </div>
            }
            setValue={(val: number) => {
              setValue({ quorum: val });
            }}
          />
        </Space>
      )}
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
        {excluded && excluded.indexOf('winnerThreshold') !== -1 ? null : (
          <Space direction='vertical' size='small' className='w-full'>
            <div className='text-sm text-slate-600 flex items-center gap-2'>
              Threshold value for each result (at least)
              <Popover content='Threshold is the minimum number of votes/tokens an option needs to reach to win.'>
                <QuestionCircleOutlined />
              </Popover>
            </div>
            <NumberWithPercentageInput
              prefix={
                <div className='text-slate-600'>
                  <CarryOutOutlined className='inline-flex items-center pr-2' />
                </div>
              }
              value={winnerThreshold}
              setValue={(val: number) => {
                setValue({ winnerThreshold: val });
              }}
            />
          </Space>
        )}
        {countedBy === 'token' ? (
          <Space direction='vertical' size='small' className='w-full'>
            <div className='text-sm'>Token using for voting</div>
            <TokenInput
              address={tokenAddress || ''}
              setAddress={(val: string) => setValue({ tokenAddress: val })}
            />
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
      {excluded && excluded.indexOf('sideNote') !== -1 ? null : (
        <SideNote
          value={sideNote}
          setValue={(val: string) => setValue({ sideNote: val })}
        />
      )}
    </Space>
  );
};

export default ResultCalculator;
