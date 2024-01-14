import { useEffect, useState } from 'react';
import { Card, Button, Radio, Input, Tag } from 'antd';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { IVoteUIWebProps, replaceVariables } from 'directed-graph';
import snapshot from '@snapshot-labs/snapshot.js';
import moment from 'moment';
import { TextEditor } from 'rich-text-editor';
import html2md from 'html-to-md';
import { BorderOutlined } from '@ant-design/icons';

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
  return (
    <div>
      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
          {checkpointData &&
          checkpointData?.data?.action === 'create-proposal' ? (
            <>
              <p className='text-xl font-medium'>Create Proposal</p>
              <div className='flex-col w-full'>
                <div className='text-base mb-1'>Title</div>
                <Input
                  value={title}
                  placeholder='Testing Syncvote MVP'
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <div className='flex-col w-full'>
                <div className='text-base mb-1'>Description</div>
                <TextEditor value={description} setValue={setDiscription} />
              </div>
              {options.length > 0 ? (
                <div>
                  <div>
                    A proposal will be held in{' '}
                    <a href={`https://snapshot.org/#/${space}`} target='_blank'>
                      <Tag>{space}</Tag>
                    </a>{' '}
                    space
                  </div>
                  <div className='font-bold'>
                    Voter can choose among these options:
                  </div>
                  {options.map((option: any, index: number) => {
                    return (
                      <div key={index}>
                        <BorderOutlined className='mr-2' />
                        {option}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <Button
                type='primary'
                className='w-full'
                onClick={async () => {
                  if (isExternalProvider(window.ethereum)) {
                    setWeb3(new Web3Provider(window.ethereum));
                  }
                  if (web3) {
                    const accounts = await web3.listAccounts();
                    const receipt = await client.proposal(web3, accounts[0], {
                      space: checkpointData?.data?.space,
                      type: checkpointData?.data?.type,
                      title: title,
                      body: html2md(description),
                      choices: checkpointData?.data?.snapShotOption,
                      start: moment().unix(),
                      end:
                        moment().unix() +
                        checkpointData?.data?.snapshotDuration,
                      snapshot: 13620822,
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
                }}
              >
                Vote
              </Button>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default VoteUIWeb;
