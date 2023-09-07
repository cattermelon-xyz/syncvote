import React, { useEffect, useState } from "react";
import { Modal, Space, Button, Input, Alert, Dropdown } from "antd";
// import { queryOrgByIdForInvite } from '@middleware/data';
import { useDispatch, useSelector } from "react-redux";
import {
  queryUserByEmail,
  inviteExistingMember,
  inviteUserByEmail,
  removeMemberOfOrg,
} from "@middleware/data";
import Icon from "@components/Icon/Icon";
import { IProfile, IOrgInfo } from "@types";
import { LinkOutlined, DownOutlined } from "@ant-design/icons";
import { unsecuredCopyToClipboard, createIdString } from "@utils/helpers";
import type { MenuProps } from "antd";
import { useGetDataHook, useSetData } from "@dal/dal";
import { config } from "@dal/config";

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
  const [email, setEmail] = useState("");
  const [usersInOrg, setUsersInOrg] = useState<IProfile[]>();
  const [orgData, setOrgData] = useState<IOrgInfo>();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const { presetIcons } = useSelector((state: any) => state.ui);

  useEffect(() => {
    if (visible && orgs) {
      const org = orgs.find((tmp: any) => tmp.id === dataSpace.id);
      setOrgData(org);
      setUsersInOrg(org.profile);
    }
  }, [dataSpace.id, visible, orgs]);

  useEffect(() => {}, [usersInOrg]);

  const handleInvite = async () => {
    setIsLoading(true);
    dispatch;
    await useSetData({
      params: {
        email: email,
      },
      configInfo: config.queryUserByEmail,
      dispatch,
      onSuccess: async (data: any) => {
        if (data?.length > 0) {
          const presetIcon = data[0]?.preset_icon_url
            ? `preset:${data[0].preset_icon_url}`
            : data[0].preset_icon_url;
          const idata: any = {
            org_id: dataSpace.id,
            id_user: data[0].id,
            to_email: email,
            full_name: data[0].full_name,
            avatar_url: data[0].icon_url ? data[0].icon_url : presetIcon,
            org_title: orgData?.title,
            inviter: user.full_name,
          };
          await useSetData({
            params: {
              data: idata,
            },
            configInfo: config.inviteExistingMember,
            dispatch,
            onSuccess: () => {
              setIsLoading(false);
              setEmail("");
              Modal.success({
                title: "Success",
                content: "Invite user successfully",
              });
            },
            onError: () => {
              setIsLoading(false);
              Modal.error({
                title: "Error",
                content: "Cannot invite user",
              });
            },
          });
        } else {
          await useSetData({
            params: {
              email: email,
              orgId: dataSpace.id,
            },
            configInfo: config.inviteUserByEmail,
            dispatch,
            onSuccess: () => {
              setIsLoading(false);
              setEmail("");
              Modal.success({
                title: "Success",
                content: "Invite user successfully",
              });
            },
            onError: () => {
              setIsLoading(false);
              Modal.error({
                title: "Error",
                content: "Cannot invite user",
              });
            },
          });
        }
      },
      onError: () => {
        Modal.error({
          title: "Error",
          content: "Cannot retrieve user data",
        });
      },
    });
  };

  const handleCopyLink = () => {
    const baseURL = window.location.origin;
    const idString = createIdString(dataSpace.title, dataSpace.id.toString());
    const fullURL = `${baseURL}/${idString}`;
    unsecuredCopyToClipboard(fullURL);
  };

  const handleRemoveMember = async (orgId: number, userId: string) => {
    console.log("debug1");
    await useSetData({
      params: { orgId, userId },
      configInfo: config.removeMemberOfOrg,
      dispatch,
      onSuccess: () => {
        Modal.success({
          title: "Success",
          content: "remove user successfully",
        });
      },
      onError: () => {
        Modal.error({
          title: "Error",
          content: "Cannot remove user",
        });
      },
    });
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
        <Space direction="vertical" className="w-full flex" size="large">
          <p className="font-semibold text-xl">{`Share "${dataSpace.title}" workspace`}</p>
          <div className="w-full flex items-top justify-between">
            <Input
              placeholder="Add someone"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full flex-grow mr-2 flex"
            />
            <Button
              type="default"
              className="text-violet-500 bg-violet-100"
              disabled={email === "" || isLoading}
              onClick={handleInvite}
            >
              {/* {isLoading ? <LoadingOutlined className='mr-1' /> : null} */}
              Invite
            </Button>
          </div>
          <Alert
            message="Invited editors will be notified via email and in-app notifications."
            type="info"
            closable
            // onClose={onClose}
            className="bg-violet-100"
          />
          <p className="text-gray-400 text-sm font-medium">
            Once invited, individuals can interact with every workflow within
            this workspace.
          </p>
          <Space direction="vertical" size="small" className="w-full">
            <p className="text-gray-400 text-base font-medium">
              Who can access
            </p>
            <Space
              direction="vertical"
              size="middle"
              className="overflow-y-auto max-h-[194px] w-full "
            >
              {usersInOrg &&
                usersInOrg.map((userInfo, index) => {
                  const items: MenuProps["items"] = [
                    {
                      key: "1",
                      label: (
                        <Button type="text" className="text-base">
                          Editor
                        </Button>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <Button
                          type="text"
                          ghost
                          disabled
                          className="text-base"
                        >
                          Owner
                        </Button>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <Button
                          className="text-base"
                          type="text"
                          danger
                          onClick={() =>
                            handleRemoveMember(dataSpace.id, userInfo.id)
                          }
                        >
                          Remove
                        </Button>
                      ),
                    },
                  ];
                  if (userInfo?.confirm_email_at === null) {
                    return (
                      <div
                        className="flex justify-between items-center"
                        key={index}
                      >
                        <Space size="small">
                          <Icon
                            presetIcon={presetIcons}
                            iconUrl={userInfo?.avatar_url}
                            size="large"
                          />
                          <Space direction="vertical" size="small">
                            <p className="text-gray-500">
                              This email is not associated with an account
                            </p>
                            <p className="text-gray-500">{userInfo?.email}</p>
                          </Space>
                        </Space>
                        <Dropdown menu={{ items }} trigger={["click"]}>
                          <a onClick={(e) => e.preventDefault()}>
                            <Space className="mr-1">
                              <p className="text-base text-gray-500">Editor</p>
                              <DownOutlined className="text-base text-gray-500" />
                            </Space>
                          </a>
                        </Dropdown>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="flex justify-between items-center"
                        key={index}
                      >
                        <Space size="small">
                          <Icon
                            presetIcon={presetIcons}
                            iconUrl={userInfo?.avatar_url}
                            size="large"
                          />
                          <Space direction="vertical" size="small">
                            <p>{userInfo?.full_name}</p>
                            <p className="text-gray-500">{userInfo?.email}</p>
                          </Space>
                        </Space>
                        {userInfo?.role === "ADMIN" ? (
                          <p className="text-base text-gray-500 mr-1">Owner</p>
                        ) : (
                          <Dropdown menu={{ items }} trigger={["click"]}>
                            <a onClick={(e) => e.preventDefault()}>
                              <Space className="mr-1">
                                <p className="text-base text-gray-500">
                                  Editor
                                </p>
                                <DownOutlined className="text-base text-gray-500" />
                              </Space>
                            </a>
                          </Dropdown>
                        )}
                      </div>
                    );
                  }
                })}
            </Space>
          </Space>
          <Button
            type="link"
            icon={<LinkOutlined />}
            className="text-violet-500 pl-0"
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
