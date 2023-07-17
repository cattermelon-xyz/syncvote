import { Popconfirm, Space } from 'antd';
import { StopOutlined, WarningOutlined } from '@ant-design/icons';
import { getAllVoteMachines } from '../voteMachine';

const warningText = 'Change this would destroy all the current node setting!';

const Option = ({
  changeVoteMachineType,
  type,
  title,
  selected,
  icon,
}: {
  changeVoteMachineType: () => void;
  type: string;
  title: any;
  selected: boolean;
  icon: JSX.Element;
}) => {
  return (
    <Popconfirm
      title='Are you sure?'
      description={warningText}
      onConfirm={() => {
        changeVoteMachineType();
      }}
      disabled={selected}
    >
      <div
        className={`p-4 border border-slate-300 mb-2 cursor-pointer hover:bg-slate-100 w-full rounded-md ${
          selected ? 'bg-slate-100' : ''
        } gap-2 flex items-center`}
        key={type}
      >
        {icon}
        {title}
      </div>
    </Popconfirm>
  );
};

const ChooseVoteMachine = ({
  changeVoteMachineType,
  currentType,
}: {
  changeVoteMachineType: ({
    type,
    initialData,
  }: {
    type: string;
    initialData: any;
  }) => void;
  currentType: string | undefined;
}) => {
  const allVoteMachines = getAllVoteMachines();
  return (
    <Space direction='vertical' className='w-full' size='small'>
      <Space direction='vertical' className='w-full' size='small'>
        <div className='text-sm'>Choose a vote machine</div>
        <div className='text-sm text-red-400 bg-slate-100 p-2 rounded flex items-center gap-3 mb-2'>
          <WarningOutlined />
          {warningText}
        </div>
      </Space>
      <Option
        key='isEnd'
        type='_'
        title='End Node'
        changeVoteMachineType={() => {
          changeVoteMachineType({
            type: 'isEnd',
            initialData: undefined,
          });
        }}
        icon={<StopOutlined />}
        selected={currentType === undefined}
      />
      {Object.keys(allVoteMachines).map((type: any) => {
        const machine = allVoteMachines[type];
        return (
          <Option
            key={type}
            changeVoteMachineType={() => {
              changeVoteMachineType({
                type,
                initialData: machine.getInitialData(),
              });
            }}
            type={type}
            title={machine.getName()}
            icon={machine.getIcon()}
            selected={currentType === type}
          />
        );
      })}
    </Space>
  );
};

export default ChooseVoteMachine;
