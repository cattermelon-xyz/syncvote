import React from 'react';
import { useEffect, useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';
import { Card, Button, Radio, Input } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';
import ABI_GOVERNER from '../../utils/abis/OzGovernor_ABI.json';
const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, checkpointData } = props;
  const [title, setTitle] = useState('');
  const [description, setDiscription] = useState('');
  const [address, setAddress] = useState('');

  const { connected } = useSDK();

  return (
    <div>
      <Card className='p-4'>
        {connected ? (
          <div className='flex flex-col gap-6'>
            <Button
              onClick={async () => {
                const addressArray = await window.ethereum.request({
                  method: 'eth_requestAccounts',
                });

                console.log(addressArray);
                
                setAddress(addressArray[0]);
              }}
            >
              Connect Wallet
            </Button>
            <Button
              onClick={async () => {
                if (window.ethereum) {
                  const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                  );
                  const signer = provider.getSigner();

                  const governer = new ethers.Contract(
                    checkpointData?.data.governer,
                    ABI_GOVERNER,
                    signer
                  );
                  let tx = await governer.propose(
                    checkpointData?.data?.token,
                    0,
                    0,
                    'Testing create proposal'
                  );
                  await tx.wait();
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
