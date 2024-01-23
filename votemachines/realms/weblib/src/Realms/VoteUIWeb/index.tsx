import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Button, Radio, Input } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';
import { createProposal } from '../funcs/createProposal';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, checkpointData } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [governance_address, setGovernanceAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);

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

            <div>
              <div className='flex-col w-full'>
                <div className='text-base mb-1'>Description</div>
                <Input
                  value={description}
                  placeholder='This is description of proposal'
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className='flex-col w-full'>
                <div className='text-base mb-1'>Governance Address</div>
                <Input
                  value={governance_address}
                  placeholder='Governance Address: 5VX99mcbhZW4hXyPvfs4tQze6TamyDPtTncpUD2a9wrz'
                  onChange={(e) => {
                    setGovernanceAddress(e.target.value);
                  }}
                />
              </div>
            </div>

            <Button
              loading={loading}
              disabled={
                title && description && governance_address ? false : true
              }
              onClick={async () => {
                setLoading(true);
                try {
                  const anywindow = window as any;
                  const data = checkpointData?.data;
                  if (!anywindow.phantom.solana.publicKey) {
                    await anywindow.phantom.solana.connect();
                  }

                  const { address, error } = await createProposal(
                    title,
                    description,
                    data?.realms,
                    anywindow?.phantom?.solana,
                    data?.governance_program,
                    data?.proposal_mint,
                    governance_address
                  );
                  if (error) {
                    console.log(error);
                  } else {
                    onSubmit({
                      submission: {
                        proposalId: address,
                      },
                    });
                  }
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
                  return error;
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
