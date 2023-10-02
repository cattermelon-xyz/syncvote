import {
  CloseCircleOutlined,
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Drawer, Input, Modal, Popover, Space } from 'antd';
import { useState } from 'react';

const MoreButton = ({
  txt = '',
  remove,
  editable,
}: {
  txt?: string;
  remove: () => void;
  editable: boolean;
}) => {
  return (
    <Popover
      trigger='click'
      placement='topRight'
      content={
        <div>
          <div
            onClick={() => {
              navigator.clipboard.writeText(txt);
              Modal.success({
                title: 'Success',
                content: 'Copied to clipboard',
              });
            }}
            className='flex items-center gap-2 cursor-pointer hover:text-violet-500'
          >
            <CopyOutlined />
            Copy
          </div>
          {editable ? (
            <div
              onClick={remove}
              className='flex items-center gap-2 cursor-pointer hover:text-violet-500'
            >
              <DeleteOutlined />
              Delete
            </div>
          ) : null}
        </div>
      }
    >
      <EllipsisOutlined className='mx-2 font-bold' />
    </Popover>
  );
};

const AddNewDrawer = ({
  addNewDrawerVisibility,
  setAddNewDrawerVisibility,
  addIdentity,
}: {
  addNewDrawerVisibility: boolean;
  setAddNewDrawerVisibility: (visibility: boolean) => void;
  addIdentity: (identity: string) => void;
}) => {
  const [newIdentity, setNewIdentity] = useState('');
  // TODO: verify gmail, eth and sol address
  // example:
  // ---
  // import {PublicKey} from '@solana/web3.js'
  // const owner = new PublicKey("DS2tt4BX7YwCw7yrDNwbAdnYrxjeCPeGJbHmZEYC8RTb");
  // console.log(PublicKey.isOnCurve(owner.toBytes())); // true
  // ---
  // import { isAddress } from 'web3-validator';
  // isAddress('blah');
  return (
    <Drawer
      open={addNewDrawerVisibility}
      onClose={() => {
        setAddNewDrawerVisibility(false);
      }}
      title='Add New Identity'
    >
      <Space direction='vertical' size='small' className='w-full'>
        <div className='text-sm'>
          Supported identity: gmail account, Ethereum and Solana public key
        </div>
        <Input
          placeholder='Identity'
          className='w-full'
          value={newIdentity}
          onChange={(e) => setNewIdentity(e.target.value)}
        />
      </Space>
      <Button
        className='w-full mt-4'
        onClick={() => {
          addIdentity(newIdentity);
          setNewIdentity('');
          setAddNewDrawerVisibility(false);
        }}
      >
        Add
      </Button>
    </Drawer>
  );
};

type AllowedByIdentityProps = {
  identity: string[];
  setIdentity: (identity: string[]) => void;
  editable: boolean;
};

const AllowedByIdentity = (props: AllowedByIdentityProps) => {
  const { identity, setIdentity, editable } = props;
  const [addNewDrawerVisibility, setAddNewDrawerVisibility] = useState(false);
  return (
    <Space direction='vertical' size='middle' className='w-full'>
      <Space direction='horizontal' className='flex justify-between'>
        <div className='text-sm'>List of identity</div>
        <div className='flex gap-2'>
          <Checkbox
            checked={identity.indexOf('proposer') !== -1}
            onClick={() => {
              const newIdentity = [...identity];
              const index = newIdentity.indexOf('proposer');
              if (index === -1) {
                newIdentity.unshift('proposer');
              } else {
                newIdentity.splice(index, 1);
              }
              setIdentity(newIdentity);
            }}
          />
          Include proposer?
        </div>
      </Space>
      <Space direction='vertical' size='small' className='w-full'>
        {identity.map((id, index) => (
          <div className='w-full flex justify-between flex-row' key={id}>
            <Input
              className='w-full flex-grow'
              value={id}
              onChange={(e) => {
                const newIdentity = [...identity];
                newIdentity[index] = e.target.value;
                setIdentity(newIdentity);
              }}
              suffix={
                id !== 'proposer' ? (
                  <CloseCircleOutlined
                    onClick={() => {
                      const newIdentity = [...identity];
                      newIdentity.splice(index, 1);
                      setIdentity(newIdentity);
                    }}
                  />
                ) : null
              }
              disabled={id === 'proposer'}
            />
            {id !== 'proposer' ? (
              <MoreButton
                txt={id}
                editable={editable}
                remove={() => {
                  const newIdentity = [...identity];
                  newIdentity.splice(index, 1);
                  setIdentity(newIdentity);
                }}
              />
            ) : null}
          </div>
        ))}
      </Space>
      <Space
        direction='horizontal'
        size='small'
        className='w-full flex justify-between'
      >
        {/* <Button
          type="link"
          icon={<DatabaseOutlined />}
          className="flex items-center pl-0"
          disabled
        >
          Link to a datasource
        </Button> */}
        <Button
          type='link'
          icon={<PlusOutlined />}
          className='flex items-center pr-0 pl-0'
          onClick={() => {
            setAddNewDrawerVisibility(true);
          }}
        >
          Add a new Identity
        </Button>
      </Space>
      <AddNewDrawer
        addNewDrawerVisibility={addNewDrawerVisibility}
        setAddNewDrawerVisibility={setAddNewDrawerVisibility}
        addIdentity={(newIdentity: string) => {
          setIdentity([...identity, newIdentity]);
        }}
      />
    </Space>
  );
};

export default AllowedByIdentity;
