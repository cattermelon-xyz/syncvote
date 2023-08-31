import { ArrowRightOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Drawer, Space, Input, Select, Button } from 'antd';
import { SingleChoice as Interface } from '../interface';
import { useState } from 'react';
import { DelayUnit, TimelockPanel } from 'directedgraph';

export default (props: {
  showAddOptionDrawer: boolean;
  setShowNewOptionDrawer: (data: any) => void;
  newOption: Interface.IOption;
  setNewOption: (data: any) => void;
  posibleOptions: any;
  addNewOptionHandler: (data: Interface.IOption) => void;
}) => {
  const {
    showAddOptionDrawer,
    setShowNewOptionDrawer,
    newOption,
    setNewOption,
    posibleOptions,
    addNewOptionHandler,
  } = props;
  const [newDelayNote, setNewDelayNote] = useState(
    newOption.delayNote ? newOption.delayNote : ''
  );
  return (
    <Drawer
      open={showAddOptionDrawer}
      title='Add New Option'
      onClose={() => setShowNewOptionDrawer(false)}
    >
      <Space direction='vertical' className='w-full'>
        <Space direction='horizontal' className='w-full flex justify-between'>
          <div>Option Title:</div>
          <Input
            type='text'
            value={newOption.title}
            prefix=''
            style={{ width: '200px' }}
            onChange={(e) =>
              setNewOption({
                ...newOption,
                title: e.target.value,
              })
            }
          />
        </Space>
        <Space direction='horizontal' className='w-full flex justify-between'>
          <Space direction='horizontal' size='small'>
            <div>Connect</div>
            <ArrowRightOutlined className='flex' />
          </Space>
          <Select
            value={newOption.id}
            style={{ width: '200px' }}
            options={posibleOptions.map((p: any) => {
              return {
                value: p.id,
                label: p.title ? p.title : p.id,
              };
            })}
            className='w-full'
            onChange={(value) => {
              setNewOption({
                ...newOption,
                id: value,
              });
            }}
          />
        </Space>
        <TimelockPanel
          delay={newOption.delay}
          delayUnit={newOption.delayUnit}
          delayNote={newDelayNote}
          setValue={(keyValue: any) => {
            setNewOption({
              ...newOption,
              ...keyValue,
            });
          }}
        />
        <Button
          type='default'
          className='inline-flex items-center text-center justify-center w-full mt-4'
          icon={<PlusCircleOutlined />}
          onClick={() => {
            addNewOptionHandler({
              ...newOption,
              delayNote: structuredClone(newDelayNote),
            });
            setNewDelayNote('');
            setNewOption({
              id: '',
              title: '',
              delay: 0,
              delayUnit: DelayUnit.MINUTE,
              delayNote: '',
            });
            setShowNewOptionDrawer(false);
          }}
        >
          Add
        </Button>
      </Space>
    </Drawer>
  );
};
