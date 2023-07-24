import {
  CloseCircleFilled,
  CloseOutlined,
  LeftOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { GrDocumentText } from 'react-icons/gr';
import parse from 'html-react-parser';
import { DirectedGraph, emptyStage } from '@components/DirectedGraph';
import {
  queryOrgByOrgId,
  queryWeb2Integration,
  queryWorkflowVersion,
} from '@middleware/data';
import { extractIdFromIdString } from '@utils/helpers';
import {
  Button,
  Layout,
  Space,
  notification,
  Skeleton,
  Empty,
  Modal,
} from 'antd';
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
import { GraphViewMode } from '@types';
import Banner from '@components/Banner/Banner';
import Icon from '@components/Icon/Icon';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import Google from '@assets/icons/svg-icons/Google';

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
  const [leftSiderStatus, setLeftSiderStatus] = useState('closed');
  const [api, contextHolder] = notification.useNotification();
  const where = `${orgId}$/${workflowId}$/${versionId}$`;
  const [dataReaction, setDataReaction] = useState<any[]>([]);
  const [showRegisterInvitation, setShowRegisterInvitation] = useState(
    session?.user?.user_metadata ? false : true
  );
  const [downloadImageStatus, setDownloadImageStatus] = useState(false);
  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const handleSession = async (_session: Session | null) => {
    setSession(_session);
    setShowRegisterInvitation(_session?.user?.user_metadata ? false : true);
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

        if (worflow[0].profile === null) {
          setProfile({
            full_name: 'Unknown',
          });
        } else {
          setProfile(worflow[0].profile);
        }
      },
    });

    queryOrgByOrgId({
      orgId,
      onSuccess: (data: any) => {
        setOrg(data[0]);
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
            <div className='w-full relative '>
              {showRegisterInvitation ? (
                <div className='absolute w-full h-full flex items-center justify-center z-50'>
                  <div className='flex items-center flex-row p-4 bg-white rounded-lg'>
                    <LogoSyncVote />
                    <div className='mx-4'>
                      <span className='font-bold mr-2'>
                        Welcome to Syncvote!
                      </span>{' '}
                      Create an account to leave comments and reactions on this
                      workflow.
                    </div>
                    <Button type='default' className='flex items-center mr-4'>
                      <Google />
                      <div className='ml-1'>Continue with Google</div>
                    </Button>
                    <Button
                      type='default'
                      shape='circle'
                      icon={<CloseOutlined />}
                      onClick={() => setShowRegisterInvitation(false)}
                    />
                  </div>
                </div>
              ) : null}
              <Banner bannerUrl={workflow?.banner_url} />
            </div>

            <Layout>
              <Sider
                collapsed={leftSiderStatus === 'closed'}
                collapsedWidth={0}
                width='33%'
                theme='light'
                style={{ backgroundColor: '#f6f6f6' }}
                className='information-collapsed'
              >
                {leftSiderStatus === 'description' ? (
                  <Space
                    direction='vertical'
                    className='border-r border-gray-200 border-solid h-full w-full'
                  >
                    <Space direction='vertical' size='large' className='w-full'>
                      <Space
                        direction='horizontal'
                        className='flex justify-between w-full p-2 bg-white drop-shadow'
                      >
                        <div className='font-bold text-md'>Description</div>
                        <Button
                          icon={<CloseOutlined />}
                          shape='circle'
                          className='bg-white'
                          onClick={() => setLeftSiderStatus('closed')}
                        />
                      </Space>
                    </Space>
                    {worflowInfo.desc ? (
                      <div className='m-4 p-4 bg-white rounded-lg'>
                        {parse(worflowInfo.desc)}
                      </div>
                    ) : (
                      <Empty />
                    )}
                  </Space>
                ) : null}
                {leftSiderStatus === 'comment' ? (
                  <div className='bg-white w-full border-r border-gray-300 border-solid'>
                    <Comment
                      where={where}
                      session={session}
                      api={api}
                      collapse={() => {
                        setLeftSiderStatus('closed');
                      }}
                    />
                  </div>
                ) : // style={{
                //   backgroundColor: '#FFF',
                //   borderRadius: '12px',
                //   borderRight: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
                // }}
                // className='comment-collapsedh'
                null}
                {leftSiderStatus === 'markers' ? (
                  <Space
                    direction='vertical'
                    className='border-r border-gray-200 border-solid h-full w-full overflow-y-scroll'
                  >
                    <Space direction='vertical' size='large' className='w-full'>
                      <Space
                        direction='horizontal'
                        className='flex justify-between w-full p-2 bg-white drop-shadow'
                      >
                        <div className='font-bold text-md'>Color legend</div>
                        <Button
                          icon={<CloseOutlined />}
                          shape='circle'
                          className='bg-white'
                          onClick={() => setLeftSiderStatus('closed')}
                        />
                      </Space>
                    </Space>
                    {version?.data?.cosmetic?.layouts[0]?.markers ? (
                      <Space
                        direction='vertical'
                        size='middle'
                        className='w-full p-2'
                      >
                        {version?.data?.cosmetic?.layouts[0]?.markers.map(
                          (marker: any) => {
                            return (
                              <Space
                                direction='horizontal'
                                className='flex items-center w-full bg-white p-4'
                                size='middle'
                              >
                                <div
                                  className='h-2 w-2'
                                  style={{ backgroundColor: marker.color }}
                                ></div>
                                <div>{marker.title}</div>
                              </Space>
                            );
                          }
                        )}
                      </Space>
                    ) : (
                      <Empty />
                    )}
                  </Space>
                ) : null}
              </Sider>
              <Layout className='relative flex items-center'>
                <Space className='absolute left-0 m-3 flex items-center border border-solid border-[#E3E3E2] rounded-lg text-[#252422] p-3 w-fit mt-7 bg-white z-50'>
                  <Icon iconUrl={workflow?.icon_url} size='large' />
                  <Space direction='vertical' className='w-full'>
                    <p className='text-[17px] font-normal items-left w-full'>
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
                <div
                  className='cursor-pointer flex rounded-t-3xl absolute bottom-0 z-50 bg-white'
                  style={{
                    border: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
                  }}
                >
                  <Space
                    direction='horizontal'
                    className='flex p-4'
                    size='middle'
                  >
                    <Button
                      className={`flex justify-center items-center ${
                        leftSiderStatus === 'description'
                          ? 'bg-violet-100'
                          : null
                      }`}
                      onClick={() => {
                        leftSiderStatus === 'description'
                          ? setLeftSiderStatus('closed')
                          : setLeftSiderStatus('description');
                      }}
                      icon={<GrDocumentText className='w-5 h-5' />}
                    />
                    <Button
                      className={`flex items-center justify-center ${
                        leftSiderStatus === 'comment' ? 'bg-violet-100' : null
                      }`}
                      onClick={() => {
                        leftSiderStatus === 'comment'
                          ? setLeftSiderStatus('closed')
                          : setLeftSiderStatus('comment');
                      }}
                      icon={<MdChatBubbleOutline className='w-5 h-5' />}
                    />
                    <Button
                      className='flex items-center justify-center'
                      icon={<FiLink className='w-5 h-5' />}
                      onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                        Modal.success({
                          title: 'Url copied!',
                          content: `"${url}" is copied to your clipboard`,
                        });
                      }}
                    />
                    <Button
                      className='flex items-center justify-center'
                      icon={<FiDownload className='w-5 h-5' />}
                      onClick={() => setDownloadImageStatus(true)}
                    />

                    <Button
                      className={`flex items-center justify-center ${
                        leftSiderStatus === 'markers' ? 'bg-violet-100' : null
                      }`}
                      icon={<LuPaintbrush className='w-5 h-5' />}
                      onClick={() => {
                        leftSiderStatus === 'markers'
                          ? setLeftSiderStatus('closed')
                          : setLeftSiderStatus('markers');
                      }}
                    />
                  </Space>
                  {/* <div className='p-4 flex'>
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
                  </div> */}
                </div>

                <DirectedGraph
                  viewMode={GraphViewMode.VIEW_ONLY}
                  data={version?.data || emptyStage}
                  selectedNodeId={selectedNodeId}
                  selectedLayoutId={
                    version?.data?.cosmetic?.defaultLayout?.horizontal
                  }
                  setExportImage={setDownloadImageStatus}
                  shouldExportImage={downloadImageStatus}
                  onChange={(newData) => {}}
                  onChangeLayout={(newData) => {}}
                  onDeleteNode={(nodeId) => {}}
                  onConfigEdgePanelClose={() => {}}
                  onConfigPanelClose={() => setSelectedNodeId('')}
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
          <Skeleton />
        )}
      </Layout>
    </>
  );
};
