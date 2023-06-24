import { QuestionCircleOutlined, CarryOutOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { Space, Tooltip, Input } from 'antd';

type VotingConditionProps = {
  getThresholdText: () => string;
  maxStr: string;
  editable: boolean;
  setMaxStr: (value:string) => void;
  changeMaxHandler: (e:any) => void;
  countedBy: string;
  token: string;
  changeTokenHandler: (e:any) => void;
};

const VotingCondition = (props: VotingConditionProps) => {
  const {
    getThresholdText, maxStr, editable, setMaxStr, changeMaxHandler, countedBy,
    token, changeTokenHandler,
  } = props;
  return (
    <Space direction="vertical" size="small" className="w-full">
      <Space className="text-md" direction="horizontal" size="small">
        <span className="text-lg">
          Voting condition
        </span>
        <div className="items-center flex">
          <Tooltip title="Condition for wining option">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </Space>
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm text-slate-600">
          Threshold calculated by
        </div>
        <Input
          type="text"
          className="w-full"
          disabled
          value={getThresholdText()}
        />
      </Space>
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm text-slate-600">
          Threshold value for each result (at least)
        </div>
        <Input
          type="text"
          className="w-full"
          prefix={(
            <div className="text-slate-600">
              <CarryOutOutlined className="inline-flex items-center pr-2" />
            </div>
          )}
          value={maxStr}
          disabled={!editable}
          onChange={(e) => setMaxStr(e.target.value)}
          onBlur={changeMaxHandler}
        />
      </Space>
      {countedBy === 'token' ?
        (
          <Space direction="vertical" size="small" className="w-full">
            <div className="text-sm text-slate-600">
              Token using for voting
            </div>
            <Input
              type="text"
              className="w-full"
              prefix={(
                <div className="text-slate-300">
                  <MoneyCollectOutlined className="inline-flex items-center pr-2" />
                </div>
              )}
              value={token}
              disabled={!editable}
              onChange={changeTokenHandler}
            />
          </Space>
        )
        : <></>}
    </Space>
  );
};

export default VotingCondition;
