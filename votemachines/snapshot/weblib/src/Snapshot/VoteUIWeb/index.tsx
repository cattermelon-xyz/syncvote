import { useEffect, useState } from 'react';
import { Card, Button, Radio, Input, Tag, Divider, Modal } from 'antd';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import {
  IVoteUIWebProps,
  replaceVariables,
  shortenString,
} from 'directed-graph';
import snapshot from '@snapshot-labs/snapshot.js';
import moment from 'moment';
import { TextEditor } from 'rich-text-editor';
import html2md from 'html-to-md';
import { BorderOutlined, FileOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import axios from 'axios';

export type Receipt = {
  id: string;
  ipfs: string;
  relayer: {
    address: string;
    receipt: string;
  };
};

function isReceipt(data: any): data is Receipt {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.ipfs === 'string' &&
    typeof data.relayer === 'object' &&
    data.relayer !== null &&
    typeof data.relayer.address === 'string' &&
    typeof data.relayer.receipt === 'string'
  );
}

function isExternalProvider(provider: any): provider is ExternalProvider {
  return provider && typeof provider.request === 'function';
}

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, checkpointData, missionData } = props;
  const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
  const client = new snapshot.Client712(hub);
  const [web3, setWeb3] = useState<Web3Provider>();
  const [title, setTitle] = useState(missionData?.m_title || '');
  const defaultDescription = checkpointData?.data?.template || '';
  const variables = props?.missionData?.data?.variables || {};
  const [description, setDiscription] = useState('');
  useEffect(() => {
    replaceVariables(defaultDescription, variables, (val: any) => {
      setDiscription(val);
    });
  }, []);

  const options = checkpointData?.data?.snapShotOption || [];
  const space = checkpointData?.data?.space || '';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkpointData && checkpointData?.data?.action === 'sync-proposal') {
      axios
        .post(`${import.meta.env.VITE_SERVER_URL}/vote/create`, {
          mission_id: missionData?.mission_id,
          identify: 'everyone',
        })
        .then((respone) => {
          console.log('Vote respone', respone);
        });
    }
  }, []);

  const submitSnapshot = async () => {
    if (isExternalProvider(window.ethereum)) {
      setWeb3(new Web3Provider(window.ethereum));
    }
    if (web3) {
      // get Network lasted block
      const clientApollo = new ApolloClient({
        uri: 'https://hub.snapshot.org/graphql',
        cache: new InMemoryCache(),
      });

      const respone = await clientApollo.query({
        query: gql`
        query {
          space(id: "${checkpointData?.data.space}") {
            network
          }
        }
      `,
      });

      const provider = snapshot.utils.getProvider(respone.data?.space?.network);

      const accounts = await web3.listAccounts();
      const receipt = await client.proposal(web3, accounts[0], {
        space: checkpointData?.data?.space,
        type: checkpointData?.data?.type,
        title: title,
        body: html2md(description),
        choices: checkpointData?.data?.snapShotOption,
        start: moment().unix(),
        end: moment().unix() + checkpointData?.data?.snapshotDuration,
        snapshot: await provider.getBlockNumber(),
        plugins: JSON.stringify({}),
        app: 'my-app',
        discussion: '',
      });

      if (isReceipt(receipt)) {
        onSubmit({
          submission: {
            proposalId: receipt.id,
          },
        });
      }
    }
  };
  const [showTemplate, setShowTemplate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className='flex flex-col h-full justify-between w-full items-center'>
      <Modal
        className='rounded-xl'
        open={showTemplate}
        title='Template'
        onCancel={() => setShowTemplate(false)}
        footer={null}
      >
        <div className='border rounded-md'>
          {parse(checkpointData?.data?.template || '')}
        </div>
      </Modal>

      <Modal
        open={showConfirm}
        title='Confirm Submission'
        onCancel={() => setShowConfirm(false)}
        footer={
          <div>
            <Button
              className='px-8'
              type='primary'
              onClick={() => submitSnapshot()}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className='flex flex-col gap-4'>
          <div className='rounded border border-gray-300 border-solid p-2'>
            <div className='text-md font-bold'>{title}</div>
            {parse(shortenString(description, 200) || '')}
          </div>
          <div className='rounded border border-gray-300 border-solid p-2 flex flex-col gap-3'>
            <div className='flex flex-row justify-between'>
              <div>Snapshot Space</div>
              <div>
                <a
                  href={`https://snapshot.org/#/${space}`}
                  target='_blank'
                  className='text-gray-500'
                >
                  {space}
                </a>
              </div>
            </div>
            <div className='flex flex-row justify-between '>
              <div>Voting option</div>
              <div>{options.join(' / ')}</div>
            </div>
          </div>
        </div>
      </Modal>

      {checkpointData && checkpointData?.data?.action === 'create-proposal' ? (
        <>
          <div className='w-full flex flex-col' style={{ maxWidth: '700px' }}>
            <div className='mb-8'>
              <div className='mb-2 text-gray-500'>
                Create a new Proposal on Snapshot
              </div>
              <input
                type='text'
                className='w-full border-none text-4xl focus:outline-none focus:border-none'
                placeholder='Proposal Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='flex flex-row relative'>
              <Button
                icon={<FileOutlined />}
                shape='circle'
                size='large'
                className='absolute '
                style={{ left: '-60px' }}
                onClick={() => setShowTemplate(true)}
                title='Show Template'
              />
              <div className='flex flex-col w-full'>
                <TextEditor
                  value={description}
                  setValue={setDiscription}
                  onReady={(editor) => {
                    editor.editing.view.change((writer: any) => {
                      writer.setStyle(
                        //use max-height(for scroll) or min-height(static)
                        'min-height',
                        '450px',
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <Divider className='my-1' />
            <div className='w-full flex flex-row-reverse pt-2 pb-3 pr-5 items-center'>
              {/* TODO: double click bug & if wallet is not connected, there is not try to connect it */}
              <Button type='primary' loading={loading} onClick={submitSnapshot}>
                Submit
              </Button>
            </div>
          </div>
        </>
      ) : null}
      {/* </Card> */}
    </div>
  );
};

export default VoteUIWeb;
