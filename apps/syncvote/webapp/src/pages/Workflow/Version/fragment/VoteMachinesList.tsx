import { MacCommandOutlined } from '@ant-design/icons';
import { CollapsiblePanel, getAllVoteMachines } from 'directed-graph';

type Props = {
  // voteMachines: IVoteMachine[];
};

const VoteMachineList = ({}: Props) => {
  let voteMachines: any = {
    endNode: {
      getName: () => 'Start/End',
      getIcon: () => (
        <div
          className='rounded-full w-6 h-6 border-red-500 border-solid bg-white text-white'
          style={{ borderWidth: '4px' }}
        ></div>
      ),
    },
  };
  voteMachines = { ...voteMachines, ...getAllVoteMachines() };
  const onDragStart = (
    event: any,
    nodeType?: any,
    initData?: any,
    name?: any
  ) => {
    event.dataTransfer.setData('application/nodeType', nodeType);
    event.dataTransfer.setData(
      'application/nodeInitData',
      JSON.stringify(initData)
    );
    event.dataTransfer.setData('application/nodeName', name);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <CollapsiblePanel
      title={
        <div className='flex flex-row text-sm'>
          <MacCommandOutlined title='Actions' className='mr-1' />
          Actions
        </div>
      }
      className='w-full'
      open={true}
    >
      <div className='grid grid-cols-3 gap-2 my-4 text-center items-center'>
        {Object.keys(voteMachines)
          .reverse()
          .map((key: string) => {
            const vm = voteMachines[key];
            return (
              <div
                className='flex flex-col px-2 py-2 text-center items-center gap-1'
                key={key}
              >
                <div
                  className='flex w-10 h-10 items-center text-center bg-gray-100 rounded p-2 border-1 border-gray-200 border-solid select-none'
                  title={vm.getName()}
                  onDragStart={(event) => {
                    if (key !== 'endNode') {
                      onDragStart(
                        event,
                        key,
                        vm.getInitialData(),
                        vm.getName()
                      );
                    } else {
                      onDragStart(event, 'endNode');
                    }
                  }}
                  draggable
                >
                  {voteMachines[key]?.getIcon('w-6 h-6')}
                </div>
                <div
                  className='text-xs w-full whitespace-nowrap text-truncate'
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {vm.getName()}
                </div>
              </div>
            );
          })}
      </div>
    </CollapsiblePanel>
  );
};

export default VoteMachineList;
