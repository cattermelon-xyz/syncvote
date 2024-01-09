import React from 'react';
import { useEffect, useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import { Log, ethers } from 'ethers';
import { Card, Button, Radio, Input } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';
import ABI_GOVERNOR from '../../utils/abis/OzGovernor_ABI.json';
import ABI_TOKEN from '../../utils/abis/ERC20Votes_ABI.json';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, checkpointData } = props;
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { connected } = useSDK();

  return (
    <div>
      <Card className='p-4'>
        {connected ? (
          <div className='flex flex-col gap-6'>
            <div>
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
            </div>
            <Button
              loading={loading}
              disabled={title ? false : true}
              onClick={async () => {
                if (window.ethereum) {
                  setLoading(true);
                  const provider = new ethers.BrowserProvider(window.ethereum);
                  const signer = await provider.getSigner();
                  console.log(checkpointData?.data.governor);

                  const governor = new ethers.Contract(
                    checkpointData?.data.governor,
                    ABI_GOVERNOR,
                    signer
                  );
                  const addressArray = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                  });

                  let tx = await governor.propose(
                    addressArray,
                    [0],
                    ['0x'],
                    title
                  );
                  const signature = await tx.wait();

                  const new_tx = await provider.getTransactionReceipt(
                    signature.hash
                  );
                  if (new_tx !== null) {
                    const log: any = new_tx.logs[0];

                    const parsedLog = governor.interface.parseLog(log);
                    if (parsedLog) {
                      const proposaId = parsedLog.args[0].toString();
                      onSubmit({
                        submission: {
                          proposalId: proposaId,
                        },
                      });
                    }
                  }

                  setLoading(false);
                }
              }}
            >
              Create proposal
            </Button>
          </div>
        ) : (
          <>
            <div>Need connect wallet to create proposal</div>
          </>
        )}
      </Card>
    </div>
  );
};

export default VoteUIWeb;
