import { IVoteMachineConfigProps } from '@types';
import { useState } from 'react';
import { Polling as Interface } from './interface';
import { Button, Drawer, Input, Select, Space, Tag } from 'antd';
import {
  ArrowRightOutlined,
  CommentOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import CollapsiblePanel from '@components/DirectedGraph/components/CollapsiblePanel';
import ResultCalculator from '@components/DirectedGraph/components/ResultCalculator';
import NavConfigPanel from '@components/DirectedGraph/components/NavConfigPanel';
import SideNote from '@components/DirectedGraph/components/SideNote';
import { isRTE } from '@components/DirectedGraph/utils';

export namespace Polling {
  export const ConfigPanel = (props: IVoteMachineConfigProps) => {
    const {
      currentNodeId,
      onChange = (data) => {},
      children = [], //eslint-disable-line
      data = {
        max: 0,
        upTo: 1,
        options: [],
        next: '',
        fallback: '',
        token: '',
      },
      allNodes,
      quorum,
      resultDescription,
      optionsDescription,
    } = props;
    const { max, next, fallback, upTo, token, options }: Interface.IData = data;
    const [newOption, setNewOption] = useState({
      title: '',
      description: '',
    });
    const [showNewOptionDrawer, setShowNewOptionDrawer] = useState(false);
    const possibleNodes: any[] = allNodes.filter(
      (n) => [currentNodeId, fallback, next].indexOf(n.id) === -1
    );
    const fallbackNode = allNodes.find((n) => n.id === fallback);
    const nextNode = allNodes.find((n) => n.id === next);
    const delays = props.delays || Array(2).fill(0);
    const delayUnits = props.delayUnits || Array(2).fill(0);
    const delayNotes = props.delayNotes || Array(2).fill('');
    const changeDelayHandler = (val: any, childIdx: number) => {
      const { delay, delayUnit, delayNote } = val;
      const newDelays = [...delays];
      const newDelayUnits = [...delayUnits];
      const newDelayNotes = [...delayNotes];
      newDelays[childIdx] = delay;
      newDelayUnits[childIdx] = delayUnit;
      newDelayNotes[childIdx] = delayNote;
      onChange({
        delays: newDelays,
        delayUnits: newDelayUnits,
        delayNotes: newDelayNotes,
      });
    };
    const replaceHandler = (val: any, childIdx: number) => {
      const { id } = val;
      const newChildren = [...children];
      newChildren[childIdx] = id;
      if (childIdx === Interface.PollingIndex.nextIdx) {
        data.next = id;
      } else if (childIdx === Interface.PollingIndex.fallbackIdx) {
        data.fallback = id;
      }
      onChange({ children: [...newChildren], data: { ...data } });
    };
    // const lOptions = options ? options.length : 0;
    return (
      <Space direction='vertical' size='large' className='mb-4 w-full'>
        <CollapsiblePanel title='Options & Navigation'>
          <Space direction='vertical' size='small' className='w-full'>
            {options && options.length > 0 ? (
              <Space direction='vertical' size='small' className='w-full'>
                <div className='font-bold'>List of options</div>
                {options?.map((option: any, index: any) => (
                  <div
                    key={option.title}
                    className='flex items-center flex-col'
                  >
                    <Space direction='vertical' size='small' className='w-full'>
                      <div className='flex gap-2  items-center'>
                        <Button
                          className='mr-2 flex-inline items-center text-center text-red-500'
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            onChange({
                              data: {
                                ...structuredClone(data),
                                options: [
                                  ...options.slice(0, index),
                                  ...options.slice(index + 1),
                                ],
                              },
                            });
                          }}
                        />
                        <div className='text-slate-700'>{option.title}</div>
                      </div>

                      {isRTE(option.description) ? (
                        <div className='text-xs w-full p-2 bg-gray-100 rounded-md'>
                          {option.description}
                        </div>
                      ) : null}
                    </Space>
                  </div>
                ))}
              </Space>
            ) : (
              <></>
            )}
            <Button
              type='link'
              className='pl-0'
              icon={<PlusOutlined />}
              onClick={() => {
                setShowNewOptionDrawer(true);
              }}
            >
              New Option
            </Button>
            <SideNote
              value={optionsDescription}
              setValue={(val: string) => {
                onChange({ optionsDescription: val });
              }}
              buttonLabel='Add Option Note'
            />
            <Space direction='vertical' size='small' className='w-full'>
              <div className='font-bold'>
                Max number of choices
                {/* (&lt;
            {lOptions}
            ) */}
              </div>
              <Input
                type='number'
                className='w-full'
                prefix={
                  <div className='text-slate-300'>
                    <ArrowRightOutlined className='inline-flex items-center pr-2' />
                  </div>
                }
                value={upTo}
                onChange={(e) => {
                  onChange({
                    data: {
                      ...structuredClone(data),
                      upTo: parseInt(e.target.value, 10),
                    },
                  });
                }}
              />
            </Space>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='font-bold'>Navigation</div>
              <NavConfigPanel
                title='Failed'
                currentNode={fallbackNode}
                possibleNodes={possibleNodes}
                index={Interface.PollingIndex.fallbackIdx}
                navLabel='None of options reach Threshold or Quorum'
                delay={delays[Interface.PollingIndex.fallbackIdx]}
                delayUnit={delayUnits[Interface.PollingIndex.fallbackIdx]}
                delayNote={delayNotes[Interface.PollingIndex.fallbackIdx]}
                changeDelayHandler={changeDelayHandler}
                replaceHandler={replaceHandler}
              />
              <NavConfigPanel
                title='Passed'
                currentNode={nextNode}
                possibleNodes={possibleNodes}
                index={Interface.PollingIndex.nextIdx}
                navLabel='1 or more options reach Threshold'
                delay={delays[Interface.PollingIndex.nextIdx]}
                delayUnit={delayUnits[Interface.PollingIndex.nextIdx]}
                delayNote={delayNotes[Interface.PollingIndex.nextIdx]}
                changeDelayHandler={changeDelayHandler}
                replaceHandler={replaceHandler}
              />
            </Space>
          </Space>
        </CollapsiblePanel>
        <CollapsiblePanel title='Result calculation'>
          <ResultCalculator
            quorum={quorum || 0}
            winnerThreshold={max || 0}
            sideNote={resultDescription || ''}
            tokenAddress={token || ''}
            setValue={(keyValue: any) => {
              if (keyValue.hasOwnProperty('quorum')) {
                onChange({ quorum: keyValue.quorum });
              }
              if (keyValue.hasOwnProperty('winnerThreshold')) {
                onChange({ data: { ...data, max: keyValue.winnerThreshold } });
              }
              if (keyValue.hasOwnProperty('sideNote')) {
                onChange({ resultDescription: keyValue.sideNote });
              }
              if (keyValue.hasOwnProperty('tokenAddress')) {
                onChange({ data: { ...data, token: keyValue.tokenAddress } });
              }
            }}
          />
        </CollapsiblePanel>
        <Drawer
          open={showNewOptionDrawer}
          onClose={() => {
            setShowNewOptionDrawer(false);
          }}
          title='New Option'
        >
          <Space direction='vertical' size='small' className='w-full'>
            <div className='text-slate-700'>Title</div>
            <Input
              type='text'
              className='w-full'
              value={newOption.title}
              onChange={(e) => {
                setNewOption({
                  ...newOption,
                  title: e.target.value,
                });
              }}
            />
            <div className='text-slate-700'>Description</div>
            <Input.TextArea
              className='w-full'
              value={newOption.description}
              onChange={(e) => {
                setNewOption({
                  ...newOption,
                  description: e.target.value,
                });
              }}
            />
            <Button
              type='default'
              className='w-full'
              icon={<PlusOutlined />}
              onClick={() => {
                setNewOption({ title: '', description: '' });
                setShowNewOptionDrawer(false);
                onChange({
                  data: {
                    ...data,
                    options: options ? [...options, newOption] : [newOption],
                  },
                });
              }}
            >
              Add
            </Button>
          </Space>
        </Drawer>
      </Space>
    );
  };
}
