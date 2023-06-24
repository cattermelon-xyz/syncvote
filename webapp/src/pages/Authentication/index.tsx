import { L } from '@utils/locales/L';
import Google from '@assets/icons/svg-icons/Google';
import Facebook from '@assets/icons/svg-icons/Facebook';
import Twitter from '@assets/icons/svg-icons/Twitter';
import Discord from '@assets/icons/svg-icons/Discord';
import ButtonLogin from '@components/ButtonLogin';
import { useState } from 'react';
import CommonSelectBox from '@components/SelectBox';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { Modal } from 'antd';
import { listConnectWallet, listOptionsConnectWallet } from './connectWallet';

function Login() {
  const [selectedOption, setSelectedOption] = useState(listOptionsConnectWallet[0]);
  const renderListConnectWallet = listConnectWallet.filter(
    (value) => value.optionId === selectedOption.id,
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
    <div className="bg-connect text-center w-full">
      <div className="container mx-auto">
        <p className="text-[#252524] text-[34px] font-semibold text-center w-full m-auto mb-[16px] mt-[103px] leading-[41px]">
          {L('shapeTheFutureOfYourDaoThroughVoting')}
        </p>
        <p className="text-[22px] font-normal leading-[28px] mb-[80px]">
          {L('signInOrConnectWalletToVote')}
        </p>
        <div className="w-full">
          <div className="w-[50%] flex flex-col justify-start items-center float-left border-r-[0.5px] border-solid border-[#E3E3E2] h-[456px]">
            <div className="w-[400px]">
              <p className="text-[28px] leading-[48px] text-[#575655] mb-[24px] h-[48px]">
                {L('signIn')}
              </p>
              <div className="flex gap-[20px] flex-col items-center">
                <ButtonLogin
                  className="text-[#252422] w-full"
                  Icon={<Google />}
                  title={`${L('continueWidth')} ${L('google')}`}
                  onClick={handleLogin}
                />
                <ButtonLogin
                  className="w-full"
                  disabled
                  Icon={<Facebook />}
                  title={`${L('continueWidth')} ${L('facebook')}`}
                />
                <ButtonLogin
                  className="w-full"
                  disabled
                  Icon={<Twitter />}
                  title={`${L('continueWidth')} ${L('twitter')}`}
                />
                <ButtonLogin
                  className="w-full"
                  disabled
                  Icon={<Discord />}
                  title={`${L('continueWidth')} ${L('discord')}`}
                />
              </div>
            </div>
          </div>
          <div className="w-[50%] flex flex-col justify-start items-center float-right border-l-[0.5px] border-solid border-[#E3E3E2] h-[456px] ">
            <div className="w-[400px]">
              <div className="flex flex-row gap-[24px] items-center justify-between mb-[24px]">
                <p className="text-[28px] leading-[34px] text-[#575655]">
                  {L('connectWalletOnly')}
                </p>
                <CommonSelectBox
                  sizeTextClass="text-[17px] text-[#252422]"
                  divClass="!w-[unset]"
                  options={listOptionsConnectWallet}
                  defaultValue={selectedOption}
                  onChange={handleSelectChange}
                  borderClassName="border-none leading-[30px] p-[12px] bg-[#F6F6F6] max-w-[162px] rounded-[16px] !justify-center max-h-[48px]"
                  dropDownClassName="w-[211px] left-[calc(100%-211px)]"
                  iconDropDownClassName="w-[12px] !h-[6px]"
                />
              </div>
              <div className="flex gap-[20px] flex-col items-center">
                {renderListConnectWallet.map((value) => (
                  <ButtonLogin
                    className="text-[#252422] w-full"
                    key={value.id}
                    Icon={value.icon}
                    title={value.label}
                    disabled
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
