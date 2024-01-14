import { Button, Input, Modal } from 'antd';
import { CollapsiblePanel } from 'directed-graph';
import { useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import parse from 'html-react-parser';
import { DeleteOutlined } from '@ant-design/icons';

const Phases = ({ version, setVersion }: { version: any; setVersion: any }) => {
  const phases = version.data.phases || [];
  const [newPhase, setNewPhase] = useState({ title: '', desc: '' });
  const [isShown, setIsShown] = useState(false);
  return (
    <>
      <Modal
        open={isShown}
        onOk={() => {
          setVersion({
            ...version,
            data: {
              ...version.data,
              phases: [...phases, { ...newPhase }],
            },
          });
          setNewPhase({ title: '', desc: '' });
          setIsShown(false);
        }}
        onCancel={() => {
          setIsShown(false);
          setNewPhase({ title: '', desc: '' });
        }}
      >
        <div className='flex flex-col gap-1'>
          <Input
            placeholder='Title'
            value={newPhase.title}
            onChange={(e) =>
              setNewPhase({ ...newPhase, title: e.target.value })
            }
          />
          <TextEditor
            value={newPhase.desc || ''}
            setValue={(val: any) => {
              setNewPhase({ ...newPhase, desc: val });
            }}
          />
        </div>
      </Modal>
      <CollapsiblePanel title='Phases' className='p-0 w-full' open={false}>
        <div className='w-full flex flex-col gap-1'>
          {phases.map((phase: any, index: number) => {
            return (
              <div
                key={index}
                title={phase.desc}
                className='w-full flex justify-between items-center'
              >
                {phase.title}
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setVersion({
                      ...version,
                      data: {
                        ...version.data,
                        phases: phases.filter(
                          (p: any) => p.title !== phase.title
                        ),
                      },
                    });
                  }}
                  danger
                />
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => {
            setIsShown(true);
          }}
        >
          Add new Phase
        </Button>
      </CollapsiblePanel>
    </>
  );
};

export default Phases;
