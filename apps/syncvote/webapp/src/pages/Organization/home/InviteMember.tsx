import {
  inviteUserByEmail,
  queryUserByEmail,
  inviteExistingMember,
} from '@dal/data';
import { extractIdFromIdString, useGetDataHook } from 'utils';
import { Button, Drawer, Input, Modal, Space } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { config } from '@dal/config';

const InviteMember = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const org = orgs.find((tmp: any) => tmp.id === orgId);
  const handleInvite = async () => {
    queryUserByEmail({
      email,
      dispatch,
      onSuccess: (data: any) => {
        if (data?.length > 0) {
          const idata: any = {
            org_id: orgId,
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
          setVisible(false);
        } else {
          // inviteUserByEmail({
          //   email,
          //   dispatch,
          //   onSuccess: () => {
          //     Modal.success({
          //       title: "Success",
          //       content: "Invite user successfully",
          //     });
          //   },
          //   onError: () => {
          //     Modal.error({
          //       title: "Error",
          //       content: "Cannot invite user",
          //     });
          //   },
          // });
          setVisible(false);
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
  return (
    <Drawer
      open={visible}
      onClose={() => {
        setVisible(false);
        setEmail('');
      }}
      title='Invite a member'
    >
      <Space direction='vertical' size='large' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          <div>Input user email</div>
          <Input
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='w-full'
          />
        </Space>
        <Space
          direction='horizontal'
          size='small'
          className='w-full flex justify-end'
        >
          <Button type='default' className='w-full' onClick={handleInvite}>
            Invite
          </Button>
        </Space>
      </Space>
    </Drawer>
  );
};

export default InviteMember;
