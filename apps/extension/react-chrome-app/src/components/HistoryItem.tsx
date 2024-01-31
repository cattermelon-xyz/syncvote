import { useState } from 'react';
import {
  DownOutlined,
  UpOutlined,
  AuditOutlined,
  ExportOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Tag, Divider } from 'antd';
import { openProofOnChain, shortenString } from '../utils';
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
    return selectedOption || linkDiscourse || linkSnapshot ? (
      <>
        <div>
          <div className='flex flex-row w-full justify-between text-xs'>
            <div className='text-gray-600'>
              {selectedOption && 'Selected option'}
              {linkDiscourse && 'Post link'}
              {linkSnapshot && 'Snapshot link'}
            </div>
            {linkSnapshot || linkDiscourse ? (
              <a
                href={linkSnapshot ? linkSnapshot : linkDiscourse}
                className='text-gray-600'
              >
                <ExportOutlined />
              </a>
            ) : (
              <></>
            )}
          </div>
          <div className='text-xs mt-2'>
            {selectedOption ? (
              <div className='flex flex-row gap-1 items-center'>
                <DoneIcon />
                <div>
                  Choice: <Tag>{selectedOption}</Tag>
                </div>
              </div>
            ) : null}{' '}
            {linkDiscourse ? (
              <div className='flex flex-row gap-1 items-center mt-2'>
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
              <div className='flex flex-row gap-1 items-center mt-2'>
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
        </div>
        <Divider className='my-1' />
      </>
    ) : (
      <></>
    );
  };
  return (
    endedAt &&
    (!phase ? (
      // phase is null
      <>
        <div className='flex flex-col text-gray-600 gap-4'>
          <div className='flex flex-row justify-between text-base'>
            <div className='pl-1 flex flex-row items-center'>
              <div className='rounded-full w-[8px] h-[8px] bg-gray-400'></div>
              <div className='ml-[12px] text-md font-bold'>
                {shortenString(checkpoint_title, 40)}
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
                {renderResult()}
                <div className='flex flex-row w-full justify-between text-xs'>
                  <div className='text-gray-600'>Proof on chain</div>
                  {arweave_id ? (
                    <div className='flex flex-row gap-2 ml-1'>
                      <a className='text-gray-600' href={arweave_id}>
                        <DownloadOutlined />
                      </a>
                      <span
                        onClick={() =>
                          openProofOnChain(
                            arweave_id.replace('https://arweave.net/', '')
                          )
                        }
                      >
                        <ExportOutlined />
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
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
            <div>{shortenString(checkpoint_title, 40)}</div>
          </div>
        </div>
        <Divider className='my-1' />
        <div className='flex flex-row w-full justify-between'>
          <div className='text-xs text-gray-500 font-medium'>Completed on</div>
          <div>{moment(endedAt || 0).format('MMM DD, hh:mm A')}</div>
        </div>
        <Divider className='my-1' />
        {renderResult()}
        <div className='w-full flex flex-row justify-between text-xs'>
          <div className='text-gray-600'>Proof on chain</div>
          {arweave_id ? (
            <div className='flex flex-row gap-2 ml-1'>
              <a className='text-gray-600' href={arweave_id}>
                <DownloadOutlined />
              </a>
              <span
                onClick={() =>
                  openProofOnChain(
                    arweave_id.replace('https://arweave.net/', '')
                  )
                }
              >
                <ExportOutlined />
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    ))
  );
};

export default HistoryItem;
