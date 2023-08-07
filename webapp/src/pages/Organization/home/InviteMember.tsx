import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import {
  inviteUserByEmail,
  queryUserByEmail,
  inviteExistingMember,
} from '@middleware/data';
import { extractIdFromIdString } from '@utils/helpers';
import { Button, Drawer, Input, Modal, Space } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const org = orgs.find((tmp: any) => tmp.id === orgId);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const handleInvite = async () => {
    setInvitationLoading(true);
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
                okText: 'Send another email',
                onOk: () => {
                  window.open(
                    `mailto:${email}?subject= Join the ${
                      org.title
                    } with me on Syncvote!&body=Hey, %0D%0A%0D%0AI am inviting you to ${
                      org.title
                    } workspace on SyncVote with me as an editor. Syncvote provides the tools for our community members to design, build and run the community with us.%0D%0AOpen the workspace here: ${
                      import.meta.env.VITE_BASE_URL
                    }/${orgIdString}
                    %0D%0A%0D%0ACheers!`
                  );
                },
              });
            },
            onError: () => {
              Modal.error({
                title: 'Error',
                content: 'Cannot invite user',
              });
            },
          });
          setInvitationLoading(false);
          setVisible(false);
        } else {
          inviteUserByEmail({
            email,
            dispatch,
            onSuccess: () => {},
            onError: () => {},
          });
          Modal.info({
            title: 'Invite your friend to SyncVote',
            content: `This email is not associated with any account on Syncvote. Invite folks to signup at ${
              import.meta.env.VITE_BASE_URL
            } to add them as workspace editors.`,
            okText: 'Send Email',
            onOk: () => {
              navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL);
              window.open(
                `mailto:${email}?subject= Join the ${
                  org.title
                } with me on Syncvote!&body=Hey, %0D%0A%0D%0AI am inviting you to join Syncvote and collaborate on ${
                  org.title
                } workspace with me as an editor. Syncvote provides the tools for our community members to design, build and run the community with us.%0D%0ASign up on SyncVote here: ${
                  import.meta.env.VITE_BASE_URL
                }%0D%0A%0D%0ACheers!`
              );
            },
          });
          setVisible(false);
          setInvitationLoading(false);
        }
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Cannot retrieve user data',
        });
        setInvitationLoading(false);
      },
    });
  };
  return (
    <Drawer
      open={visible}
      onClose={() => {
        if (invitationLoading) return;
        setVisible(false);
        setEmail('');
      }}
      title='Invite a member'
    >
      <Space direction='vertical' size='large' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          <div>Input registered user email</div>
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
          <Button
            type='default'
            className='w-full'
            onClick={handleInvite}
            icon={invitationLoading ? <LoadingOutlined /> : <SendOutlined />}
          >
            Send Invitation
          </Button>
        </Space>
      </Space>
    </Drawer>
  );
};

export default InviteMember;
