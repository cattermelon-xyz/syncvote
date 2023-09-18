import Logo from '@assets/icons/svg-icons/Logo';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import { Space } from 'antd';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='bg-white w-full flex-col'>
      <div
        className='flex flex-row w-full'
        style={{ border: '1px solid #E3E3E2' }}
      >
        <div
          className='flex text-center items-top pt-16 pb-20'
          style={{ borderRight: '1px solid #E3E3E2', width: '47%' }}
        >
          <div className='flex items-top w-1/2 justify-end text-violet-500 text-xl'>
            <LogoSyncVote />
            <div className='ml-2'>SyncVote</div>
          </div>
          <div className='ml-10 w-1/3 flex justify-start text-left'>
            We're transforming the approach individuals use to collectively make
            decisions.
          </div>
        </div>
        <div
          className='flex flex-row pt-16 pb-20 justify-center'
          style={{ width: '53%' }}
        >
          <div className='mr-24 flex flex-col gap-4'>
            <div className='text-violet-500 text-base'>Resource</div>
            <div>Docs</div>
          </div>
          <div className='mr-24 flex flex-col gap-4'>
            <div className='text-violet-500 text-base'>Legal</div>
            <div>Term of use</div>
            <div>Privacy policy</div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-violet-500 text-base'>Join our community</div>
            <div className='flex flex-row gap-4'>
              <FaTwitter className='text-base' />
              <FaDiscord className='text-base' />
              <FaGithub className='text-base' />
            </div>
          </div>
        </div>
      </div>
      <div className='text-zinc-400 w-full text-center py-12 border-t border-gray-400'>
        <p>Copyright @ 2023. All rights reserved.</p>
        <p className='text-sm text-gray-200'>version 20230918</p>
      </div>
    </div>
  );
};

export default Footer;
