import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { GrDocumentText } from 'react-icons/gr';
import parse from 'html-react-parser';
import { DirectedGraph, emptyStage } from 'directed-graph';
import { extractIdFromIdString, useGetDataHook } from 'utils';
import { Button, Layout, Space, Empty, Modal, Skeleton, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiCalendar, FiHome, FiLink, FiUser, FiDownload } from 'react-icons/fi';
import { MdChatBubbleOutline } from 'react-icons/md';
import { LuPaintbrush } from 'react-icons/lu';
import Sider from 'antd/es/layout/Sider';
import { GraphViewMode } from 'directed-graph';
import { Icon } from 'icon';
import {
  queryATemplate,
  queryCurrentTemplateVersion,
} from '@dal/data/template';
import Header from './Header';
import moment from 'moment';
import { config } from '@dal/config';

export const TemplateViewData = () => {
  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const { templateIdString } = useParams();
  const templateId = extractIdFromIdString(templateIdString);
  const [template, setTemplate] = useState<any>({});
  const dispatch = useDispatch();
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [version, setVersion] = useState<any>();
  const [workflow, setWorkflow] = useState<any>();
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  const [rightSiderStatus, setRSiderStatus] = useState('description');

  const [downloadImageStatus, setDownloadImageStatus] = useState(false);
  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const diagramFullScreen = searchParams.get('view') === 'full' ? true : false;

  const onEdgeClick = (e: any, edge: any) => {
    // TODO: move this to IGraph interface to drill selectedEdge into children components
    setSelectedEdgeId(edge.id);
  };
  const isFullScreen = searchParams.get('view') === 'full' ? true : false;
  const [loading, setLoading] = useState(true);
  const fetchTemplateData = async () => {
    setLoading(true);
    const { data, error } = await queryATemplate({ dispatch, templateId });
    if (data) {
      const currentVerionId = data.current_version_id;
      const { data: versionData, error: tmplError } =
        await queryCurrentTemplateVersion({
          dispatch,
          current_version_id: currentVerionId,
        });
      if (!error) {
        setVersion(versionData);
        setTemplate({
          title: data.title,
          id: data.id,
          desc: data.desc,
          icon_url: data.icon_url,
          owner_org_id: data.owner_org_id,
          created_at: data.created_at,
          tags: data.tag_template,
        });
      } else {
        Modal.error({
          content: tmplError?.message,
        });
      }
    } else {
      Modal.error({
        content: 'Fail to load data',
      });
    }
    setLoading(false);
  };
  console.log('1111');
  useEffect(() => {
    fetchTemplateData();
  }, []);
  const isDesktop = window.innerWidth > 700;
  return (
    <div className={`w-full flex flex-col justify-center`}>
      {!isFullScreen ? <Header /> : null}
      <div
        className={`w-full flex flex-col justify-center`}
        style={
          isFullScreen
            ? { height: 'calc(100%)' }
            : { height: 'calc(100% - 80px)' }
        }
      >
        <Layout>
          <Layout className='relative flex items-center'>
            <Space className='absolute left-0 m-3 flex items-center border border-solid border-[#E3E3E2] rounded-lg text-[#252422] p-3 w-fit mt-7 bg-white z-50'>
              <Icon presetIcon={[]} iconUrl={template?.icon_url} size='large' />
              <Space direction='vertical' className='w-full'>
                <p className='text-[17px] font-normal items-left w-full text-ellipsis overflow-hidden whitespace-nowrap'>
                  {template?.title}
                </p>
                <Space direction='horizontal'>
                  <div className='flex items-center text-[13px] text-ellipsis overflow-hidden whitespace-nowrap'>
                    <FiHome className='mr-1' size={16} />
                    {
                      orgs?.find((org: any) => org.id === template.owner_org_id)
                        ?.title
                    }
                  </div>

                  {isDesktop ? (
                    <div className='flex items-center text-[13px] text-ellipsis overflow-hidden  whitespace-nowrap'>
                      <FiCalendar className='mr-1' size={16} />
                      {moment(template?.created_at).format('DD MMM YYYY')}
                    </div>
                  ) : null}
                </Space>
              </Space>
            </Space>
            <div
              className='cursor-pointer flex rounded-t-3xl absolute bottom-0 z-50 bg-white'
              style={{
                border: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
              }}
            >
              <Space direction='horizontal' className='flex p-4' size='middle'>
                <Button
                  className={`flex justify-center items-center ${
                    rightSiderStatus === 'description' ? 'bg-violet-100' : null
                  }`}
                  onClick={() => {
                    if (isDesktop) {
                      rightSiderStatus === 'description'
                        ? setRSiderStatus('closed')
                        : setRSiderStatus('description');
                    } else {
                      Modal.info({
                        title: 'Description',
                        content: parse(template?.desc),
                      });
                    }
                  }}
                  icon={<GrDocumentText className='w-5 h-5' />}
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
                    rightSiderStatus === 'markers' ? 'bg-violet-100' : null
                  }`}
                  icon={<LuPaintbrush className='w-5 h-5' />}
                  onClick={() => {
                    if (isDesktop) {
                      rightSiderStatus === 'markers'
                        ? setRSiderStatus('closed')
                        : setRSiderStatus('markers');
                    } else {
                      Modal.info({
                        title: 'Alert',
                        content: 'This function only available on desktop',
                      });
                    }
                  }}
                />
                <Button
                  className={`flex items-center justify-center`}
                  icon={
                    isFullScreen ? (
                      <FullscreenExitOutlined />
                    ) : (
                      <FullscreenOutlined />
                    )
                  }
                  onClick={() => {
                    if (isFullScreen) {
                      navigate(window.location.pathname);
                    } else {
                      navigate(window.location.pathname + '?view=full');
                    }
                  }}
                />
              </Space>
            </div>
            {loading ? (
              <Skeleton />
            ) : (
              <DirectedGraph
                viewMode={GraphViewMode.VIEW_ONLY}
                data={version?.data || emptyStage}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onEdgeClick={onEdgeClick}
                onConfigPanelClose={() => setSelectedNodeId('')}
                selectedLayoutId={
                  version?.data?.cosmetic?.defaultLayout?.horizontal
                }
                onConfigEdgePanelClose={() => setSelectedEdgeId('')}
                setExportImage={setDownloadImageStatus}
                shouldExportImage={downloadImageStatus}
                onChange={(newData) => {}}
                onChangeLayout={(newData) => {}}
                onDeleteNode={(nodeId) => {}}
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
            )}
          </Layout>
          <Sider
            collapsed={rightSiderStatus === 'closed'}
            collapsedWidth={0}
            width='33%'
            theme='light'
            style={{ backgroundColor: '#f6f6f6' }}
            className='information-collapsed'
          >
            {rightSiderStatus === 'description' ? (
              <div className='border-r border-gray-200 border-solid h-full w-full flex flex-col gap-2'>
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
                      onClick={() => setRSiderStatus('closed')}
                    />
                  </Space>
                </Space>
                <div className='overflow-y-scroll'>
                  {template.desc ? (
                    <div className='m-4 p-4 bg-white rounded-lg public-desc-wrapper'>
                      {parse(template.desc)}
                    </div>
                  ) : (
                    <Empty />
                  )}
                  <div className='font-bold text-md p-2'>Tags :</div>
                  <div className='m-4 mt-2 p-2 bg-white rounded-lg public-desc-wrapper'>
                    {template.tags &&
                      template.tags.map((tagWrapper: any) => {
                        const tag = tagWrapper.tag;
                        return (
                          <Tag
                            className={`inline cursor-pointer hover:bg-violet-500 hover:text-white py-1 px-2 rounded-full`}
                            key={tag.id}
                          >
                            {tag.label}
                          </Tag>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : null}
            {rightSiderStatus === 'markers' ? (
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
                      onClick={() => setRSiderStatus('closed')}
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
        </Layout>
      </div>
    </div>
  );
};
