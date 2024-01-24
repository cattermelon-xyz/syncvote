import { useState } from 'react';
import {
  DownOutlined,
  UpOutlined,
  AuditOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Tag, Divider } from 'antd';
import { shortenString } from '../utils';
import DoneIcon from '@assets/icons/DoneIcon';

const HistoryItem = ({ item }: { item: any }) => {
  const [expanded, setExpanded] = useState(false);
  // TODO: this is a hack, should use votemachine function instead
  const {
    checkpoint_title,
    endedAt,
    desc,
    tallyResult,
    isEnd,
    options,
    arweave_id,
    phase,
    vote_machine_type,
  } = item;
  console.log(tallyResult?.index);
  const selectedOption = tallyResult?.index
    ? options[parseInt(tallyResult?.index)]
    : null;
  const linkDiscourse = tallyResult?.submission?.linkDiscourse || null;
  const linkSnapshot = tallyResult?.linkSnapshot || null;
  const renderResult = () => {
    return (
      <>
        {selectedOption || linkDiscourse || linkSnapshot ? (
          <div className='text-xs'>
            {selectedOption ? (
              <div className='flex flex-row gap-1 items-center'>
                <DoneIcon />
                <div>
                  Choice: <Tag>{selectedOption}</Tag>
                </div>
              </div>
            ) : null}{' '}
            {linkDiscourse ? (
              <div className='flex flex-row gap-1 items-center'>
                <DoneIcon />
                <a
                  href={linkDiscourse}
                  target='_blank'
                  className='text-green-500'
                  rel='noreferrer'
                >
                  {shortenString(linkDiscourse, 30)}
                </a>
              </div>
            ) : null}
            {linkSnapshot ? (
              <div className='flex flex-row gap-1 items-center'>
                <DoneIcon />
                <a
                  href={linkSnapshot}
                  target='_blank'
                  className='text-green-500'
                  rel='noreferrer'
                >
                  {shortenString(linkSnapshot, 30)}
                </a>
              </div>
            ) : null}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    endedAt &&
    (!phase ? (
      // phase is null
      <>
        <div className='flex flex-col text-gray-600 gap-4'>
          <div className='flex flex-row justify-between text-base'>
            <div className='flex flex-row items-center'>
              <div className='rounded-full w-[8px] h-[8px] bg-gray-500'></div>
              <div className='ml-[12px] text-md font-bold'>
                {checkpoint_title}
              </div>
            </div>
            <div
              onClick={() => setExpanded(!expanded)}
              className='text-[12px] w-[28px] h-[28px] bg-white text-center items-center rounded hover:shadow-xl cursor-pointer'
            >
              {expanded ? <DownOutlined /> : <UpOutlined />}
            </div>
          </div>
          <div className='bg-white p-3 rounded flex flex-col gap-1'>
            <div className='flex flex-row justify-between items-center'>
              <div className='mr-2'>Completed on</div>
              <div>{moment(endedAt || 0).format('MMM DD, hh:mm A')}</div>
            </div>
            {expanded && !isEnd && (
              <>
                <Divider className='my-1' />
                <div className='flex flex-row w-full justify-between text-xs'>
                  <div>Result</div>
                  {arweave_id ? (
                    <a href={arweave_id}>
                      <ExportOutlined />
                    </a>
                  ) : (
                    <></>
                  )}
                </div>
                {renderResult()}
              </>
            )}
          </div>
        </div>
      </>
    ) : (
      // do have a phase
      <div className='flex flex-col bg-white rounded p-3 gap-1'>
        <div className='flex flex-row w-full justify-between'>
          <div className='text-md font-bold'>
            <div>{checkpoint_title}</div>
          </div>
        </div>
        <Divider className='my-1' />
        <div className='flex flex-row w-full justify-between'>
          <div>Completed on</div>
          <div>{moment(endedAt || 0).format('MMM DD, hh:mm A')}</div>
        </div>
        <Divider className='my-1' />
        <div className='w-full flex flex-row justify-between text-xs'>
          <div>Result</div>
          {arweave_id ? (
            <a href={arweave_id}>
              <ExportOutlined className='ml-1' />
            </a>
          ) : (
            <></>
          )}
        </div>
        {renderResult()}
      </div>
    ))
  );
};

export default HistoryItem;
