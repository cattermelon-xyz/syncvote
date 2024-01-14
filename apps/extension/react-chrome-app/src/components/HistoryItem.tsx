import { useState } from 'react';
import { DownOutlined, UpOutlined, AuditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Tag, Divider } from 'antd';
import { trimTitle } from '../utils';
import parse from 'html-react-parser';
import DoneIcon from '@assets/icons/DoneIcon';

const HistoryItem = ({ item }: { item: any }) => {
  console.log('item: ', item);
  const [expanded, setExpanded] = useState(false);
  // TODO: this is a hack, should use votemachine function instead
  const {
    checkpoint_title,
    endedAt,
    desc,
    vote_machine_type,
    tallyResult,
    isEnd,
    options,
    arweave_id,
    phase,
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
                  {trimTitle(linkDiscourse, 30)}
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
                  {trimTitle(linkSnapshot, 30)}
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
      <>
        <Divider className='my-1' />
        <div className='flex flex-col gap-2'>
          <div className='bg-white p-3 rounded flex justify-between items-center'>
            <div className='flex flex-col gap-1'>
              {!isEnd && (
                <div className='flex items-center text-xs'>
                  <div className='mr-2'>Completed -</div>
                  {arweave_id ? (
                    <a href={arweave_id}>
                      {endedAt
                        ? moment(endedAt || 0).format('MMM DD, hh:mm A')
                        : null}
                      <AuditOutlined className='ml-1' />
                    </a>
                  ) : (
                    moment(endedAt || 0).format('MMM DD, hh:mm A')
                  )}
                </div>
              )}
              <div className='font-bold text-md'>{checkpoint_title}</div>
            </div>
            {!isEnd &&
              (selectedOption || linkDiscourse || linkSnapshot || desc) && (
                <div onClick={() => setExpanded(!expanded)}>
                  {expanded ? <UpOutlined /> : <DownOutlined />}
                </div>
              )}
          </div>
          {expanded && !isEnd && (
            <>
              {/* {desc && (
              <div className='bg-white p-3 rounded flex justify-between items-center'>
                {parse(desc || '')}
              </div>
            )} */}
              <div className='bg-gray-200 p-3 rounded flex flex-col gap-1'>
                <div className='flex flex-row w-full justify-between'>
                  <div className='text-md font-bold'>{checkpoint_title}</div>
                  {arweave_id ? (
                    <a href={arweave_id}>
                      {endedAt
                        ? moment(endedAt || 0).format('MMM DD, hh:mm A')
                        : null}
                      <AuditOutlined className='ml-1' />
                    </a>
                  ) : (
                    moment(endedAt || 0).format('MMM DD, hh:mm A')
                  )}
                </div>

                {renderResult()}
              </div>
            </>
          )}
        </div>
      </>
    ) : (
      <div className='bg-gray-200 p-3 rounded flex flex-col gap-1'>
        <div className='flex flex-row w-full justify-between'>
          <div className='text-md font-bold'>{checkpoint_title}</div>
          {arweave_id ? (
            <a href={arweave_id}>
              {endedAt ? moment(endedAt || 0).format('MMM DD, hh:mm A') : null}
              <AuditOutlined className='ml-1' />
            </a>
          ) : (
            moment(endedAt || 0).format('MMM DD, hh:mm A')
          )}
        </div>
        {renderResult()}
      </div>
    ))
  );
};

export default HistoryItem;
