import React, { useEffect, useState } from 'react';
import { Modal, Space, Button, Input, Alert } from 'antd';
// import { queryOrgByIdForInvite } from '@middleware/data';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryUserByEmail,
  inviteExistingMember,
  inviteUserByEmail,
} from '@middleware/data';
import Icon from '@components/Icon/Icon';
import { IProfile } from '@types';

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
    queryUserByEmail({
      email,
      dispatch,
      onSuccess: (data: any) => {
        if (data?.length > 0) {
          const idata: any = {
            org_id: dataSpace.id,
            id_user: data[0].id,
            to_email: email,
            full_name: data[0].full_name,
            org_title: org.title,
            inviter: user.full_name,
          };
          inviteExistingMember({
            data: idata,
            dispatch,
            onSuccess: () => {
              Modal.success({
                title: 'Success',
                content: 'Invite user successfully',
              });
            },
            onError: () => {
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
              Modal.success({
                title: 'Success',
                content: 'Invite user successfully',
              });
            },
            onError: () => {
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
              disabled={email === ''}
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
          <Space direction='vertical' size='small'>
            <p className='text-gray-400 text-base font-medium'>
              Who can access
            </p>
            <Space direction='vertical' size='middle'>
              {usersInOrg &&
                usersInOrg.map((userInfo, index) => (
                  <div className='flex justify-between' key={index}>
                    <Space size='small'>
                      <Icon iconUrl={userInfo?.avatar_url} size='large' />
                      <Space direction='vertical' size='small'>
                        <p>{userInfo?.full_name}</p>
                        <p className='text-gray-500'>{userInfo?.email}</p>
                      </Space>
                    </Space>
                  </div>
                ))}
            </Space>
          </Space>
        </Space>
      </Modal>
    </>
  );
};

export default ModalInviteOfSpaceCard;
