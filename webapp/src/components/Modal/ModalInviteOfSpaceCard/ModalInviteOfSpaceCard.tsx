import React, { useEffect, useState } from 'react';
import { Modal, Space, Button, Input, Alert, Dropdown } from 'antd';
// import { queryOrgByIdForInvite } from '@middleware/data';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryUserByEmail,
  inviteExistingMember,
  inviteUserByEmail,
} from '@middleware/data';
import Icon from '@components/Icon/Icon';
import { IProfile } from '@types';
import { LinkOutlined, DownOutlined } from '@ant-design/icons';
import { unsecuredCopyToClipboard, createIdString } from '@utils/helpers';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import type { MenuProps } from 'antd';

interface ModalInviteOfSpaceCardProps {
  visible: boolean;
  onClose: () => void;
  dataSpace: any;
}

const ModalInviteOfSpaceCard: React.FC<ModalInviteOfSpaceCardProps> = ({
  visible,
  onClose,
  dataSpace,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [modalText, setModalText] = useState('Content of the modal');
  const [usersInOrg, setUsersInOrg] = useState<IProfile[]>();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const org = orgs.find((tmp: any) => tmp.id === dataSpace.id);

  useEffect(() => {
    if (visible) {
      setUsersInOrg(org.profile);
    }
  }, [dataSpace.id, visible, org]);

  useEffect(() => {
    console.log('usersInOrg', usersInOrg);
  }, [usersInOrg]);

  const handleInvite = async () => {
    setIsLoading(true);
    dispatch;
    queryUserByEmail({
      email,
      dispatch,
      onSuccess: (data: any) => {
        if (data?.length > 0) {
          console.log('data member when invite', data);
          const presetIcon = data[0]?.preset_icon_url
            ? `preset:${data[0].preset_icon_url}`
            : data[0].preset_icon_url;
          const idata: any = {
            org_id: dataSpace.id,
            id_user: data[0].id,
            to_email: email,
            full_name: data[0].full_name,
            avatar_url: data[0].icon_url ? data[0].icon_url : presetIcon,
            org_title: org.title,
            inviter: user.full_name,
          };
          inviteExistingMember({
            data: idata,
            dispatch,
            onSuccess: () => {
              setIsLoading(false);
              Modal.success({
                title: 'Success',
                content: 'Invite user successfully',
              });
            },
            onError: () => {
              setIsLoading(false);
              Modal.error({
                title: 'Error',
                content: 'Cannot invite user',
              });
            },
          });
        } else {
          inviteUserByEmail({
            email,
            dispatch,
            onSuccess: () => {
              setIsLoading(false);
              Modal.success({
                title: 'Success',
                content: 'Invite user successfully',
              });
            },
            onError: () => {
              setIsLoading(false);
              Modal.error({
                title: 'Error',
                content: 'Cannot invite user',
              });
            },
          });
        }
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Cannot retrieve user data',
        });
      },
    });
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    console.log('oke em');
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCopyLink = () => {
    const baseURL = window.location.origin;
    const idString = createIdString(dataSpace.title, dataSpace.id.toString());
    const fullURL = `${baseURL}/${idString}`;
    unsecuredCopyToClipboard(fullURL);
  };

  const handleRemove = () => {};

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <p className='text-base'>Editor</p>,
    },
    {
      key: '3',
      label: (
        <p className='text-base' onClick={handleRemove}>
          Remove
        </p>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={visible}
        // onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onClose}
        footer={null}
      >
        <Space direction='vertical' className='w-full flex' size='large'>
          <p className='font-semibold text-xl'>{`Share "${dataSpace.title}" workspace`}</p>
          <div className='w-full flex items-top justify-between'>
            <Input
              placeholder='Add someone'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className='w-full flex-grow mr-2 flex'
            />
            <Button
              type='default'
              className='text-violet-500 bg-violet-100'
              disabled={email === '' || isLoading}
              onClick={handleInvite}
            >
              {/* {isLoading ? <LoadingOutlined className='mr-1' /> : null} */}
              Invite
            </Button>
          </div>
          <Alert
            message='Invited editors will be notified via email and in-app notifications.'
            type='info'
            closable
            // onClose={onClose}
            className='bg-violet-100'
          />
          <p className='text-gray-400 text-sm font-medium'>
            Once invited, individuals can interact with every workflow within
            this workspace.
          </p>
          <Space direction='vertical' size='small' className='w-full'>
            <p className='text-gray-400 text-base font-medium'>
              Who can access
            </p>
            <Space
              direction='vertical'
              size='middle'
              className='overflow-y-auto max-h-[194px] w-full '
            >
              {usersInOrg &&
                usersInOrg.map((userInfo, index) => (
                  <div
                    className='flex justify-between items-center'
                    key={index}
                  >
                    <Space size='small'>
                      <Icon iconUrl={userInfo?.avatar_url} size='large' />
                      <Space direction='vertical' size='small'>
                        <p>{userInfo?.full_name}</p>
                        <p className='text-gray-500'>{userInfo?.email}</p>
                      </Space>
                    </Space>
                    {userInfo?.role === 'ADMIN' ? (
                      <p className='text-base text-gray-500 mr-1'>Owner</p>
                    ) : (
                      <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space className='mr-1'>
                            <p className='text-base text-gray-500'>Editor</p>
                            <DownOutlined className='text-base text-gray-500' />
                          </Space>
                        </a>
                      </Dropdown>
                    )}
                  </div>
                ))}
            </Space>
          </Space>
          <Button
            type='link'
            icon={<LinkOutlined />}
            className='text-violet-500 pl-0'
            onClick={handleCopyLink}
          >
            Copy link
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default ModalInviteOfSpaceCard;
