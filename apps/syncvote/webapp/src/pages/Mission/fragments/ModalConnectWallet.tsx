import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { Button } from 'antd';
import LogoSyncVoteBlack from '@assets/icons/svg-icons/LogoSyncVoteBlack';
import { WalletOutlined } from '@ant-design/icons';
import { useSDK } from '@metamask/sdk-react';

interface Props {
  open: boolean;
  onClose: () => void;
  setAccount?: any;
}

const ModalConnectWallet: React.FC<Props> = ({ open, onClose, setAccount }) => {
  const { sdk } = useSDK();
  const handleConnect = async () => {
    try {
      console.log(sdk);
      const accounts = await sdk?.connect();

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0]);
        console.log(accounts[0]);
      }
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }

    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          onClose();
        }}
        width={720}
        footer={null}
      >
        <div className='flex flex-col gap-7 justify-between items-center my-[90px]'>
          <LogoSyncVoteBlack />
          <p className='text-2xl'>Welcome to Syncvote</p>
          <p className='text-sm'>Please connect wallet to continue</p>
          <Button
            type='default'
            className='flex items-center mr-4 w-[300px] h-[54px]'
            onClick={handleConnect}
          >
            <WalletOutlined />
            Connect Wallet
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConnectWallet;
