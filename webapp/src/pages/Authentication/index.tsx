import { L } from '@utils/locales/L';
import Google from '@assets/icons/svg-icons/Google';
import Twitter from '@assets/icons/svg-icons/Twitter';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import ButtonLogin from '@components/ButtonLogin';
import ButtonLeft from '@assets/icons/svg-icons/ButtonLeft';
import ButtonRight from '@assets/icons/svg-icons/ButtonRight';
import { useState } from 'react';
import ConnectWallet from '@assets/icons/svg-icons/ConnectWallet';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { Button, Modal } from 'antd';
import { listConnectWallet, listOptionsConnectWallet } from './connectWallet';
import loginBanner from '../../assets/images/loginBanner1.png';

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
    <div className=' w-full h-[100vh] relative flex'>
      <div className='flex absolute top-[2%] left-[1.3%] gap-[3px]'>
        <LogoSyncVote />
        <div className='text-violet-700 text-[20px] font-bold '>Syncvote</div>
      </div>
      <div className='w-[50%] flex flex-col justify-center items-center '>
        <div className='w-[50%]'>
          <p className='text-neutral-800 xl:text-[28px] font-semibold '>
            {L('welcomeToSyncvote')}
          </p>
          <p className='text-neutral-600 xl:text-[15px] font-medium mb-[28px]'>
            {L('logInToStartCreatingYourWorkflows')}
          </p>
          <div className='flex gap-[12px] flex-col'>
            <ButtonLogin
              className='text-[#252422] pl-[15px]'
              Icon={<Google />}
              title={`${L('continueWidth')} ${L('google')}`}
              onClick={handleLogin}
            />
            <div className=' flex gap-[16px] flex-col w-full'>
              <ButtonLogin
                className=' pl-[15px]'
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
                className='pl-[15px]'
                disabled
                Icon={<ConnectWallet />}
                title={`${L('continueWidth')} ${L('twitter')}`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='w-[50%] flex flex-col justify-start relative'>
        <img className='w-full h-full' src={loginBanner} />
        <div className='absolute px-[8.33%] pt-[65%]'>
          <div className='text-white text-[36px] font-semibold'>
            We're transforming the approach individuals use to collectively make
            decisions.
          </div>
          <div className='flex gap-[40%]'>
            <div>
              <div className='text-white text-[28px] font-semibold mt-[25%]'>
                Linh Han
              </div>
              <div className='text-white text-[20px] font-medium mt-[7%]'>
                Co-Founder, Syncvote
              </div>
            </div>
            <div className='flex gap-[12%] self-end'>
              {/* <ButtonLeft />
              <ButtonRight /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
