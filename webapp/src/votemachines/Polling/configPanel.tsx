import { IVoteMachineConfigProps } from '@types';
import { useState } from 'react';
import { Polling as Interface } from './interface';
import { Button, Drawer, Input, Select, Space, Tag } from 'antd';
import {
  ArrowRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import CollapsiblePanel from '@components/DirectedGraph/components/CollapsiblePanel';
import ResultCalculator from '@components/DirectedGraph/components/ResultCalculator';

export namespace Polling {
  export const ConfigPanel = ({
    currentNodeId,
    votingPowerProvider = '',
    whitelist = [],
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
  }: IVoteMachineConfigProps) => {
    // TODO: config `upTo`
    const { max, options, next, fallback, upTo, token }: Interface.IData = data;
    const [newOption, setNewOption] = useState({
      title: '',
      description: '',
    });
    const [showNewOptionDrawer, setShowNewOptionDrawer] = useState(false);
    const possibleOptions: any[] = [];
    let maxStr = '0';
    if (max) {
      maxStr = max < 1 ? `${max * 100}%` : `${max}`;
    }
    let nextTitle = next;
    let fallbackTitle = fallback;
    allNodes.forEach((node) => {
      if (
        node.id !== fallback &&
        node.id !== next &&
        node.id !== currentNodeId
      ) {
        possibleOptions.push({
          value: node.id,
          label: node.title ? node.title : node.id,
        });
      } else if (node.id === fallback) {
        fallbackTitle = node.title ? node.title : node.id;
      } else if (node.id === next) {
        nextTitle = node.title ? node.title : node.id;
      }
    });
    const renderChildren = (type: any, val: any) => {
      return !val ? (
        <Space
          direction='horizontal'
          className='flex items-center justify-between w-full'
          size='small'
        >
          <div>
            {type === 'next'
              ? 'If we found winner then '
              : 'If voting is over and we can not find winners, then '}
          </div>
          <ArrowRightOutlined />
          <Select
            style={{ width: '200px' }}
            options={possibleOptions}
            onChange={(value) => {
              const newData: any = structuredClone(data);
              newData[type] = value; //eslint-disable-line
              onChange({
                data: newData,
                children: [...children, value],
              });
            }}
          />
        </Space>
      ) : (
        <Space
          direction='horizontal'
          size='small'
          className='flex items-center justify-between w-full'
        >
          <Button
            type='link'
            className='flex items-center text-red-500 justify-between'
            icon={<DeleteOutlined />}
            onClick={() => {
              const newData: any = structuredClone(data);
              delete newData[type];
              const newChildren = [...children];
              const idx = children.indexOf(val);
              newChildren.splice(idx, 1);
              onChange({
                data: newData,
                children: newChildren,
              });
            }}
          />
          {type === 'next' ? 'Winner found' : 'No winner found'}
          <ArrowRightOutlined />
          {type === 'next' ? (
            <Tag>{nextTitle}</Tag>
          ) : (
            <Tag>{fallbackTitle}</Tag>
          )}
        </Space>
      );
    };
    // const lOptions = options ? options.length : 0;
    return (
      <Space direction='vertical' size='large' className='mb-4 w-full'>
        <CollapsiblePanel title='Options & Navigation'>
          <Space direction='vertical' size='large' className='w-full'>
            {options && options.length > 0 ? (
              <Space direction='vertical' size='small' className='w-full'>
                <div>List of options</div>
                {options?.map((option: any, index: any) => (
                  <Space
                    direction='horizontal'
                    key={option.title}
                    className='flex items-center'
                  >
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
                    <Space direction='vertical' size='small'>
                      <div className='text-slate-700'>{option.title}</div>
                      <div className='text-xs'>{option.description}</div>
                    </Space>
                  </Space>
                ))}
              </Space>
            ) : (
              <></>
            )}
            <Button
              icon={<PlusOutlined />}
              className='w-full'
              onClick={() => {
                setShowNewOptionDrawer(true);
              }}
            >
              New Option
            </Button>
            <Space direction='vertical' size='small' className='w-full'>
              <div className='text-md'>
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
            {renderChildren('next', next)}
            {renderChildren('fallback', fallback)}
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
