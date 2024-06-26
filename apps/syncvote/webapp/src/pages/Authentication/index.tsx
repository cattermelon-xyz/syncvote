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
import { supabase } from 'utils';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { Button, Modal } from 'antd';
import { listConnectWallet, listOptionsConnectWallet } from './connectWallet';
import loginBanner from '../../assets/images/loginBanner1.png';
import PublicPageRedirect from '@middleware/logic/publicPageRedirect';
import { useNavigate } from 'react-router-dom';

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
    PublicPageRedirect.confirm();
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
  const navigate = useNavigate();
  return (
    <div className='w-full h-[80vh] flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <div
          className='flex gap-[3px] cursor-pointer'
          onClick={() => navigate('/')}
        >
          <LogoSyncVote />
        </div>
        
        <div className='text-center mt-[12px]'>
          <p className='text-neutral-800 xl:text-[36px] font-semibold mb-3 '>
            {L('welcomeToSyncvote')}
          </p>
          <div className='text-neutral-500 text-[16px] font-medium mb-16'>
          We're transforming the approach individuals use to collectively make
          decisions.
        </div>
          <p className='text-neutral-500 xl:text-[15px] font-medium mb-[16px]'>
            {L('logInToStartCreatingYourWorkflows')}
          </p>
        </div>

        <div className='flex flex-col gap-[16px]'>
          <ButtonLogin
            className='text-[#252422] pl-[36px] pr-[36px]'
            Icon={<Google />}
            title={`${L('continueWidth')} ${L('google')}`}
            onClick={handleLogin}
          />
          {/* <ButtonLogin
            className='pl-[36px] pr-[36px]'
            disabled
            Icon={<Twitter />}
            title={`${L('continueWidth')} ${L('twitter')}`}
          /> */}
          {/* <div className='flex items-center justify-between w-full'>
                <hr className='border-[#D9D9D9] border-t-1 flex-grow' />
                <p className='text-[15px] mx-4'>or</p>
                <hr className='border-[#D9D9D9] border-t-1 flex-grow' />
              </div>
              <ButtonLogin
                className='pl-[15px]'
                disabled
                Icon={<ConnectWallet />}
                title={`${L('continueWidth')} ${L('twitter')}`}
              /> */}
        </div>
      </div>

      {/*<div className='w-[50%] flex flex-col justify-start relative'>
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
                <ButtonLeft />
                <ButtonRight />
              </div>
            </div> */}
    </div>
  );
}

export default Login;
