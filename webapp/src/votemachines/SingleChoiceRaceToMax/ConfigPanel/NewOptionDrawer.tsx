import { ArrowRightOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Drawer, Space, Input, Select, Button } from 'antd';
import { IOption } from '../interface';
import { delay } from '@reduxjs/toolkit/dist/utils';
import moment from 'moment';
import TextEditor from '@components/Editor/TextEditor';
import { useEffect, useState } from 'react';
import { DelayUnit } from '@components/DirectedGraph/interface';
import { displayDelayDuration } from '@components/DirectedGraph/utils';

type NewOptionDrawerProps = {
  showAddOptionDrawer: boolean;
  setShowNewOptionDrawer: (data: any) => void;
  newOption: IOption;
  setNewOption: (data: any) => void;
  posibleOptions: any;
  addNewOptionHandler: (data: IOption) => void;
};

const NewOptionDrawer = (props: NewOptionDrawerProps) => {
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
        <div className='w-full flex justify-between'>
          <div className='text-violet-500'>
            {displayDelayDuration(
              moment.duration(newOption.delay, newOption.delayUnit as any)
            )}
          </div>
        </div>
        <Space direction='vertical' size='small' className='flex w-full'>
          <div className='w-full flex justify-between items-center'>
            <div>Timelock value</div>
            <Input
              type='number'
              className='flex '
              value={newOption.delay}
              style={{ width: '200px' }}
              onChange={(e) => {
                const num =
                  parseInt(e.target.value) > 65535
                    ? 65535
                    : parseInt(e.target.value) || 0;
                setNewOption({
                  ...newOption,
                  delay: num,
                });
              }}
            />
          </div>
          <div className='w-full flex justify-between items-center'>
            <div>Timelock unit</div>
            <Select
              style={{ width: '200px' }}
              value={newOption.delayUnit}
              onChange={(value) => {
                setNewOption({ ...newOption, delayUnit: value });
              }}
              options={[
                {
                  value: DelayUnit.YEAR,
                  label: 'Year',
                },
                {
                  value: DelayUnit.MONTH,
                  label: 'Month',
                },
                {
                  value: DelayUnit.WEEK,
                  label: 'Week',
                },
                {
                  value: DelayUnit.DAY,
                  label: 'Day',
                },
                {
                  value: DelayUnit.MINUTE,
                  label: 'Minute',
                },
              ]}
            />
          </div>
          <Space className='w-full' direction='vertical' size='small'>
            <div>Timelock Note</div>
            <div>
              <TextEditor
                value={newDelayNote}
                setValue={(val: any) => {
                  setNewDelayNote(val);
                }}
                onBlur={async () => {
                  if (newDelayNote !== newOption.delayNote) {
                    setNewOption({
                      ...newOption,
                      delayNote: newDelayNote,
                    });
                  }
                }}
              />
            </div>
          </Space>
        </Space>
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

export default NewOptionDrawer;
