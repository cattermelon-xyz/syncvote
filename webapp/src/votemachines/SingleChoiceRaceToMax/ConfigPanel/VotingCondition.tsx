import {
  QuestionCircleOutlined,
  CarryOutOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import BSC from '@assets/icons/svg-icons/BSC';
import Solana from '@assets/icons/svg-icons/Solana';
import NumberWithPercentageInput from '@components/DirectedGraph/components/NumberWithPercentageInput';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
import { Space, Tooltip, Input, Popover, Select } from 'antd';
import { FaEthereum } from 'react-icons/fa6';

type VotingConditionProps = {
  getThresholdText: () => string;
  max: number;
  editable: boolean;
  changeMaxHandler: (e: any) => void;
  countedBy: string;
  token: string;
  changeTokenHandler: (e: any) => void;
};

const VotingCondition = (props: VotingConditionProps) => {
  const {
    getThresholdText,
    editable,
    changeMaxHandler,
    countedBy,
    token,
    changeTokenHandler,
    max,
  } = props;
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
        <NumberWithPercentageInput
          prefix={
            <div className='text-slate-600'>
              <CarryOutOutlined className='inline-flex items-center pr-2' />
            </div>
          }
          value={max}
          setValue={editable ? changeMaxHandler : undefined}
        />
      </Space>
      {countedBy === 'token' ? (
        <Space direction='vertical' size='small' className='w-full'>
          <div className='text-sm'>Token using for voting</div>
          <TokenInput
            address={token}
            setAddress={(val: String) => changeTokenHandler(val)}
            editable={editable}
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
  );
};

export default VotingCondition;
