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
import { useDispatch } from 'react-redux';
import { useSetData, useGetDataHook } from 'utils';
import { config } from '@dal/config';
import { Icon } from 'icon';
// TODO: consider move this to src/fragments

const EditOrg = ({
  isOpen = false,
  onClose,
  dataOrg,
  profile,
  onSaved,
  onDeleted,
}: {
  isOpen?: boolean;
  onClose: () => void;
  dataOrg: any;
  profile: IProfile[];
  onSaved: () => void;
  onDeleted: () => void;
}) => {
  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;
  const [orgTitle, setOrgTitle] = useState(dataOrg?.title);
  const [orgDesc, setOrgDesc] = useState(dataOrg?.desc);
  const [iconUrl, setIconUrl] = useState(dataOrg?.icon_url);
  const [shouldShowInviteMember, setShouldShowInviteMember] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIconUrl(dataOrg?.icon_url);
    setOrgTitle(dataOrg?.title);
    setOrgDesc(dataOrg?.desc);
  }, [dataOrg]);

  const handleChangeAvatar = async (obj: any) => {
    const newIconUrl = obj.isPreset ? `preset:${obj.filePath}` : obj.filePath;

    setIconUrl(newIconUrl);

    await useSetData({
      params: {
        org: {
          ...dataOrg,
          icon_url: newIconUrl,
        },
      },
      configInfo: config.upsertAnOrg,
      dispatch: dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Change avatar successfully',
        });
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Cannot change avatar',
        });
      },
    });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => onClose()}
      title='Edit Workspace'
      size='large'
    >
      <Space direction='vertical' size='large' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          <Space>
            <Icon
              presetIcon={presetIcons}
              editable={true}
              iconUrl={iconUrl}
              onUpload={handleChangeAvatar}
            />
          </Space>
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
          <Space
            direction='vertical'
            size='small'
            className='w-full border border-solid border-zinc-200 rounded-md'
          >
            <Space
              direction='horizontal'
              size='small'
              className='w-full flex justify-between items-center pt-2 pb-0 px-2'
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
            <hr className='border border-solid border-zinc-200' />
            <Space direction='vertical' className='p-2 w-full' size='middle'>
              {profile?.map((p: IProfile) => (
                <Space
                  key={p.email}
                  direction='horizontal'
                  className='flex justify-between'
                >
                  <div className='w-[350px]'>
                    {p.full_name || <Tag color='default'>Missing</Tag>}
                  </div>
                  <div>{p.email}</div>
                </Space>
              ))}
            </Space>
          </Space>
        ) : null}
        <div className='flex justify-between items-center'>
          <Button
            type='default'
            onClick={() => {
              useSetData({
                params: {
                  org: {
                    ...dataOrg,
                    title: orgTitle,
                    desc: orgDesc,
                  },
                },
                configInfo: config.upsertAnOrg,
                onSuccess: () => {
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
                dispatch: dispatch,
              });
            }}
          >
            Save
          </Button>
          <Popconfirm
            title='Delete workspace'
            description='Are you sure to delete this workspace and all of its content?'
            onConfirm={() => {
              useSetData({
                params: {
                  orgId: dataOrg?.id,
                },
                configInfo: config.deleteOrg,
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
              Delete workspace
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
