import {
  DeleteOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  RestOutlined,
} from '@ant-design/icons';
import {
  Space,
  Button,
  Input,
  Select,
  Drawer,
  TimePicker,
  Popover,
} from 'antd';
import moment from 'moment';
import { ReactNode, useState } from 'react';
import { displayDelayDuration, isRTE } from '../utils';
import parse from 'html-react-parser';
import TimelockPanel from './TimelockPanel';
import { DelayUnit } from '../interface';

export interface INavPanelNode {
  id: string;
  title: string;
}

interface INavPanelProps {
  index: number;
  title: ReactNode;
  currentNode: INavPanelNode;
  navLabel: string;
  possibleNodes: INavPanelNode[];
  delay: number;
  delayUnit: DelayUnit;
  delayNote: string;

  changeLabelHandler?: (value: any, index: number) => void;
  changeDelayHandler: (value: any, index: number) => void;
  replaceHandler: (newOptionData: any, index: number) => void;
  deleteHandler?: (index: number) => void;
}

const NavConfigPanel = ({
  index,
  title,
  currentNode,
  navLabel,
  delay,
  delayUnit,
  delayNote,
  possibleNodes,

  changeLabelHandler,
  changeDelayHandler,
  replaceHandler,
  deleteHandler,
}: INavPanelProps) => {
  const [label, setLabel] = useState(navLabel);
  const [showEditDelay, setShowEditDelay] = useState(false);
  const [newDelay, setNewDelay] = useState(delay);
  const [newDelayUnit, setNewDelayUnit] = useState(
    delayUnit ? delayUnit : DelayUnit.MINUTE
  );
  const [newDelayNote, setNewDelayNote] = useState(delayNote ? delayNote : '');
  const reset = () => {
    setNewDelay(delay);
    setNewDelayUnit(delayUnit ? delayUnit : DelayUnit.MINUTE);
    setNewDelayNote(delayNote ? delayNote : '');
  };
  return (
    <>
      <Drawer
        open={showEditDelay}
        onClose={() => {
          setShowEditDelay(false);
          reset();
        }}
        title='Set Timelock'
      >
        <Space direction='vertical' size='large' className='w-full'>
          <TimelockPanel
            delay={newDelay}
            delayUnit={newDelayUnit}
            delayNote={newDelayNote}
            setValue={(keyValue: any) => {
              if (keyValue.hasOwnProperty('delay')) {
                setNewDelay(keyValue.delay);
              }
              if (keyValue.hasOwnProperty('delayUnit')) {
                setNewDelayUnit(keyValue.delayUnit);
              }
              if (keyValue.hasOwnProperty('delayNote')) {
                setNewDelayNote(keyValue.delayNote);
              }
            }}
          />
          <div className='flex justify-between items-center'>
            <Button icon={<RestOutlined />} onClick={reset}>
              Reset
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                changeDelayHandler(
                  {
                    delay: newDelay,
                    delayUnit: newDelayUnit,
                    delayNote: newDelayNote,
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
            <span className='text-gray-400'>{title}</span>
            {deleteHandler ? (
              <Button
                type='link'
                className='flex items-center text-violet-600'
                icon={<DeleteOutlined />}
                onClick={() => deleteHandler(index)}
              />
            ) : null}
          </div>
          <Space
            direction='horizontal'
            className='w-6/12 flex pt-1 justify-between items-center'
          >
            <span className='text-gray-400 pl-6'>Navigate to</span>

            <Popover content={isRTE(delayNote) ? parse(delayNote) : 'No note'}>
              <span
                className='text-violet-400 flex items-center gap-1 cursor-pointer'
                onClick={() => setShowEditDelay(true)}
              >
                <span>
                  {displayDelayDuration(
                    moment.duration(delay, delayUnit ? delayUnit : 'minute')
                  )}
                </span>
              </span>
            </Popover>
          </Space>
        </div>
        <div className='w-full flex justify-between'>
          <div className='w-6/12 flex pt-0.25 justify-between items-center pr-2.5'>
            {changeLabelHandler ? (
              <Input
                className='w-full'
                value={label}
                onChange={(e: any) => {
                  setLabel(e.target.value);
                }}
                onBlur={() => {
                  changeLabelHandler(label, index);
                }}
              />
            ) : (
              label
            )}
          </div>
          <div className='w-6/12 flex pt-0.25 justify-between items-center gap-2'>
            <ArrowRightOutlined />
            <Select
              value={currentNode?.title || currentNode?.id}
              options={possibleNodes?.map((p: any) => {
                return {
                  value: p.id,
                  label: p.title ? p.title : p.id,
                };
              })}
              className='w-full'
              onChange={(value) => {
                replaceHandler(
                  {
                    id: value,
                    title: label,
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

export default NavConfigPanel;
