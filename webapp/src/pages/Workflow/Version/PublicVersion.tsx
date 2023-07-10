import { LeftOutlined } from '@ant-design/icons';
import { GrDocumentText } from 'react-icons/gr';
import parse from 'html-react-parser';
import {
  DirectedGraph,
  emptyStage,
  renderVoteMachineConfigPanel,
} from '@components/DirectedGraph';
import {
  queryOrgAndUser,
  queryWeb2Integration,
  queryWorkflowVersion,
} from '@middleware/data';
import { extractIdFromIdString } from '@utils/helpers';
import { Button, Layout, Space, Image, Avatar, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCalendar, FiHome, FiLink, FiUser, FiDownload } from 'react-icons/fi';
import { MdChatBubbleOutline } from 'react-icons/md';
import { LuPaintbrush } from 'react-icons/lu';
import Sider from 'antd/es/layout/Sider';
import Comment from './fragment/Comment';
import { supabase } from '@utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import moment from 'moment';
import { getDataReactionCount } from '@middleware/data/reaction';
import { FaRegFaceGrinHearts, FaRegFaceSurprise } from 'react-icons/fa6';
import { HiMiniFire } from 'react-icons/hi2';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

const extractOrg = ({ orgList, orgId }: { orgList: any; orgId: number }) => {
  const org = orgList.find((org: any) => org.id === orgId);
  return org;
};

export const PublicVersion = () => {
  const { orgIdString, workflowIdString, versionIdString } = useParams();
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
  const [profile, setProfile] = useState<any>();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [comment, setComment] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const where = `${orgId}$/${workflowId}$/${versionId}$`;
  const [dataReaction, setDataReaction] = useState<any[]>([]);

  const handleSession = async (_session: Session | null) => {
    setSession(_session);
  };

  const worflowInfo = {
    workflow: workflow?.title,
    org: org?.title,
    authority: profile?.full_name,
    date: moment(workflow?.created_at).fromNow(),
    desc: workflow?.desc,
  };

  const fetchData = async () => {
    const data = await getDataReactionCount({ where, dispatch });
    setDataReaction(data);
  };

  useEffect(() => {
    queryWeb2Integration({
      orgId,
      dispatch,
      onLoad: (data: any) => {
        setWeb2IntegrationsState(data);
      },
    });

    queryWorkflowVersion({
      orgId,
      versionId,
      workflowId,
      dispatch,
      onLoad: (worflow: any) => {
        setWorkflow(worflow[0]);
        setVersion(worflow[0]?.workflow_version[0]);
      },
    });

    queryOrgAndUser({
      orgId,
      onSuccess: (data: any) => {
        setOrg(data[0]?.org);
        setProfile(data[0]?.profile);
      },
      dispatch,
    });

    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      await handleSession(_session);
    });

    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Layout>
        {version?.status === 'PUBLISHED' ||
        version?.status === 'PUBLIC_COMMUNITY' ? (
          <>
            <Image
              height={134}
              src='https://media.discordapp.net/attachments/1080674075669700728/1122847243100246026/Screenshot_2023-06-26_at_18.13.41.png?width=1440&height=163'
            />
            <Layout>
              <Sider
                collapsed={!collapsed}
                collapsedWidth={0}
                width='33%'
                theme='light'
                style={{ backgroundColor: '#EEEEEE' }}
                className='information-collapsed'
              >
                <Space className='p-5'>
                  <Space>
                    <Space>
                      <Avatar
                        shape='circle'
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png'
                        size={48}
                        className='bg-[#FFE1EF]'
                      />
                    </Space>
                  </Space>
                  <Space className='flex-col'>
                    <p className='text-[17px] font-normal'>
                      {worflowInfo.workflow}
                    </p>
                    <Space direction='horizontal'>
                      <div className='flex items-center text-[13px]'>
                        <FiHome className='mr-1' size={16} />
                        {worflowInfo.org}
                      </div>
                      <div className='flex items-center text-[13px]'>
                        <FiUser className='mr-1' size={16} />
                        {worflowInfo.authority}
                      </div>
                      <div className='flex items-center text-[13px]'>
                        <FiCalendar className='mr-1' size={16} />
                        {worflowInfo.date}
                      </div>
                    </Space>
                  </Space>
                  <Button
                    shape='circle'
                    icon={<LeftOutlined size={36} />}
                    className='ml-6 bg-white flex items-center justify-center'
                    onClick={() => {
                      if (comment) {
                        setComment(!comment);
                      }
                      setCollapsed(!collapsed);
                    }}
                  />
                </Space>
                <div className='p-5'>{parse(worflowInfo.desc)}</div>
              </Sider>

              <Sider
                collapsed={!comment}
                collapsedWidth={0}
                width='26%'
                theme='light'
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: '12px',
                  borderRight: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
                }}
                className='comment-collapsedh'
              >
                <Comment where={where} session={session} api={api} />
              </Sider>
              <Layout className='relative flex items-center'>
                {!collapsed && (
                  <Space className='absolute left-0 m-3 flex bg-[#FFF] items-center border border-solid border-[#E3E3E2] rounded-[10px] text-[#252422] p-3 w-fit mt-16'>
                    <Space>
                      <Avatar
                        shape='circle'
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png'
                        size={48}
                        className='bg-[#FFE1EF]'
                      />
                    </Space>
                    <Space className='flex-col'>
                      <p className='text-[17px] font-normal'>
                        {worflowInfo?.workflow}
                      </p>
                      <Space direction='horizontal'>
                        <div className='flex items-center text-[13px]'>
                          <FiHome className='mr-1' size={16} />
                          {worflowInfo?.org}
                        </div>
                        <div className='flex items-center text-[13px]'>
                          <FiUser className='mr-1' size={16} />
                          {worflowInfo?.authority}
                        </div>
                        <div className='flex items-center text-[13px]'>
                          <FiCalendar className='mr-1' size={16} />
                          {worflowInfo?.date}
                        </div>
                      </Space>
                    </Space>
                  </Space>
                )}
                <div className=' absolute top-0 right-10 z-50'>
                  <Space direction='horizontal' className='flex p-2'>
                    <Button
                      className='w-11 h-9 flex justify-center items-center'
                      onClick={() => {
                        if (comment) {
                          setComment(!comment);
                        }
                        setCollapsed(!collapsed);
                      }}
                      icon={<GrDocumentText className='w-5 h-5' />}
                    />
                    <Button
                      className='w-11 h-9 flex items-center justify-center'
                      onClick={() => {
                        if (collapsed) {
                          setCollapsed(!collapsed);
                        }
                        setComment(!comment);
                      }}
                      icon={<MdChatBubbleOutline className='w-5 h-5' />}
                    />
                    <Button
                      className='w-11 h-9 flex items-center justify-center'
                      icon={<FiLink className='w-5 h-5' />}
                    />
                    <Button
                      className='w-11 h-9 flex items-center justify-center'
                      icon={<FiDownload className='w-5 h-5' />}
                    />

                    <Button
                      className='w-11 h-9 flex items-center justify-center'
                      icon={<LuPaintbrush className='w-5 h-5' />}
                    />
                  </Space>
                </div>

                <div
                  className='cursor-pointer flex rounded-3xl absolute bottom-20 w-52 h-14 z-50'
                  style={{
                    border: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
                  }}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(!collapsed);
                    }
                    setComment(!comment);
                  }}
                >
                  <div className='p-4 flex'>
                    <div className='pr-3'>
                      <FaRegFaceGrinHearts size={24} />
                    </div>
                    <div className='pr-3'>
                      <FaRegFaceSurprise size={24} />
                    </div>
                    <div className='pr-3'>
                      <HiMiniFire size={24} />
                    </div>
                    <div className='pr-3'>
                      <AiFillLike size={24} />
                    </div>
                    <div className='pr-3'>
                      <AiFillDislike size={24} />
                    </div>
                  </div>
                </div>

                {renderVoteMachineConfigPanel({
                  editable: false,
                  web2Integrations: web2IntegrationsState,
                  data: version?.data || emptyStage,
                  selectedNodeId,
                  onChange: () => {},
                  onDelete: () => {},
                  onClose: () => {
                    setSelectedNodeId('');
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
                  onNodeClick={(_event, node) => {
                    setSelectedNodeId(node.id);
                  }}
                  onPaneClick={() => {
                    setSelectedNodeId('');
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
          </>
        ) : (
          <h1>Not published</h1>
        )}
      </Layout>
    </>
  );
};