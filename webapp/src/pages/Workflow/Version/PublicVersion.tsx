import {
  BranchesOutlined,
  DesktopOutlined,
  DownloadOutlined,
  FileOutlined,
  FileTextOutlined,
  LeftOutlined,
  PieChartOutlined,
  SaveOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Disqus from "disqus-react";
import {
  DirectedGraph,
  emptyStage,
  getVoteMachine,
  renderVoteMachineConfigPanel,
} from "@components/DirectedGraph";
import Icon from "@components/Icon/Icon";
import {
  queryWeb2Integration,
  queryWorkflow,
  upsertWorkflowVersion,
} from "@middleware/data";
import { changeVersion } from "@middleware/logic";
import { extractIdFromIdString, shouldUseCachedData } from "@utils/helpers";
import {
  Button,
  Drawer,
  Layout,
  Modal,
  Space,
  Image,
  Avatar,
  MenuProps,
  theme,
  Menu,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditInfo from "./fragment/EditInfo";
import { FiCalendar, FiHome, FiLink, FiUser } from "react-icons/fi";
import { MdChatBubbleOutline } from "react-icons/md";
import { LuPaintbrush } from "react-icons/lu";
import { log } from "console";
import Sider from "antd/es/layout/Sider";
import { TbH1 } from "react-icons/tb";
import { Content } from "antd/es/layout/layout";

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

export const PublicVersion = () => {
  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const workflowId = extractIdFromIdString(workflowIdString);
  const versionId = extractIdFromIdString(versionIdString);
  const dispatch = useDispatch();
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { web2Integrations } = useSelector((state: any) => state.integration);
  const { workflows, lastFetch } = useSelector((state: any) => state.workflow);
  const { orgs, users } = useSelector((state: any) => state.orginfo)
  
  const [org, setOrg] = useState<any>(orgs.find((o: any) => o.id === orgId));
  
  const [version, setVersion] = useState<any>(
    extractVersion({
      workflows,
      workflowId,
      versionId,
    })
  );

  const [web2IntegrationsState, setWeb2IntegrationsState] =
    useState(web2Integrations);
  const [workflow, setWorkflow] = useState<any>(
    workflows.find((w: any) => w.id === workflowId)
  );

  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [dataHasChanged, setDataHasChanged] = useState(false);

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

  const uniswapGovernaceProcess = {
    workflow: workflow?.title,
    org: org?.title,
    authority: org?.profile[0].full_name,
    date: "3 days ago",
    desc: workflow?.desc,
  };

  const disqusShortname = "comment-vudsovdn2x";
  const disqusConfig = {
    url: `http://localhost:3001/${orgIdString}$/${workflowIdString}$/${versionIdString}$`,
    identifier: `${orgIdString}$/${workflowIdString}$/${versionIdString}$`,
    title: "Title of Your Article",
    laziness: 1,
  };

  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
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
    }
  }, [workflows, web2Integrations, lastFetch]);

  const [collapsed, setCollapsed] = useState(false);
  const [comment, setComment] = useState(false);

  return (
    <Layout>
      <Image
        height={134}
        src="https://media.discordapp.net/attachments/1080674075669700728/1122847243100246026/Screenshot_2023-06-26_at_18.13.41.png?width=1440&height=163"
      />

      {version.status === "PUBLISHED" ? (
        <Layout>
          <Sider
            collapsed={!collapsed}
            collapsedWidth={0}
            width="30%"
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
                  {uniswapGovernaceProcess.workflow}
                </p>
                <Space direction="horizontal">
                  <div className="flex items-center text-[13px]">
                    <FiHome className="mr-1" size={16} />
                    {uniswapGovernaceProcess.org}
                  </div>
                  <div className="flex items-center text-[13px]">
                    <FiUser className="mr-1" size={16} />
                    {uniswapGovernaceProcess.authority}
                  </div>
                  <div className="flex items-center text-[13px]">
                    <FiCalendar className="mr-1" size={16} />
                    {uniswapGovernaceProcess.date}
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
            width="40%"
            theme="light"
            style={{ backgroundColor: "#EEEEEE" }}
            className="comment-collapsedh"
          >
            <div className="p-5">
              <Disqus.DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
              />
            </div>
          </Sider>

          <Layout className="relative">
            {!collapsed && (
              <Space className="absolute m-3 flex bg-[#FFF] items-center border border-solid border-[#E3E3E2] rounded-[10px] text-[#252422] p-3 w-fit">
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
                    {uniswapGovernaceProcess?.workflow}
                  </p>
                  <Space direction="horizontal">
                    <div className="flex items-center text-[13px]">
                      <FiHome className="mr-1" size={16} />
                      {uniswapGovernaceProcess?.org}
                    </div>
                    <div className="flex items-center text-[13px]">
                      <FiUser className="mr-1" size={16} />
                      {uniswapGovernaceProcess?.authority}
                    </div>
                    <div className="flex items-center text-[13px]">
                      <FiCalendar className="mr-1" size={16} />
                      {uniswapGovernaceProcess?.date}
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
                    newData.checkpoints[index].position = changedNode.position;
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
  );
};
