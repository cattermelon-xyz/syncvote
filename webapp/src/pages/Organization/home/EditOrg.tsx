import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Space,
  Tag,
} from 'antd';
import { IProfile } from '@types';
import { useEffect, useState } from 'react';
import InviteMember from './InviteMember';
import { deleteOrg, upsertAnOrg } from '@middleware/data';
import { useDispatch } from 'react-redux';

const EditOrg = ({
  isOpen = false,
  onClose,
  orgId,
  title,
  desc,
  profile,
  onSaved,
  onDeleted,
}: {
  isOpen?: boolean;
  onClose: () => void;
  orgId: number;
  title: string;
  desc: string;
  profile: IProfile[];
  onSaved: () => void;
  onDeleted: () => void;
}) => {
  const [orgTitle, setOrgTitle] = useState(title);
  const [orgDesc, setOrgDesc] = useState(desc);
  const [shouldShowInviteMember, setShouldShowInviteMember] = useState(false);
  useEffect(() => {
    setOrgTitle(title);
    setOrgDesc(desc);
  }, [title, desc]);
  const dispatch = useDispatch();
  return (
    <Drawer
      open={isOpen}
      onClose={() => onClose()}
      title='Edit Workspace'
      size='large'
    >
      <Space direction='vertical' size='large' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          <span>Title</span>
          <Input
            value={orgTitle}
            onChange={(e) => setOrgTitle(e.target.value)}
          />
        </Space>
        <Space direction='vertical' size='small' className='w-full'>
          <span>Description</span>
          <Input.TextArea
            value={orgDesc}
            onChange={(e) => setOrgDesc(e.target.value)}
          />
        </Space>
        {profile && profile.length > 0 ? (
          <Space direction='vertical' size='small' className='w-full'>
            <Space
              direction='horizontal'
              size='small'
              className='w-full flex justify-between'
            >
              <span className='font-bold'>Member list</span>
              <Button
                icon={<PlusOutlined />}
                className='flex items-center'
                onClick={async () => {
                  setShouldShowInviteMember(true);
                }}
              >
                Invite
              </Button>
            </Space>
            {profile?.map((p: IProfile) => (
              <Space
                key={p.email}
                direction='horizontal'
                className='flex justify-between'
              >
                <div className='w-[350px]'>{p.full_name}</div>
                <div>{p.email}</div>
              </Space>
            ))}
          </Space>
        ) : null}
        <div className='flex justify-between items-center'>
          <Button
            type='default'
            onClick={() => {
              upsertAnOrg({
                org: {
                  id: orgId,
                  title: title,
                  desc: desc,
                },
                dispatch,
                onLoad: () => {
                  Modal.success({
                    title: 'Saved!',
                    content: 'Your changes have been saved.',
                  });
                  onSaved();
                },
                onError: () => {
                  Modal.error({
                    title: 'Error',
                    content: 'Cannot save your changes.',
                  });
                  onSaved();
                },
              });
            }}
          >
            Save
          </Button>
          <Popconfirm
            title='Delete workspace'
            description='Are you sure to delete this workspace and all of its content?'
            onConfirm={() => {
              deleteOrg({
                orgId,
                dispatch,
                onSuccess: () => {
                  Modal.info({
                    title: 'Deleted!',
                    content: 'Your workspace has been deleted.',
                    onOk: () => {
                      onDeleted();
                    },
                  });
                },
                onError: () => {
                  Modal.error({
                    title: 'Error',
                    content: 'Cannot delete this workspace.',
                  });
                },
              });
            }}
          >
            <Button type='default' icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </Space>
      <InviteMember
        visible={shouldShowInviteMember}
        setVisible={setShouldShowInviteMember}
      />
    </Drawer>
  );
};

export default EditOrg;
