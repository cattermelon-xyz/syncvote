import React from 'react';
import {
  Card,
  Button,
  Progress,
  Tooltip,
  Space,
  Tag,
  Steps,
  Timeline,
} from 'antd';
import {
  UploadOutlined,
  ReloadOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { Icon } from 'icon';

const Voting = () => {
  return (
    <div className='w-[1033px] flex gap-4'>
      <div className='w-2/3'>
        <div className='flex flex-col mb-10 gap-6'>
          <div className='flex gap-4'>
            <Tag bordered={false} color='green' className='text-base'>
              Active
            </Tag>
            <Button
              style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
              className='text-[#6200EE]'
              icon={<UploadOutlined />}
            >
              Share
            </Button>
          </div>
          <div className='flex items-center'>
            <Icon presetIcon='' iconUrl='' size='large' />
            <div className='flex flex-col ml-2'>
              <p className='font-semibold text-xl	'>Evermoon Project</p>
              <p>Investment Process</p>
            </div>
          </div>
        </div>
        <Space direction='vertical' size={16}>
          <Card className='w-48'>
            <Space direction='horizontal' size={'small'}>
              <p>Author</p>
              <Icon iconUrl='' presetIcon='' size='medium' />
              <p>0xFC...82DE</p>
            </Space>
          </Card>
          <Card className='p-4'>
            <Space direction='vertical' size={24}>
              <p className='text-xl font-medium'>Proposal content</p>
              <p>
                Evermoon is a Web3 company offering an innovative platform for
                decentralized finance (DeFi) and secure asset trading. The
                company is looking for an investment to help further its
                development and reach its goals. An investment in Evermoon will
                offer a unique opportunity to benefit from the rapid growth of
                the Web3 economy...
              </p>
              <Button
                style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
                className=''
              >
                <p className='text-[#6200EE]'>View more</p>
              </Button>
            </Space>
          </Card>
          <Card className='p-4'>
            <div className='flex flex-col gap-6'>
              <p className='text-xl font-medium'>Vote</p>
              <Card className='w-full'>1. YES</Card>
              <Card className='w-full'>2. NO</Card>
              <Button type='primary' className='w-full'>
                Vote
              </Button>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='flex flex-col gap-4'>
              <p className='text-xl font-medium'>Votes</p>
              <div className='flex'>
                <p className='w-8/12'>Identity</p>
                <p className='w-4/12 text-right'>Vote</p>
              </div>
              <div className='flex mb-4'>
                <div className='w-8/12 flex items-center gap-2'>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p>limon@gmail.com</p>
                </div>
                <p className='w-4/12 text-right'>Yes</p>
              </div>
              <div className='flex mb-4'>
                <div className='w-8/12 flex items-center gap-2'>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p>k2@hectagon.finance</p>
                </div>
                <p className='w-4/12 text-right'>Yes</p>
              </div>
              <div className='flex mb-4'>
                <div className='w-8/12 flex items-center gap-2'>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p>tony@refine.net</p>
                </div>
                <p className='w-4/12 text-right'>Yes</p>
              </div>
            </div>
            <div className='w-full flex justify-center items-center'>
              <Button className='mt-4' icon={<ReloadOutlined />}>
                View More
              </Button>
            </div>
          </Card>
        </Space>
      </div>
      <div className='flex-1 flex flex-col gap-4'>
        <Card className=''>
          <p className='mb-6 text-base font-semibold'>Progress</p>
          <Timeline
            items={[
              {
                color: '#D9D9D9',
                children: 'Temperature Check',
              },
              {
                color: '#D9D9D9',
                children: 'Proposal revision',
              },
              {
                color: 'green',
                children: 'Consensus Check',
              },
            ]}
          />
          <div className='w-full flex justify-center items-center'>
            <Button className='w-full' icon={<BranchesOutlined />}>
              View More
            </Button>
          </div>
        </Card>
        <Card className=''>
          <p className='mb-6 text-base font-semibold'>Voting results</p>
          <div className='flex flex-col gap-2'>
            <p className='text-base font-semibold'>NO</p>
            <p className='text-base'>120 votes</p>
            <Progress percent={10} size='small' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-base font-semibold'>YES</p>
            <p className='text-base'>120 votes</p>
            <Progress percent={60} size='small' />
          </div>
          <div className='w-full flex justify-center items-center mt-2'>
            <Button className='w-full'>Reached required threshold</Button>
          </div>
        </Card>
        <Card className=''>
          <p className='mb-4 text-base font-semibold'>Rules & conditions</p>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p className='text-base '>Start time</p>
              <p className='text-base font-semibold'>2 days ago</p>
            </div>
            <p className='text-right'>July 09th, 12:00PM</p>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p className='text-base '>Remaining duration</p>
              <p className='text-base font-semibold'>1 days 2 hours</p>
            </div>
            <p className='text-right'>July 12th, 12:00PM</p>
          </div>
          <hr className='w-full my-4' />
          <div className='flex justify-between'>
            <p className='text-base '>Who can vote</p>
            <p className='text-base font-semibold'>2 days ago</p>
          </div>
          <hr className='w-full my-4' />
          <div className='flex justify-between'>
            <p className='text-base '>Threshold counted by</p>
            <p className='text-base font-semibold'>Total votes made</p>
          </div>
          <div className='flex justify-between'>
            <p className='text-base '>Threshold</p>
            <p className='text-base font-semibold'>51 votes</p>
          </div>
          <div className='flex justify-between'>
            <p className='text-base '>Quorum</p>
            <p className='text-base font-semibold'>100 votes</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Voting;
