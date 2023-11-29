import { Button, Input, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { snapshotDesc, useWindowSize } from './funcs';
import TextEditor from 'rich-text-editor/src/TextEditor/TextEditor';
import parse from 'html-react-parser';
import './topic.scss';
import moment from 'moment';
import { supabase } from 'utils';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export const CreateTopic = () => {
  const location = useLocation();
  const { missions_demo_id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const size = useWindowSize();
  const dispatch = useDispatch();

  const title = 'IDLE transfer to Leagues';
  const [description, setDescription] = useState(snapshotDesc);

  const createTopic = async () => {
    dispatch(startLoading({}));
    // logic here
    dispatch(finishLoading({}));
  };
  return (
    <>
      <div className='m-6 w-full'>
        <div className='header mb-4'>
          <span
            className='text-[20px] font-semibold'
            style={{ color: 'var(--foundation-grey-g-7, #252422)' }}
          >
            Create a post on Discourse
          </span>
        </div>
        <div className='flex w-full mb-4 h-[630px]'>
          <div
            className='block-1 pr-6'
            style={{
              width: (size.width - 48) / 2,
              borderRight: '1px solid #E3E3E2',
            }}
          >
            <div className='flex-col mb-3'>
              <div className='text-[#575655] text-[13px] font-normal mb-2'>
                Topic title
              </div>
              <Input
                className='w-full h-12 px-4 py-[13px]'
                disabled
                value={title}
              />
            </div>
            <div className='flex-col mb-3'>
              <div className='text-[#575655] text-[13px] font-normal mb-2'>
                Topic content
              </div>
              <div>
                <TextEditor
                  value={description}
                  setValue={(val: string) => {
                    setDescription(val);
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className='block-2 pl-6 text-[15px] overflow-y-scroll'
            style={{ width: (size.width - 48) / 2 }}
          >
            {parse(description)}
          </div>
        </div>

        <div className='footer relative w-full'>
          <div className='absolute right-0 flex items-center'>
            <Button className='mr-4 h-[46px] text-[17px] font-normal flex items-center justify-center'>
              Cancel
            </Button>
            <Button
              className='mr-4 h-[46px] text-[17px] font-normal flex items-center justify-center bg-[#6200EE] text-white'
              onClick={createTopic}
            >
              Publish topic
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
