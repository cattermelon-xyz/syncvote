import { Button, Input, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { snapshotDesc, useWindowSize } from './funcs';
import TextEditor from 'rich-text-editor/src/TextEditor/TextEditor';
import parse from 'html-react-parser';
import './topic.scss';
import moment from 'moment';
import { supabase } from 'utils';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import axios from 'axios';

const backEndUrl = import.meta.env.VITE_SERVER_URL;

const defaultTitle = 'loading ...';

export const CreateTopic = () => {
  const location = useLocation();
  const { missions_demo_id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const size = useWindowSize();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(snapshotDesc);

  useEffect(() => {
    supabase
      .from('demo_missions')
      .select('*')
      .eq('id', missions_demo_id)
      .then((res) => {
        if (res.data) {
          setTitle(res.data[0].title);
        }
      });
  }, [missions_demo_id]);
  const navigate = useNavigate();
  const createTopic = async () => {
    dispatch(startLoading({}));
    // logic here
    const discourseData = {
      title: title,
      raw: description,
      id_mission: missions_demo_id,
    };
    await axios
      .post(`${backEndUrl}/demo/create`, discourseData)
      .then((res) => {
        setTitle(defaultTitle);
        setDescription('');
        Modal.success({
          title: 'Success',
          content:
            'Create a Proposal successfully, please continue on your extension',
          onOk: () => {
            navigate('/');
          },
        });
      })
      .catch((err) => {
        console.log(err);
        Modal.error({
          title: 'Error',
          content: err.response.data.message,
        });
      })
      .finally(() => {
        dispatch(finishLoading({}));
      });
  };

  return (
    <div className='create-topic w-full'>
      <div className='px-6 w-full'>
        <div className='header my-4'>
          <span
            className='text-2xl font-bold'
            style={{ color: 'var(--foundation-grey-g-7, #252422)' }}
          >
            Create a post on Discourse
          </span>
        </div>
        <div className='flex w-full mb-4 h-[500px] gap-4'>
          <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold'>Proposal title</div>
            <Input
              className='w-full h-12 px-4 py-[13px]'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className='mb-1 font-bold'>Proposal content</div>
            <div>
              <TextEditor
                value={description}
                setValue={(val: string) => {
                  setDescription(val);
                }}
              />
            </div>
          </div>
          <div className=' w-1/2 text-[15px] overflow-y-scroll border-2 border-solid border-[#E3E3E2] p-4 desc'>
            {parse(description)}
          </div>
        </div>

        <div className='flex flex-row-reverse gap-2'>
          <Button className='h-[46px] text-[17px] font-normal'>Cancel</Button>
          <Button
            type='primary'
            className='h-[46px] text-[17px]'
            onClick={createTopic}
          >
            Publish Proposal
          </Button>
        </div>
      </div>
    </div>
  );
};
