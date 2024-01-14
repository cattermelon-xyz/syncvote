import { Button, Drawer, Timeline } from 'antd';
import parse from 'html-react-parser';
import { shortenString } from 'directed-graph';
import { useState } from 'react';

const PhaseDrawer = ({
  workflow,
  shown,
  setShown,
}: {
  workflow: any;
  shown: any;
  setShown: any;
}) => {
  const wfv = workflow?.workflow_version ? workflow?.workflow_version[0] : {};
  const checkpoints = wfv.data?.checkpoints;
  const [showPhaseDesc, setShowPhaseDesc] = useState(false);
  const phases =
    wfv.data?.phases?.map((p: any) => {
      return {
        color: 'green',
        label: (
          <div
            className='cursor-pointer hover:bg-gray-100 p-2 rounded-md'
            onClick={() => setShowPhaseDesc(p.title)}
          >
            {p.title}
          </div>
        ),
        children: (
          <div className='text-left'>
            <div>{parse(shortenString(p.desc, 150) || '')}</div>
            <div className='flex flex-col gap-2'>
              {checkpoints
                .filter((cp: any) => cp.phase === p.title)
                .map((cp: any, index: any) => {
                  return (
                    <div key={index}>
                      <Drawer
                        title={p.title}
                        width='30%'
                        open={showPhaseDesc === p.title}
                        onClose={() => setShowPhaseDesc(false)}
                      >
                        {parse(p.desc || '')}
                      </Drawer>
                      <Button
                        type='link'
                        onClick={() => window.open('?cp=' + cp.id, '_blank')}
                      >
                        {shortenString(cp.title, 30)}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
        ),
      };
    }) || [];
  return (
    <Drawer
      title='Overview'
      open={shown}
      onClose={() => setShown(false)}
      footer={null}
      width='50%'
    >
      <Timeline items={phases} mode='left' />
    </Drawer>
  );
};

export default PhaseDrawer;
