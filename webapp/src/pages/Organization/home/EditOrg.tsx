import { PlusOutlined } from '@ant-design/icons';
import {
  Button, Drawer, Input, Space, Tag,
} from 'antd';
import { IProfile } from '@types';
import { useEffect, useState } from 'react';
import InviteMember from './InviteMember';

const EditOrg = ({
  isOpen = false, onClose, title, desc, profile, onSave,
}:{
  isOpen?: boolean,
  onClose: () => void,
  title: string,
  desc: string,
  profile: IProfile[],
  onSave: (title: string, desc: string) => void,
}) => {
  const [orgTitle, setOrgTitle] = useState(title);
  const [orgDesc, setOrgDesc] = useState(desc);
  const [shouldShowInviteMember, setShouldShowInviteMember] = useState(false);
  useEffect(() => {
    setOrgTitle(title);
    setOrgDesc(desc);
  }, [title, desc]);
  return (
    <Drawer
      open={isOpen}
      onClose={() => onClose()}
      title="Edit Organization"
      size="large"
    >
      <Space direction="vertical" size="large" className="w-full">
        <Space direction="vertical" size="small" className="w-full">
          <span>Title</span>
          <Input
            value={orgTitle}
            onChange={(e) => setOrgTitle(e.target.value)}
          />
        </Space>
        <Space direction="vertical" size="small" className="w-full">
          <span>Description</span>
          <Input.TextArea
            value={orgDesc}
            onChange={(e) => setOrgDesc(e.target.value)}
          />
        </Space>
        <Space direction="vertical" size="small" className="w-full">
          <Space direction="horizontal" size="small" className="w-full flex justify-between">
            <span className="font-bold">Member list</span>
            <Button
              icon={<PlusOutlined />}
              className="flex items-center"
              onClick={async () => {
                setShouldShowInviteMember(true);
              }}
            >
              Invite
            </Button>
          </Space>
          {
            profile ?
              profile?.map((p:IProfile) => (
                <Space key={p.email} direction="horizontal" className="flex justify-between">
                  <div className="w-[350px]">
                    {p.full_name}
                  </div>
                  <div>{p.email}</div>
                </Space>
              ))
            : null
          }
        </Space>
        <Button
          type="default"
          onClick={() => onSave(orgTitle, orgDesc)}
        >
          Save
        </Button>
      </Space>
      <InviteMember visible={shouldShowInviteMember} setVisible={setShouldShowInviteMember} />
    </Drawer>
  );
};

export default EditOrg;
