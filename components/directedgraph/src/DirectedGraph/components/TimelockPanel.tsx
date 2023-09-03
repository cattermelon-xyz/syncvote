import moment from 'moment';
import { DelayUnit } from '../interface';
import { displayDelayDuration } from '../utils';
import { Input, Select, Space } from 'antd';
import { TextEditor } from 'rich-text-editor';
import { useState } from 'react';

const TimelockPanel = ({
  delay,
  delayUnit,
  delayNote,
  setValue,
}: {
  delay: number;
  delayUnit: DelayUnit;
  delayNote: string;
  setValue: (keyValue: any) => void;
}) => {
  const [tmpDelayNote, setTmpDelayNote] = useState(delayNote);
  return (
    <Space direction='vertical' size='middle'>
      <div className='w-full flex justify-between'>
        <div className='text-violet-500'>
          {displayDelayDuration(moment.duration(delay, delayUnit as any))}
        </div>
      </div>
      <Space direction='vertical' size='small' className='flex w-full'>
        <div className='w-full flex justify-between items-center'>
          <div>Timelock value</div>
          <Input
            type='number'
            className='flex '
            value={delay}
            style={{ width: '200px' }}
            onChange={(e) => {
              const num =
                parseInt(e.target.value) > 65535
                  ? 65535
                  : parseInt(e.target.value) || 0;
              setValue({ delay: num });
            }}
          />
        </div>
        <div className='w-full flex justify-between items-center'>
          <div>Timelock unit</div>
          <Select
            style={{ width: '200px' }}
            value={delayUnit}
            onChange={(value) => {
              setValue({ delayUnit: value });
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
                value: DelayUnit.HOUR,
                label: 'Hour',
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
              value={tmpDelayNote}
              setValue={(val: any) => {
                setTmpDelayNote(val);
              }}
              onBlur={async () => {
                if (tmpDelayNote !== delayNote) {
                  setValue({ delayNote: tmpDelayNote });
                }
              }}
            />
          </div>
        </Space>
      </Space>
    </Space>
  );
};

export default TimelockPanel;
