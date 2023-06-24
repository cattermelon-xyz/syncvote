import { QuestionCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip, Select } from 'antd';

type VotingResultProps = {
  countedBy: string;
  setCountedBy: (value:string) => void;
};

const VotingResult = (props: VotingResultProps) => {
  const { countedBy, setCountedBy } = props;
  return (
    <Space direction="vertical" size="small" className="w-full">
      <Space className="text-md" direction="horizontal" size="small">
        <span className="text-lg">Voting results</span>
        <div className="items-center flex">
          <Tooltip title="Counted by number of votes (address showing up) or tokens">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </Space>
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm text-slate-600">
          Counted by
        </div>
        <Select
          className="w-full"
          value={countedBy}
          options={
            [
              {
                label: 'Number of votes',
                value: 'count',
              },
              {
                label: 'Number of token',
                value: 'token',
              },
            ]
          }
          onChange={(value) => {
            setCountedBy(value);
          }}
        />
      </Space>
    </Space>
  );
};

export default VotingResult;
