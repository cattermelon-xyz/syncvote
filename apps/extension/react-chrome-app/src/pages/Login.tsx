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
    <div className='flex flex-col mt-[84px] gap-7 justify-between items-center'>
      <LogoSyncVote width='114' height='87' />
      <Button
        type='default'
        className='flex items-center mr-4'
        onClick={signInWithGoogle}
      >
        <Google />
        <div className='ml-1'>Continue with Google</div>
      </Button>
    </div>
  );
};

export default Login;
