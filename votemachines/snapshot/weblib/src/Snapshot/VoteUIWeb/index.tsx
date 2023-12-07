import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import Client from '@snapshot-labs/snapshot.js/dist/sign';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';

interface Props {
  proposalData: any;
  onSelectedOption: any;
  currentCheckpointData: any;
  client?: Client;
}

interface ExtendedWindow extends Window {
  ethereum?: ExternalProvider;
}

declare let window: ExtendedWindow;

function isExternalProvider(provider: any): provider is ExternalProvider {
  return provider && typeof provider.request === 'function';
}

const VoteUIWeb = (props: Props): JSX.Element => {
  const { proposalData, currentCheckpointData, onSelectedOption, client } =
    props;

  const [selectedOption, setSelectedOption] = useState<number>();

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    console.log('selectedOption', selectedOption);
  }, [selectedOption]);

  const createVote = async () => {
    let web3;
    if (isExternalProvider(window.ethereum)) {
      web3 = new Web3Provider(window.ethereum);
    }

    if (web3 && client && selectedOption) {
      const accounts = await web3.listAccounts();
      const receipt = await client.vote(web3, accounts[0], {
        space: currentCheckpointData?.data?.space,
        proposal: proposalData?.id,
        type: currentCheckpointData?.data?.type?.value,
        choice: selectedOption - 1,
        reason: 'Choice 1 make lot of sense',
        app: 'my-app',
      });
    }
  };

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-6'>
        <p className='text-xl font-medium'>Vote</p>
        {proposalData && (
          <>
            {proposalData.choices.map((option: any, index: any) => (
              <Card className='w-full' key={index}>
                {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                <Radio
                  checked={selectedOption === index + 1}
                  onChange={() => setSelectedOption(index + 1)}
                >
                  {`${index + 1}. ${option}`}
                </Radio>
              </Card>
            ))}
          </>
        )}

        <Button
          type='primary'
          className='w-full'
          onClick={async () => {
            await createVote();
          }}
          disabled={
            selectedOption
              ? // && getTimeRemainingToEnd(currentCheckpointData.endToVote) !='expired'
                false
              : true
          }
        >
          Vote
        </Button>
      </div>
    </Card>
  );
};

export default VoteUIWeb;
