import {
  DownloadOutlined,
  FileTextOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  DirectedGraph,
  emptyStage,
  renderVoteMachineConfigPanel,
} from "@components/DirectedGraph";
import {
  queryOrgs,
  queryWeb2Integration,
  queryWorkflow,
} from "@middleware/data";
import { extractIdFromIdString } from "@utils/helpers";
import { Button, Layout, Space, Image, Avatar, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiHome, FiLink, FiUser } from "react-icons/fi";
import { MdChatBubbleOutline } from "react-icons/md";
import { LuPaintbrush } from "react-icons/lu";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Comment from "./fragment/Comment";
import { supabase } from "@utils/supabaseClient";
import { Session } from "@supabase/supabase-js";
import moment from "moment";
const extractVersion = ({
  workflows,
  workflowId,
  versionId,
}: {
  workflows: any;
  workflowId: number;
  versionId: number;
}) => {
  const wf = workflows.find((workflow: any) => workflow.id === workflowId);

  if (wf) {
    return wf.workflow_version.find((wv: any) => wv.id === versionId);
  }
  return {};
};

const extractOrg = ({ orgList, orgId }: { orgList: any; orgId: number }) => {
  const org = orgList.find((org: any) => org.id === orgId);
  return org;
};

export const PublicVersion = () => {
  const { orgIdString, workflowIdString, versionIdString, userId } =
    useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const workflowId = extractIdFromIdString(workflowIdString);
  const versionId = extractIdFromIdString(versionIdString);
  const dispatch = useDispatch();
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [web2IntegrationsState, setWeb2IntegrationsState] = useState<any>();
  const [version, setVersion] = useState<any>();
  const [workflow, setWorkflow] = useState<any>();
  const [org, setOrg] = useState<any>();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [comment, setComment] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSession = async (_session: Session | null) => {
    setSession(_session);
  };

  const extractWorkflowFromList = (wfList: any) => {
    setVersion(
      extractVersion({
        workflows: wfList,
        workflowId,
        versionId,
      })
    );

    setDataHasChanged(false);
    setWorkflow(wfList.find((w: any) => w.id === workflowId));
  };

  const extractOrgList = (orgList: any) => {
    setOrg(extractOrg({ orgList, orgId }));
  };

  const worflowInfo = {
    workflow: workflow?.title,
    org: org?.title,
    authority: org?.profile[0].full_name,
    date: moment(workflow?.created_at).fromNow(),
    desc: workflow?.desc,
  };

  useEffect(() => {
    queryWeb2Integration({
      orgId,
      dispatch,
      onLoad: (data: any) => {
        setWeb2IntegrationsState(data);
      },
    });
    queryWorkflow({
      orgId,
      dispatch,
      onLoad: (wfList: any) => {
        extractWorkflowFromList(wfList);
      },
    });

    queryOrgs({
      filter: { userId },
      onSuccess: (orgList: any) => {
        extractOrgList(orgList);
      },
      dispatch,
    });
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      await handleSession(_session);
    });
  }, []);

  return (
    <>
      {contextHolder}
      <Layout>
        <Image
          height={134}
          src="https://media.discordapp.net/attachments/1080674075669700728/1122847243100246026/Screenshot_2023-06-26_at_18.13.41.png?width=1440&height=163"
        />

        {version?.status === "PUBLISHED" ? (
          <Layout>
            <Sider
              collapsed={!collapsed}
              collapsedWidth={0}
              width="33%"
              theme="light"
              style={{ backgroundColor: "#EEEEEE" }}
              className="information-collapsed"
            >
              <Space className="p-5">
                <Space>
                  <Space>
                    <Avatar
                      shape="circle"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png"
                      size={48}
                      className="bg-[#FFE1EF]"
                    />
                  </Space>
                </Space>
                <Space className="flex-col">
                  <p className="text-[17px] font-normal">
                    {worflowInfo.workflow}
                  </p>
                  <Space direction="horizontal">
                    <div className="flex items-center text-[13px]">
                      <FiHome className="mr-1" size={16} />
                      {worflowInfo.org}
                    </div>
                    <div className="flex items-center text-[13px]">
                      <FiUser className="mr-1" size={16} />
                      {worflowInfo.authority}
                    </div>
                    <div className="flex items-center text-[13px]">
                      <FiCalendar className="mr-1" size={16} />
                      {worflowInfo.date}
                    </div>
                  </Space>
                </Space>
                <Button
                  shape="circle"
                  icon={<LeftOutlined size={36} />}
                  className="ml-6 bg-white flex items-center justify-center"
                  onClick={() => {
                    if (comment) {
                      setComment(!comment);
                    }
                    setCollapsed(!collapsed);
                  }}
                />
              </Space>
              <Space className="p-5">
                <Content className="text-[15px]">{workflow?.desc}</Content>
              </Space>
            </Sider>

            <Sider
              collapsed={!comment}
              collapsedWidth={0}
              width="26%"
              theme="light"
              style={{
                backgroundColor: "#FFF",
                borderRadius: "12px",
                borderRight: "1px solid var(--foundation-grey-g-3, #E3E3E2)",
              }}
              className="comment-collapsedh"
            >
              <Comment
                orgId={orgId}
                workflowId={workflowId}
                versionId={versionId}
                session={session}
                api={api}
              />
            </Sider>

            <Layout className="relative">
              {!collapsed && (
                <Space className="absolute m-3 flex bg-[#FFF] items-center border border-solid border-[#E3E3E2] rounded-[10px] text-[#252422] p-3 w-fit mt-16">
                  <Space>
                    <Avatar
                      shape="circle"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png"
                      size={48}
                      className="bg-[#FFE1EF]"
                    />
                  </Space>
                  <Space className="flex-col">
                    <p className="text-[17px] font-normal">
                      {worflowInfo?.workflow}
                    </p>
                    <Space direction="horizontal">
                      <div className="flex items-center text-[13px]">
                        <FiHome className="mr-1" size={16} />
                        {worflowInfo?.org}
                      </div>
                      <div className="flex items-center text-[13px]">
                        <FiUser className="mr-1" size={16} />
                        {worflowInfo?.authority}
                      </div>
                      <div className="flex items-center text-[13px]">
                        <FiCalendar className="mr-1" size={16} />
                        {worflowInfo?.date}
                      </div>
                    </Space>
                  </Space>
                </Space>
              )}
              <div className=" absolute top-0 right-10 z-50">
                <Space direction="horizontal" className="flex gap-[12px] p-2">
                  <Button
                    className="w-11 h-9"
                    onClick={() => {
                      if (comment) {
                        setComment(!comment);
                      }
                      setCollapsed(!collapsed);
                    }}
                  >
                    <FileTextOutlined style={{ fontSize: 20 }} />
                  </Button>

                  <Button
                    className="w-11 h-9 primary items-center justify-center"
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(!collapsed);
                      }
                      setComment(!comment);
                    }}
                  >
                    <MdChatBubbleOutline style={{ fontSize: 20 }} />
                  </Button>
                  <Button className="w-11 h-9 items-center justify-center">
                    <FiLink style={{ fontSize: 20 }} />
                  </Button>
                  <Button className="w-11 h-9 items-center justify-center">
                    <DownloadOutlined style={{ fontSize: 20 }} />
                  </Button>
                  <Button className="w-11 h-9 items-center justify-center">
                    <LuPaintbrush style={{ fontSize: 20 }} />
                  </Button>
                </Space>
              </div>
              {renderVoteMachineConfigPanel({
                editable: false,
                web2Integrations: web2IntegrationsState,
                versionData: version?.data || emptyStage,
                selectedNodeId,
                onChange: () => {},
                onDelete: () => {},
                onClose: () => {
                  setSelectedNodeId("");
                },
                onChangeLayout: () => {},
              })}

              <DirectedGraph
                editable
                data={version?.data || emptyStage}
                selectedNodeId={selectedNodeId}
                onNodeChanged={(changedNodes) => {
                  const newData = structuredClone(version?.data);
                  newData?.checkpoints?.forEach((v: any, index: number) => {
                    const changedNode = changedNodes.find(
                      (cN: any) => cN.id === v.id
                    );
                    if (changedNode && changedNode.position) {
                      newData.checkpoints[index].position =
                        changedNode.position;
                    }
                  });
                  setVersion({
                    ...version,
                    data: newData,
                  });
                  if (selectedNodeId) {
                    setDataHasChanged(true);
                  }
                }}
                onNodeClick={(event, node) => {
                  setSelectedNodeId(node.id);
                }}
                onPaneClick={() => {
                  setSelectedNodeId("");
                }}
                onResetPosition={() => {}}
                onAddNewNode={() => {}}
                onViewPortChange={(viewport) => {
                  setCenterPos({
                    x: (-viewport.x + 600) / viewport.zoom,
                    y: (-viewport.y + 250) / viewport.zoom,
                  });
                }}
              />
            </Layout>
          </Layout>
        ) : (
          <h1>Not published</h1>
        )}
      </Layout>
    </>
  );
};
