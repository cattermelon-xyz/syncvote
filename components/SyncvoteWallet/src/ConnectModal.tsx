import { Button, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import wallets from './wallets';
import { getAccount } from './interface';
import { CaretLeftOutlined, WarningOutlined } from '@ant-design/icons';

const ChainSelector = ({
  wallet,
  setAccount,
}: {
  wallet: any;
  setAccount: any;
}) => {
  const { chains, icon } = wallet;
  return (
    <Space direction='vertical' size='middle' className='w-full mt-2'>
      <Space
        direction='vertical'
        size='small'
        className='flex flex-col text-center'
      >
        {icon}
        <div className='text-slate-500'>
          This wallet support multiple chains. Select which chains you'd like to
          connect to
        </div>
      </Space>

      <Space direction='vertical' size='small' className='w-full'>
        {chains.map((selectedChain: any) => {
          const { name, icon } = selectedChain || {};
          return (
            <Button
              key={name}
              className='flex flex-row items-center w-full'
              size='large'
              icon={icon}
              onClick={async () => {
                const { account, chain, wallet } =
                  (await selectedChain?.connect()) || {};
                if (account) {
                  setAccount(account);
                  console.log(account, chain);
                }
              }}
            >
              {name}
            </Button>
          );
        })}
      </Space>
    </Space>
  );
};

const WalletSelector = ({
  setWallet,
  setAccount,
}: {
  setWallet: any;
  setAccount: any;
}) => {
  return (
    <Space direction='vertical' size='middle' className='w-full mt-2'>
      {wallets.map((wallet) => {
        const { name, icon, chains } = wallet;
        return (
          <div className='flex flex-col gap-1'>
            <Button
              key={name}
              icon={icon}
              onClick={async () => {
                if (chains.length > 1) {
                  setWallet(wallet);
                } else {
                  const { account, chain, wallet } =
                    (await chains[0].connect()) || {};
                  if (account) {
                    setAccount(account);
                    console.log(account, chain);
                  }
                }
                // TODO: connect to wallet
              }}
              className='flex flex-row w-full items-center'
              size='large'
              disabled={!wallet.available}
            >
              {name}
            </Button>
            {wallet.title && (
              <div className='text-red-500 flex flex-row items-center'>
                <WarningOutlined className='mr-1' />
                <div>{wallet.title}</div>
              </div>
            )}
          </div>
        );
      })}
    </Space>
  );
};

const ConnectModal = ({ open, onCancel }: { open: boolean; onCancel: any }) => {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    setAccount(getAccount());
    const anyWindow = window as any;
    anyWindow.ethereum?.on('accountsChanged', (accounts: any) => {
      console.log('accounts changed: ', accounts);
      setAccount(accounts[0]);
    });
  });
  return (
    <Modal
      width={360}
      open={open}
      onCancel={() => {
        onCancel();
        setWallet(null);
      }}
      closable={false}
      title={
        !wallet ? (
          'Choose a wallet'
        ) : (
          <div className='w-full flex items-center'>
            <Button
              onClick={() => setWallet(null)}
              icon={<CaretLeftOutlined />}
              type='text'
            />
            <div className='w-full text-center'>Select a chain</div>
          </div>
        )
      }
      footer={null}
    >
      {!wallet ? (
        <WalletSelector
          setWallet={setWallet}
          setAccount={(prop: any) => {
            setAccount(prop);
            onCancel();
          }}
        />
      ) : (
        <ChainSelector
          wallet={wallet}
          setAccount={(prop: any) => {
            setAccount(prop);
            onCancel();
          }}
        />
      )}
    </Modal>
  );
};

export default ConnectModal;
