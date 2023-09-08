import {
  BranchesOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import {
  DirectedGraph,
  defaultLayout,
  emptyCosmetic,
  emptyStage,
  getVoteMachine,
} from '@components/DirectedGraph';
import Icon from '@components/Icon/Icon';
import {
  canUserEditWorkflowVersion,
  queryWeb2Integration,
  queryWorkflow,
  upsertWorkflowVersion,
} from '@dal/data';
import { changeCosmetic, changeLayout, changeVersion } from '@middleware/logic';
import { extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import { Button, Drawer, Modal, Skeleton, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditInfo from './fragment/EditInfo';
import {
  GraphViewMode,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from '@types';
import { AuthContext } from '@layout/context/AuthContext';
import Header from './fragment/Header';
import NotFound404 from '@pages/NotFound404';
import Debug from '@components/Debug/Debug';

const extractVersion = ({
  workflows,
  workflowId,
  versionId,
}: {
  workflows: any;
  workflowId: number;
  versionId: number;
}) => {
  const wf = workflows?.find((workflow: any) => workflow.id === workflowId);
  let extractedVersion: any = {};
  if (wf) {
    extractedVersion = structuredClone(
      wf.workflow_version.find((wv: any) => wv.id === versionId)
    );
    // console.log('extractedVersion', extractedVersion);
    if (!extractedVersion) return {};
  } else {
    return {};
  }
  const cosmetic = extractedVersion?.data?.cosmetic;
  if (typeof extractedVersion?.data === 'string') {
    extractedVersion.data = emptyStage;
  }
  if (!cosmetic) {
    extractedVersion.data.cosmetic = emptyCosmetic;
  } else if (cosmetic.layouts.length === 0) {
    extractedVersion.data.cosmetic.layouts = [defaultLayout];
    extractedVersion.data.cosmetic.defaultLayout = {
      horizontal: 'default',
      vertical: 'default',
    };
  } else if (
    !extractedVersion.data.cosmetic.defaultLayout ||
    extractedVersion.data.cosmetic.defaultLayout?.horizontal === ''
  ) {
    extractedVersion.data.cosmetic.defaultLayout = {
      horizontal: cosmetic.layouts[0].id,
      vertical: cosmetic.layouts[0].id,
    };
  }
  return extractedVersion;
};

export const EditVersion = () => {
  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDataFetchedFromServer, setIsDataFetchedFromServer] = useState(false);
  const orgId = extractIdFromIdString(orgIdString);
  const workflowId = extractIdFromIdString(workflowIdString);
  const versionId = extractIdFromIdString(versionIdString);
  const dispatch = useDispatch();
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { workflows, lastFetch } = useSelector((state: any) => state.workflow);
  const extractedVersion = extractVersion({
    workflows,
    workflowId,
    versionId,
  });
  const { web2Integrations } = useSelector((state: any) => state.integration);
  const [version, setVersion] = useState<any>(extractedVersion);
  const [web2IntegrationsState, setWeb2IntegrationsState] =
    useState(web2Integrations);
  const [workflow, setWorkflow] = useState<any>(
    workflows.find((w: any) => w.id === workflowId)
  );
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  const [selectedLayoutId, setSelectedLayoutId] = useState(
    extractedVersion?.data?.cosmetic?.defaultLayout?.horizontal
  );
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [lastSaved, setLastSaved] = useState(-1);
  const [shouldDownloadImage, setShouldDownloadImage] = useState(false);
  const [viewMode, setViewMode] = useState(GraphViewMode.EDIT_WORKFLOW_VERSION);
  const extractWorkflowFromList = (wfList: any) => {
    let extractedVersion = extractVersion({
      workflows: wfList,
      workflowId,
      versionId,
    });
    setVersion(extractedVersion);
    setSelectedLayoutId(
      extractedVersion?.data?.cosmetic?.defaultLayout?.horizontal || 'default'
    );
    setDataHasChanged(false);
    setWorkflow(wfList.find((w: any) => w.id === workflowId));
    return extractedVersion.data ? true : false;
  };
  // const autoSaveWorker: Worker = useMemo(
  //   () => new Worker(new URL('/workers/AutoSave.ts', import.meta.url)),
  //   []
  // );
  // autoSaveWorker.onmessage = (e) => {
  //   if (dataHasChanged) {
  //     handleSave('data');
  //     console.log('try auto save');
  //     autoSaveWorker.postMessage(null);
  //   }
  // };
  // useEffect(() => {
  //   autoSaveWorker.postMessage(null);
  // }, [dataHasChanged]);
  const fetchDataFromServer = () => {
    setIsDataFetchedFromServer(true);
    setIsLoadingData(true);

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
        setIsLoadingData(false);
      },
      onError: (error: any) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
        setIsLoadingData(false);
      },
    });
  };
  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
      fetchDataFromServer();
    } else {
      const isDataInRedux = extractWorkflowFromList(workflows);
      if (!isDataInRedux && isDataFetchedFromServer === false) {
        fetchDataFromServer();
      }
      setWeb2IntegrationsState(web2Integrations);
    }

    canUserEditWorkflowVersion({
      workflowVersionId: versionId,
      onResult: (canEdit: boolean) => {
        if (!canEdit) {
          setViewMode(GraphViewMode.VIEW_ONLY);
        }
      },
    });
    setDataHasChanged(false);
  }, [workflows, web2Integrations, lastFetch]);
  useEffect(() => {
    const handleTabClose = (event: any) => {
      event.preventDefault();
      return (event.returnValue = 'Are you sure you want to exit?');
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [workflows]);
  let timerHandler: any = undefined;
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  // useEffect(() => {
  //   if (
  //     dataHasChanged &&
  //     isLoadingData === false &&
  //     lastSaved === -1 &&
  //     version.data
  //   ) {
  //     // this is the first time data is loaded
  //     setLastSaved(Date.now());
  //     setAutoSaveStatus('first time, lastSaved is set');
  //     return;
  //   }
  //   if (
  //     dataHasChanged &&
  //     isLoadingData === false &&
  //     lastSaved !== -1 &&
  //     version.data
  //   ) {
  //     const now = Date.now();
  //     if (now - lastSaved > 10000) {
  //       // let' save data to server
  //       // TODO: this data is not the latest data, it's the data when the timer is set
  //       handleSave('data');
  //       setAutoSaveStatus('auto save');
  //       // setDataHasChanged(false);
  //     } else {
  //       // if there is a timer then do nothing
  //       if (timerHandler !== undefined) {
  //         return;
  //       } else {
  //         // else, let's set a timer
  //         setAutoSaveStatus(
  //           'a timer is set to 10s to save. Tick tock tick tock'
  //         );
  //         timerHandler = setTimeout(() => {
  //           // TODO: this data is not the latest data, it's the data when the timer is set
  //           handleSave('data');
  //           // setDataHasChanged(false);
  //           // setLastSaved(Date.now());
  //           clearTimeout(timerHandler);
  //           timerHandler = undefined;
  //           setAutoSaveStatus('saved & clear timeout');
  //         }, 10000 - (now - lastSaved));
  //       }
  //     }
  //     return;
  //   }
  // }, [dataHasChanged]);

  const handleSave = async (
    mode: 'data' | 'info' | undefined,
    changedData?: any | undefined
  ) => {
    const versionToSave = changedData || version;
    await upsertWorkflowVersion({
      dispatch,
      workflowVersion: {
        versionId,
        workflowId: workflow.id,
        version: versionToSave?.version,
        status: versionToSave?.status,
        versionData: versionToSave?.data,
        recommended: versionToSave?.recommended,
      },
      onSuccess: () => {
        queryWorkflow({
          orgId,
          onLoad: (_data: any) => {
            extractWorkflowFromList(_data);
          },
          dispatch,
        });
        setLastSaved(Date.now());
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
      mode,
    });
    // clearSelectedVersion();
  };
  const onChange = (changedData: any) => {
    const newData = changeVersion({
      versionData: version?.data || emptyStage,
      selectedNodeId,
      changedCheckPointData: changedData,
    });
    setVersion({
      ...version,
      data: newData,
    });
    if (selectedNodeId) {
      setDataHasChanged(true);
    }
  };
  const onDeleteNode = (id: any) => {
    if (id === version?.data.start) {
      Modal.error({
        title: 'Error',
        content: 'Cannot delete start node',
      });
    } else {
      const newData = structuredClone(version?.data);
      const index = newData.checkpoints.findIndex((v: any) => v.id === id);
      newData.checkpoints?.forEach((_node: any, cindex: number) => {
        if (_node.children?.includes(id)) {
          const newChkpData =
            getVoteMachine(_node.vote_machine_type)?.deleteChildNode(
              _node.data,
              _node.children,
              id
            ) || _node.data;
          newData.checkpoints[cindex].data = newChkpData;
          if (_node.children) {
            _node.children.splice(_node.children.indexOf(id));
          }
        }
      });
      newData.checkpoints.splice(index, 1);
      setVersion({
        ...version,
        data: newData,
      });
      if (selectedNodeId) {
        setDataHasChanged(true);
      }
      setSelectedNodeId('');
      setDataHasChanged(true);
    }
  };
  const onChangeLayout = (changedData: IWorkflowVersionLayout) => {
    if (selectedLayoutId !== '') {
      // TODO: version.data.cosmetic might not existed before this call
      const selectedLayout = version.data.cosmetic.layouts.find(
        (l: any) => l.id === selectedLayoutId
      );
      const selectedLayoutIndex = version.data.cosmetic.layouts.findIndex(
        (l: any) => l.id === selectedLayoutId
      );
      const newLayout = changeLayout(selectedLayout, changedData);
      if (newLayout != undefined) {
        const tmp = structuredClone(version);
        tmp.data.cosmetic.layouts[selectedLayoutIndex] = newLayout;
        // console.log(tmp);
        setVersion({
          ...tmp,
        });
      }
      setDataHasChanged(true);
    }
  };
  const onEdgeClick = (e: any, edge: any) => {
    // TODO: move this to IGraph interface to drill selectedEdge into children components
    setSelectedEdgeId(edge.id);
  };
  const onNodeChanged = (changedNodes: any) => {
    const newData = structuredClone(version?.data);
    newData?.checkpoints?.forEach((v: any, index: number) => {
      const changedNode = changedNodes.find((cN: any) => cN.id === v.id);
      // TODO: position data should come from cosmetic
      if (changedNode && changedNode.position) {
        newData.checkpoints[index].position = changedNode.position;
        if (selectedLayoutId) {
          const layout = newData.cosmetic.layouts.find(
            (l: any) => l.id === selectedLayoutId
          );
          if (!layout.nodes) {
            layout.nodes = [];
          }
          const nodes = layout.nodes;
          const index = nodes.findIndex((n: any) => n.id === changedNode.id);
          if (index === -1) {
            nodes.push({
              id: changedNode.id,
              position: changedNode.position,
            });
          } else {
            nodes[index].position = changedNode.position;
          }
        }
      }
    });
    setVersion({
      ...version,
      data: newData,
    });
    setDataHasChanged(true);
  };
  const onCosmeticChanged = (changed: IWorkflowVersionCosmetic) => {
    const cosmetic = changeCosmetic(version?.data.cosmetic, changed);
    setVersion({
      ...version,
      data: { ...version.data, cosmetic },
    });
    setDataHasChanged(true);
  };
  const onResetPosition = () => {
    const newData = structuredClone(version?.data);
    newData.checkpoints.forEach((v: any, index: number) => {
      delete newData.checkpoints[index].position;
    });
    setVersion({
      ...version,
      data: newData,
    });
    setDataHasChanged(true);
  };
  const onAddNewNode = () => {
    const newData = structuredClone(version?.data);
    const newId = `node-${new Date().getTime()}`;
    newData.checkpoints.push({
      id: newId,
      position: centerPos,
      isEnd: true,
    });
    setVersion({
      ...version,
      data: newData,
    });
    setSelectedNodeId(newId);
    if (selectedNodeId) {
      setDataHasChanged(true);
    }
  };
  const onViewPortChange = (viewport: any) => {
    setCenterPos({
      x: (-viewport.x + 600) / viewport.zoom,
      y: (-viewport.y + 250) / viewport.zoom,
    });
  };
  const markers =
    version?.data?.cosmetic?.layouts.find((l: any) => l.id === selectedLayoutId)
      ?.markers || [];
  const [showColorLegend, setShowColorLegend] = useState(true);
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className='w-full bg-slate-100 h-screen'>
            <Debug>
              <div>
                {viewMode}-{GraphViewMode.VIEW_ONLY}
              </div>
              <div className='block'>
                {version ? 'version is TRUE' : 'version is FALSE'}
              </div>
              <div className='block'>
                {autoSaveStatus ? autoSaveStatus : ''}
              </div>
            </Debug>
            <Header
              session={session}
              workflow={workflow}
              dataChanged={dataHasChanged}
              handleSave={handleSave}
              lastSaved={lastSaved}
              handleDownloadImage={setShouldDownloadImage}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <div
              className={`w-full flex justify-center`}
              style={{ height: 'calc(100% - 80px)' }}
            >
              {versionId && !version?.data ? (
                isLoadingData === true ? (
                  <div className='w-full h-full'>
                    <Skeleton className='p-16' />
                  </div>
                ) : workflow ? (
                  <div>
                    <NotFound404
                      title='Permission denied'
                      message={
                        <div className='w-full text-center'>
                          <p>
                            Sorry, you don not have permission to access to this
                            workflow.
                          </p>
                          <p>
                            Ask the owner to publish this workflow or add you as
                            a workspace editor.
                          </p>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <NotFound404 />
                )
              ) : viewMode === GraphViewMode.VIEW_ONLY ? (
                <NotFound404
                  title='Permission denied'
                  message={
                    <div className='w-full text-center'>
                      <p>
                        Sorry, you don not have permission to{' '}
                        <span className='text-violet-500'>EDIT</span> to this
                        workflow.
                      </p>
                      <div>Click here to open the view mode</div>
                    </div>
                  }
                  cta={
                    <Button
                      type='primary'
                      onClick={() =>
                        navigate(
                          `/public/${orgIdString}/${workflowIdString}/${versionIdString}`
                        )
                      }
                    >
                      Open in View
                    </Button>
                  }
                />
              ) : (
                <div className='w-full h-full'>
                  <DirectedGraph
                    shouldExportImage={shouldDownloadImage}
                    setExportImage={setShouldDownloadImage}
                    navPanel={
                      <Space direction='vertical'>
                        <div
                          className='text-gray-400 font-bold flex items-center gap-2'
                          style={{ marginBottom: '0px' }}
                        >
                          <div>Color legend</div>
                          <div
                            className='hover:text-violet-500 cursor-pointer'
                            onClick={() => setShowColorLegend(!showColorLegend)}
                          >
                            {showColorLegend ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </div>
                        </div>
                        {showColorLegend &&
                          markers.map((marker: any) => {
                            return (
                              <div
                                className='flex gap-2 items-center'
                                key={marker.color}
                              >
                                <div
                                  className='w-[16px] h-[16px]'
                                  style={{ backgroundColor: marker.color }}
                                ></div>
                                <Typography.Paragraph
                                  editable={{
                                    onChange: (val) => {
                                      markers[markers.indexOf(marker)].title =
                                        val;
                                      const selectedLayout =
                                        version?.data?.cosmetic?.layouts.find(
                                          (l: any) => l.id === selectedLayoutId
                                        );
                                      selectedLayout.markers = markers;
                                      const cosmetic = changeCosmetic(
                                        version?.data.cosmetic,
                                        {
                                          layouts: [selectedLayout],
                                        }
                                      );
                                      setVersion({
                                        ...version,
                                        data: { ...version.data, cosmetic },
                                      });
                                      setDataHasChanged(true);
                                    },
                                  }}
                                  style={{ marginBottom: '0px' }}
                                >
                                  {marker.title}
                                </Typography.Paragraph>

                                <CloseCircleOutlined
                                  className='hover:text-red-500'
                                  onClick={() => {
                                    markers.splice(markers.indexOf(marker), 1);
                                    const selectedLayout =
                                      version?.data?.cosmetic?.layouts.find(
                                        (l: any) => l.id === selectedLayoutId
                                      );
                                    selectedLayout.markers = markers;
                                    const cosmetic = changeCosmetic(
                                      version?.data.cosmetic,
                                      {
                                        layouts: [selectedLayout],
                                      }
                                    );
                                    setVersion({
                                      ...version,
                                      data: { ...version.data, cosmetic },
                                    });
                                    setDataHasChanged(true);
                                  }}
                                />
                              </div>
                            );
                          })}
                      </Space>
                    }
                    viewMode={viewMode}
                    data={version?.data || emptyStage}
                    selectedNodeId={selectedNodeId}
                    selectedEdgeId={selectedEdgeId}
                    selectedLayoutId={selectedLayoutId}
                    web2Integrations={web2IntegrationsState}
                    onChange={onChange}
                    onDeleteNode={onDeleteNode}
                    onConfigPanelClose={() => setSelectedNodeId('')}
                    onChangeLayout={onChangeLayout}
                    onEdgeClick={onEdgeClick}
                    onConfigEdgePanelClose={() => setSelectedEdgeId('')}
                    onNodeChanged={onNodeChanged}
                    onCosmeticChanged={onCosmeticChanged}
                    onLayoutClick={(selectedLayoutId) => {
                      setSelectedLayoutId(selectedLayoutId);
                    }}
                    onNodeClick={(event, node) => {
                      setSelectedNodeId(node.id);
                    }}
                    onPaneClick={() => {
                      setSelectedNodeId('');
                    }}
                    onResetPosition={onResetPosition}
                    onAddNewNode={onAddNewNode}
                    onViewPortChange={onViewPortChange}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    </>
  );
};

{
  /* <Space
  direction="horizontal"
  size="middle"
  className="flex items-center border-2 bg-white p-2 rounded-md"
>
  <Space direction="horizontal" size="small">
    
  </Space>
  <BranchesOutlined />
  <Space direction="horizontal" size="small">
    <div className="font-bold">{version?.version}</div>
    <span
      onClick={() => setShowInfoPanel(true)}
      className="cursor-pointer"
    >
      <EditIcon />
    </span>
  </Space>
  <Button
    type="link"
    className="flex items-center text-violet-500"
    icon={<SaveOutlined />}
    disabled={!dataHasChanged}
    onClick={() => {
      handleSave('data');
    }}
  >
    Save
  </Button>
</Space> */
}
