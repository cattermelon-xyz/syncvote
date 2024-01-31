import React from 'react';
import LogoSyncVote from '@assets/icons/LogoSyncVote';
import { Button } from 'antd';
import Google from '@assets/icons/Google';
import { supabase } from '@configs/supabaseClient';
import { useEffect } from 'react';
import { resetLastProposalId } from '../utils';

const Login = () => {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    // tell background service worker to create a new tab with that url
    await chrome.runtime.sendMessage({
      action: 'signInWithGoogle',
      payload: { url: data.url },
    });
  };

  useEffect(() => {
    resetLastProposalId();
  });

  return (
    <div className='flex flex-col mt-[84px] gap-16 justify-between items-center'>
      <div className='flex flex-col gap-6 items-center'>
        <LogoSyncVote width='130' height='100' color='#383838' />
        <div className='flex flex-col gap-4 text-center w-full'>
          <div className='text-2xl text-color-gray-700 font-bold'>
            Welcome to SyncVote
          </div>
          <div className='text-xs text-color-gray-600'>
            Create and keep track your proposal
          </div>
        </div>
      </div>

      <div className='w-[320px] flex flex-col gap-4'>
        <Button
          type='default'
          className='flex items-center w-full h-[52px]'
          onClick={signInWithGoogle}
        >
          <Google />
          <div className='ml-2 text-base'>Continue with Google</div>
        </Button>
        <div className='text-base text-gray-600 w-full text-center'>
          Please reopen the plugin after logged in
        </div>
      </div>
    </div>
  );
};

export default Login;
