import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { Button } from 'antd';
import LogoSyncVoteBlack from '@assets/icons/svg-icons/LogoSyncVoteBlack';
import { WalletOutlined } from '@ant-design/icons';
import { useSDK } from '@metamask/sdk-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ModalConnectWallet: React.FC<Props> = ({ open, onClose, onOpen }) => {
  const handleConnect = async () => {
    onOpen();
  };

  return (
    <>
      <Modal
        open={open}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
        }}
        maskClosable={false}
        closable={false}
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
