import { L } from '@utils/locales/L';
import Google from '@assets/icons/svg-icons/Google';
import Twitter from '@assets/icons/svg-icons/Twitter';
import ButtonLogin from '@components/ButtonLogin';
import { useState } from 'react';
import ConnectWallet from '@assets/icons/svg-icons/ConnectWallet';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { Modal } from 'antd';
import { listConnectWallet, listOptionsConnectWallet } from './connectWallet';

function Login() {
  const [selectedOption, setSelectedOption] = useState(
    listOptionsConnectWallet[0]
  );
  const renderListConnectWallet = listConnectWallet.filter(
    (value) => value.optionId === selectedOption.id
  );

  const handleSelectChange = (event: any) => {
    setSelectedOption(event);
  };

  const dispatch = useDispatch();
  const handleLogin = async () => {
    dispatch(startLoading({}));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    dispatch(finishLoading({}));
    if (error) {
      Modal.error({
        title: L('error'),
        content: error.message || '',
      });
    }
  };
  return (
    <div className='bg-connect w-full'>
      <div className='container mx-auto'>
        <div className='w-full'>
          <div className='w-[50%] flex flex-col justify-start items-center float-left h-[456px]'>
            <div className='w-[374px]'>
              <p className='text-neutral-800 text-[28px] font-semibold leading-loose tracking-wide'>
                {L('welcomeToSyncvote')}
              </p>
              <p className='text-neutral-600 text-[15px] font-medium mb-[28px]'>
                {L('logInToStartCreatingYourWorkflows')}
              </p>
              <div className='flex gap-[12px] flex-col items-center'>
                <ButtonLogin
                  className='text-[#252422] w-full'
                  Icon={<Google />}
                  title={`${L('continueWidth')} ${L('google')}`}
                  onClick={handleLogin}
                />
                <div className=' flex gap-[16px] flex-col w-full'>
                  <ButtonLogin
                    className='w-full'
                    disabled
                    Icon={<Twitter />}
                    title={`${L('continueWidth')} ${L('twitter')}`}
                  />
                  <div className='flex items-center justify-between w-full'>
                    <hr className='border-[#D9D9D9] border-t-1 flex-grow' />
                    <p className='text-[15px] mx-4'>or</p>
                    <hr className='border-[#D9D9D9] border-t-1 flex-grow' />
                  </div>
                  <ButtonLogin
                    className='w-full'
                    disabled
                    Icon={<ConnectWallet />}
                    title={`${L('continueWidth')} ${L('twitter')}`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-[50%] flex flex-col justify-start items-center float-right h-[456px] '></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
