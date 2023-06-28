import {
  DownloadOutlined,
  FileTextOutlined,
  LeftOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Layout, Image, Space, Button, Drawer, Avatar } from "antd";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { LuPaintbrush } from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { FiCalendar, FiHome, FiLink, FiUser } from "react-icons/fi";
import { Content } from "antd/es/layout/layout";
import "index.css";
import { extractIdFromIdString } from "@utils/helpers";

const PublicMissionLayout = () => {
  const uniswapGovernaceProcess = {
    name: "Uniswap Governance Process",
    id: "Uniswap",
    authority: "Limon",
    date: "3 days ago",
  };
  const [showTaskBar, setShowTaskBar] = useState(false);

  const handleShowTaskBar = () => {
    setShowTaskBar(!showTaskBar);
  };

  // const orgId = extractIdFromIdString(orgIdString);
  // const workflowId = extractIdFromIdString(workflowIdString);
  // const versionId = extractIdFromIdString(versionIdString);

  return (
    <Layout>
      <Layout>
        <Image
          height={134}
          src="https://media.discordapp.net/attachments/1080674075669700728/1122847243100246026/Screenshot_2023-06-26_at_18.13.41.png?width=1440&height=163"
        />
      </Layout>
      <div className="flex">
        <Layout>
          {showTaskBar && (
            <div className={`w-1/3 flex bg-[#EEEEEE]`}>
              <div className="m-4">
                <div className="flex text-[15px] items-center rounded-[10px] text-[#252422] h-fit">
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
                      {uniswapGovernaceProcess.name}
                    </p>
                    <Space direction="horizontal">
                      <div className="flex items-center text-[13px]">
                        <FiHome className="mr-1" size={16} />
                        {uniswapGovernaceProcess.id}
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
                    onClick={handleShowTaskBar}
                  />
                </div>
                <div>
                  <Content className="text-[15px]">
                    <p className="whitespace-pre-line">
                      This document is a living document which represents the
                      current process guidelines for developing and advancing
                      Uniswap Governance Proposals.
                    </p>
                    <br />
                    <p className="font-semibold">Process</p>
                    <p>
                      Several governance venues are available to Uniswap
                      governance, each serving its own particular purpose
                    </p>
                    <br />
                    <p className="list-underlined">1. gov.uniswap.org</p>
                    <p>
                      gov.uniswap.org is a Discourse-hosted forum for
                      governance-related discussion. Community members must
                      register for an account before sharing or liking posts.
                      New members are required to enter 4 topics and read 15
                      posts over the course of 10 minutes before they are
                      permitted to post themselves.
                    </p>
                    <br />
                    <p className="list-underlined">2. Snapshot</p>
                    <p>
                      Snapshot is a simple voting interface that allows users to
                      signal sentiment off-chain. Votes on snapshot are weighted
                      by the number of UNI delegated to the address used to
                      vote.{" "}
                    </p>
                    <br />
                    <p className="list-underlined">3. Governance Portal</p>
                    The formal governance portal can be accessed directly
                    through the Uniswap app interface. Votes are delegated and
                    cast through the portal. Below we outline a preliminary
                    draft for the Uniswap governance process, detailing exactly
                    where these venues fit in. These processes are subject to
                    change according to feedback from the Uniswap community.
                  </Content>
                </div>
              </div>
            </div>
          )}

          <div className="w-full flex">
            {!showTaskBar && (
              <Space className="m-3 flex bg-[#FFF] items-center border border-solid border-[#E3E3E2] rounded-[10px] text-[#252422] p-3 w-fit">
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
                    {uniswapGovernaceProcess.name}
                  </p>
                  <Space direction="horizontal">
                    <div className="flex items-center text-[13px]">
                      <FiHome className="mr-1" size={16} />
                      {uniswapGovernaceProcess.id}
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
              </Space>
            )}
              <Space direction="horizontal" className="flex gap-[12px] p-2">
                <Button className="w-11 h-9" onClick={handleShowTaskBar}>
                  <FileTextOutlined style={{ fontSize: 20 }} />
                </Button>
                <Button className="w-11 h-9">
                  <MdChatBubbleOutline style={{ fontSize: 20 }} />
                </Button>
                <Button className="w-11 h-9">
                  <FiLink style={{ fontSize: 20 }} />
                </Button>
                <Button className="w-11 h-9">
                  <DownloadOutlined style={{ fontSize: 20 }} />
                </Button>
                <Button className="w-11 h-9">
                  <LuPaintbrush style={{ fontSize: 20 }} />
                </Button>
              </Space>
          </div>
        </Layout>
      </div>
    </Layout>
  );
};

export default PublicMissionLayout;
