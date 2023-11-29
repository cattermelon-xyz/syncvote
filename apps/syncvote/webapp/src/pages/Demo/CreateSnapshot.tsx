import { Button, Input, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { body, snapshotDesc, useWindowSize } from './funcs';
import TextEditor from 'rich-text-editor/src/TextEditor/TextEditor';
import parse from 'html-react-parser';
import './snapshot.scss';
import moment from 'moment';
import { isExternalProvider } from '@pages/Mission/MissionVotingDetail';
import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import { supabase } from 'utils';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export const CreateSnapshot = () => {
  const location = useLocation();
  const { missions_demo_id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const size = useWindowSize();
  const dispatch = useDispatch();

  const title =
    type === 'idle'
      ? 'IDLE transfer to Leagues'
      : 'stkIDLE transfer to Leagues';
  const [description, setDescription] = useState(snapshotDesc);
  const [discussion, setDiscussion] = useState('');

  const createProposal = async () => {
    dispatch(startLoading({}));
    let web3;
    const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
    const client = new snapshot.Client712(hub);

    if (isExternalProvider(window.ethereum)) {
      web3 = new Web3Provider(window.ethereum);
    }

    if (web3) {
      const accounts = await web3.listAccounts();
      const receipt = await client.proposal(web3, accounts[0], {
        space: 'hectagon.eth',
        type: 'basic',
        title: `[${title}] Testing Syncvote MVP`,
        body: body,
        choices: ['For', 'Against', 'Abstain'],
        start: moment().unix(),
        end: moment().unix() + 3600,
        snapshot: 13620822,
        plugins: JSON.stringify({}),
        app: 'my-app',
        discussion: discussion,
      });

      if (receipt) {
        const something: any = receipt;
        const link = `https://snapshot.org/#/hectagon.eth/proposal/${something?.id}`;

        const { error } = await supabase
          .from('demo_missions')
          .update(
            type === 'idle'
              ? { snapshot_idle_id: link }
              : { snapshot_stidle_id: link }
          )
          .eq('id', Number(missions_demo_id || 1));

        dispatch(finishLoading({}));

        if (!error) {
          Modal.success({
            title: 'Success',
            content: 'Create a snapshot proposal successfully',
          });
        } else {
          console.log(error);

          Modal.error({
            title: 'Error',
            content: 'Create a snapshot proposal fail',
          });
        }
      }
      dispatch(finishLoading({}));
    }
  };
  return (
    <>
      <div className='m-6 w-full'>
        <div className='header mb-4'>
          <span
            className='text-[20px] font-semibold'
            style={{ color: 'var(--foundation-grey-g-7, #252422)' }}
          >
            Create a Snapshot IDLE proposal
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
                Title
              </div>
              <Input
                className='w-full h-12 px-4 py-[13px]'
                disabled
                value={title}
              />
            </div>
            <div className='flex-col mb-3'>
              <div className='text-[#575655] text-[13px] font-normal mb-2'>
                Description
              </div>
              <div>
                <TextEditor
                  value={description}
                  setValue={(val: string) => {
                    setDescription(val);
                    console.log(val);
                  }}
                />
              </div>
            </div>
            <div className='flex-col mb-3'>
              <div className='text-[#575655] text-[13px] font-normal mb-2'>
                Discussion (optional)
              </div>
              <Input
                value={discussion}
                onChange={(e: any) => {
                  setDiscussion(e.target.value);
                }}
                className='w-full h-12 px-4 py-[13px]'
              />
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
              onClick={createProposal}
            >
              Publish on Snapshot
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
