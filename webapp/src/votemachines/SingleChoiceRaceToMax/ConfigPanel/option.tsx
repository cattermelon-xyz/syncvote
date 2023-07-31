import {
  DeleteOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  RestOutlined,
} from '@ant-design/icons';
import { Space, Button, Input, Select, Drawer, TimePicker } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { displayDelayDuration } from '../interface';
export const Option = ({
  index,
  currentNode,
  option,
  deleteOptionHandler,
  changeOptionHandler,
  editable = false,
  possibleOptions,
  replaceOption,
  delay,
  delayUnit,
}: {
  index: number;
  currentNode: any;
  option: string;
  deleteOptionHandler: (index: number) => void;
  changeOptionHandler: (value: any, index: number) => void;
  editable?: boolean;
  possibleOptions: any[];
  replaceOption: (newOptionData: any, index: number) => void;
  delay: number;
  delayUnit: 'year' | 'month' | 'week' | 'hour' | 'minute';
}) => {
  const [label, setLabel] = useState(option);
  const [showEditDelay, setShowEditDelay] = useState(false);
  const [newDelay, setNewDelay] = useState(delay);
  const [newDelayUnit, setNewDelayUnit] = useState(
    delayUnit ? delayUnit : 'minute'
  );
  const reset = () => {
    setNewDelay(delay);
    setNewDelayUnit(delayUnit ? delayUnit : 'minute');
  };
  return (
    <>
      <Drawer
        open={showEditDelay}
        onClose={() => {
          setShowEditDelay(false);
          reset();
        }}
        title='Set Delay'
      >
        <Space direction='vertical' size='large' className='w-full'>
          <span className='text-violet-500'>
            {displayDelayDuration(moment.duration(newDelay, newDelayUnit))}
          </span>
          <Space.Compact className='w-full'>
            <Input
              value={newDelay}
              defaultValue={delay}
              type='number'
              onChange={(e) => {
                const num = parseInt(e.target.value) || 0;
                if (num > 65535) {
                  setNewDelay(65535);
                } else {
                  setNewDelay(num);
                }
              }}
            />
            <Select
              value={newDelayUnit}
              options={[
                { value: 'year', label: 'Year' },
                { value: 'month', label: 'Month' },
                { value: 'day', label: 'Day' },
                { value: 'hour', label: 'Hour' },
                { value: 'minute', label: 'Minute' },
              ]}
              defaultValue={delayUnit ? delayUnit : 'minutes'}
              onChange={(val: any) => {
                setNewDelayUnit(val);
              }}
            />
          </Space.Compact>
          <div className='flex justify-between items-center'>
            <Button icon={<RestOutlined />} onClick={reset}>
              Reset
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                changeOptionHandler(
                  {
                    id: label,
                    delay: newDelay,
                    delayUnit: newDelayUnit,
                  },
                  index
                );
                setShowEditDelay(false);
              }}
            >
              Save
            </Button>
          </div>
        </Space>
      </Drawer>
      <Space direction='vertical' className='w-full flex justify-between'>
        <div className='w-full flex justify-between'>
          <div className='w-6/12 flex pt-1 justify-between items-center'>
            <span className='text-gray-400'>{`Option ${index + 1}`}</span>
            <Button
              type='link'
              className='flex items-center text-violet-600'
              icon={<DeleteOutlined />}
              disabled={!editable}
              onClick={() => deleteOptionHandler(index)}
            />
          </div>
          <Space
            direction='horizontal'
            className='w-6/12 flex pt-1 justify-between items-center'
          >
            <span className='text-gray-400 pl-6'>Navigate to</span>
            <span
              className='text-violet-400 flex items-center gap-1 cursor-pointer'
              onClick={() => setShowEditDelay(true)}
            >
              <ClockCircleOutlined />
              <span>
                {`${displayDelayDuration(
                  moment.duration(delay, delayUnit ? delayUnit : 'minute')
                )}`}
              </span>
            </span>
          </Space>
        </div>
        <div className='w-full flex justify-between'>
          <div className='w-6/12 flex pt-0.25 justify-between items-center pr-2.5'>
            <Input
              className='w-full'
              value={label}
              onChange={(e: any) => {
                setLabel(e.target.value);
              }}
              onBlur={() => {
                changeOptionHandler(
                  {
                    id: label,
                    delay: newDelay,
                    delayUnit: newDelayUnit,
                  },
                  index
                );
              }}
            />
          </div>
          <div className='w-6/12 flex pt-0.25 justify-between items-center gap-2'>
            <ArrowRightOutlined />
            <Select
              value={currentNode?.title || currentNode?.id}
              options={possibleOptions?.map((p: any) => {
                return {
                  value: p.id,
                  label: p.title ? p.title : p.id,
                };
              })}
              className='w-full'
              onChange={(value) => {
                replaceOption(
                  {
                    id: value,
                    title: label,
                    delay: newDelay,
                    delayUnit: newDelayUnit,
                  },
                  index
                );
              }}
            />
          </div>
        </div>
      </Space>
    </>
  );
};
