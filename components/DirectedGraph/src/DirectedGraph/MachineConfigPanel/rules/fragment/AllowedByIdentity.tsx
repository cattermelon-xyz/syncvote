import {
  CloseCircleOutlined,
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Input, Modal, Popover, Space } from 'antd';
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
          Identity can be an address, a gmail or twitter account
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
      <div className='text-sm'>List of identity</div>
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
                <CloseCircleOutlined
                  onClick={() => {
                    const newIdentity = [...identity];
                    newIdentity.splice(index, 1);
                    setIdentity(newIdentity);
                  }}
                />
              }
            />
            <MoreButton
              txt={id}
              editable={editable}
              remove={() => {
                const newIdentity = [...identity];
                newIdentity.splice(index, 1);
                setIdentity(newIdentity);
              }}
            />
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
