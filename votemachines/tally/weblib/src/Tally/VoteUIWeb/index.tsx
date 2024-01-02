import React from 'react';
import { useEffect, useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';
import { Card, Button, Radio, Input } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';
import ABI_GOVERNOR from '../../utils/abis/OzGovernor_ABI.json';
import ABI_TOKEN from '../../utils/abis/ERC20Votes_ABI.json';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, checkpointData } = props;
  const [title, setTitle] = useState('');
  const [description, setDiscription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { connected } = useSDK();

  return (
    <div>
      <Card className='p-4'>
        {connected ? (
          <div className='flex flex-col gap-6'>
            <Button
              loading={loading}
              onClick={async () => {
                if (window.ethereum) {
                  setLoading(true);
                  const provider = new ethers.BrowserProvider(window.ethereum);

                  // const provider = new ethers.providers.Web3Provider(
                  //   window.ethereum
                  // );
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
                    'Testing create proposal'
                  );
                  const signature = await tx.wait();
                  console.log('Signature', signature);

                  setLoading(false);
                }
              }}
            >
              Get signer
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
