import {
  BranchesOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import NewSubWorkflowModal from './fragment/NewSubWorkflowModal';
import {
  DirectedGraph,
  IDoc,
  defaultLayout,
  emptyCosmetic,
  emptyStage,
  getVoteMachine,
} from 'directed-graph';
import { Icon } from 'icon';
import {
  canUserEditWorkflowVersion,
  queryWeb2Integration,
  queryWorkflow,
  upsertWorkflowVersion,
} from '@dal/data';
import { changeCosmetic, changeLayout, changeVersion } from '@middleware/logic';
import { shouldUseCachedData } from '@utils/helpers';
import { extractIdFromIdString } from 'utils';
import {
  Button,
  Drawer,
  Input,
  Modal,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GraphViewMode,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from 'directed-graph';
import { AuthContext } from '@layout/context/AuthContext';
import Header from './fragment/Header';
import NotFound404 from '@pages/NotFound404';
import Debug from '@components/Debug/Debug';
import { CreateProposalModal } from '@fragments/CreateProposalModal';
import autoSaveWorkerString from './worker.js?raw';
const workerBlob = new Blob([autoSaveWorkerString], {
  type: 'text/javascript',
});
const workerURL = URL.createObjectURL(workerBlob);
const autoSaveWorker = new Worker(workerURL, { type: 'classic' });
const env = import.meta.env.VITE_ENV;

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
  const [openCreateProposalModal, setOpenCreateProposalModal] = useState(false);
  const { web2Integrations } = useSelector((state: any) => state.integration);
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
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  const [selectedLayoutId, setSelectedLayoutId] = useState(
    version?.data?.cosmetic?.defaultLayout?.horizontal
  );
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [lastSaved, setLastSaved] = useState(-1);
  const [shouldDownloadImage, setShouldDownloadImage] = useState(false);
  const [viewMode, setViewMode] = useState(GraphViewMode.EDIT_WORKFLOW_VERSION);
  const [fitScreen, setFitScreen] = useState(0); // 0: never fit, 1: should fit, 2: fitted
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
  if (env === 'production') {
    autoSaveWorker.onmessage = (e) => {
      if (dataHasChanged) {
        handleSave('data', undefined, true);
        autoSaveWorker.postMessage(null);
        setDataHasChanged(false);
      }
    };
  }
  useEffect(() => {
    if (dataHasChanged) {
      autoSaveWorker.postMessage(null);
    }
  }, [dataHasChanged]);
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
        if (fitScreen === 0) {
          setFitScreen(1);
        }
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
  if (env === 'production') {
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
  }
  const handleSave = async (
    mode: 'data' | 'info' | undefined,
    changedData?: any | undefined,
    hideLoading?: boolean
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
        setLastSaved(Date.now());
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
      mode,
      hideLoading,
    });
  };
  const onChange = (changedData: any) => {
    if (fitScreen === 1) {
      setFitScreen(2);
    }
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
  // TODO: delete elements in cosmetic.layouts
  const onDeleteNode = (id: any) => {
    if (id === version?.data.start) {
      // TODO: how about start node of a sub workflow?
      Modal.error({
        title: 'Error',
        content: 'Cannot delete start node',
      });
    } else {
      const newData = structuredClone(version?.data);
      const index = newData.checkpoints.findIndex((v: any) => v.id === id);
      if (index !== -1) {
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
      } else {
        if (newData.subWorkflows) {
          newData.subWorkflows.map((subWorkflow: any) => {
            const sIdx = subWorkflow.checkpoints.findIndex(
              (v: any) => v.id === id
            );
            if (sIdx !== -1) {
              subWorkflow.checkpoints.forEach((_node: any, cindex: number) => {
                if (_node.children?.includes(id)) {
                  const newChkpData =
                    getVoteMachine(_node.vote_machine_type)?.deleteChildNode(
                      _node.data,
                      _node.children,
                      id
                    ) || _node.data;
                  subWorkflow.checkpoints[cindex].data = newChkpData;
                  if (_node.children) {
                    _node.children.splice(_node.children.indexOf(id));
                  }
                }
              });
              subWorkflow.checkpoints.splice(sIdx, 1);
            }
          });
        }
      }
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
    if (newData.subWorkflows) {
      newData.subWorkflows.map((subWorkflow: any) => {
        subWorkflow.checkpoints.forEach((v: any, index: number) => {
          const changedNode = changedNodes.find((cN: any) => cN.id === v.id);
          if (changedNode && changedNode.position) {
            subWorkflow.checkpoints[index].position = changedNode.position;
            if (selectedLayoutId) {
              const layout = newData.cosmetic.layouts.find(
                (l: any) => l.id === selectedLayoutId
              );
              if (!layout.nodes) {
                layout.nodes = [];
              }
              const nodes = layout.nodes;
              const index = nodes.findIndex(
                (n: any) => n.id === changedNode.id
              );
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
      });
    }
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
  // TODO: this function is deprecated, delete it
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
  const [gridX, setGridX] = useState(0); // initialize gridX with 0
  const [gridY, setGridY] = useState(0); // initialize gridY with 0
  const onAddNewNode = () => {
    const newData = structuredClone(version?.data);
    const newId = `node-${new Date().getTime()}`;
    const nodeSpacing = 130;

    let newPos = {
      x: centerPos.x + gridX * nodeSpacing,
      y: centerPos.y + gridY * nodeSpacing,
    };

    newData.checkpoints.push({
      title: `Checkpoint ` + version?.data?.checkpoints?.length,
      id: newId,
      position: newPos,
      isEnd: true,
    });

    if (gridX < 5) {
      setGridX(gridX + 1);
    } else {
      setGridX(0);
      setGridY(gridY + 1);
    }

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
  const onAddNewDoc = (doc: IDoc) => {
    const newData = structuredClone(version?.data);
    if (!newData.docs) {
      newData.docs = [];
    }
    newData.docs.push({ ...doc, id: `doc-${new Date().getTime()}` });
    setVersion({
      ...version,
      data: newData,
    });
  };
  const onDeleteDoc = (docId: string) => {
    const newData = structuredClone(version?.data);
    if (newData.docs) {
      const idx = newData.docs.findIndex((d: IDoc) => d.id === docId);
      if (idx !== -1) {
        newData.docs.splice(docId, 1);
        setVersion({
          ...version,
          data: newData,
        });
      }
    }
  };
  const onChangeDoc = (changedDoc: IDoc) => {
    const newData = structuredClone(version?.data);
    if (newData.docs) {
      const idx = newData.docs.findIndex((d: IDoc) => d.id === changedDoc.id);
      if (idx !== -1) {
        newData.docs[idx] = structuredClone(changedDoc);
        setVersion({
          ...version,
          data: newData,
        });
      }
    }
  };
  const markers =
    version?.data?.cosmetic?.layouts.find((l: any) => l.id === selectedLayoutId)
      ?.markers || [];
  const [showColorLegend, setShowColorLegend] = useState(true);
  const [showAddNewSubWorkflowModal, setShowAddNewSubWorkflowModal] =
    useState(false);
  const allCheckPoints = version?.data?.checkpoints
    ? [...version.data.checkpoints]
    : [];
  version?.data?.subWorkflows?.map((w: any) =>
    allCheckPoints.push(...(w.checkpoints || []))
  );
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className='w-full bg-slate-100 h-screen'>
            <Debug>
              <Button
                onClick={() => {
                  console.log(version?.data);
                }}
              >
                Console log verion
              </Button>
            </Debug>
            <NewSubWorkflowModal
              isShown={showAddNewSubWorkflowModal}
              data={version?.data}
              onCancel={() => setShowAddNewSubWorkflowModal(false)}
              onOK={({
                refIdString,
                startId,
              }: {
                refIdString: string;
                startId: string;
              }) => {
                const existed =
                  version?.data?.subWorkflows?.filter(
                    (w: any) => w.refId === refIdString
                  ) || [];
                setShowAddNewSubWorkflowModal(false);
                if (existed.length > 0) {
                  Modal.error({
                    title: 'Error',
                    content: 'Sub-workflow already existed',
                  });
                  return;
                } else {
                  const newData = { ...version.data };
                  const subWorkflows = newData.subWorkflows
                    ? [...newData.subWorkflows]
                    : [];
                  const checkpoints = [...newData.checkpoints];
                  let chkp = undefined;
                  for (var i = 0; i < checkpoints.length; i++) {
                    chkp = structuredClone(checkpoints[i]);
                    if (chkp.id === startId) {
                      checkpoints.splice(i, 1);
                      break;
                    }
                  }
                  subWorkflows.push({
                    refId: refIdString,
                    start: startId,
                    checkpoints: [chkp],
                  });
                  newData.subWorkflows = [...subWorkflows];
                  newData.checkpoints = [...checkpoints];
                  setVersion({
                    ...version,
                    data: newData,
                  });
                }
              }}
            />
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
                  <CreateProposalModal
                    open={openCreateProposalModal}
                    onCancel={() => {
                      setOpenCreateProposalModal(false);
                    }}
                    workflow={workflow}
                    workflowVersion={version}
                  />
                  <DirectedGraph
                    shouldExportImage={shouldDownloadImage}
                    setExportImage={setShouldDownloadImage}
                    shouldFitView={fitScreen === 1 ? true : false}
                    openCreateProposalModal={() => {
                      setOpenCreateProposalModal(true);
                    }}
                    navPanel={
                      <Space direction='vertical' size='middle'>
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
                        <Space direction='vertical' size='small'>
                          <div className='flex gap-2 flex-row items-center'>
                            <div>List of subworkflows</div>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() => {
                                setShowAddNewSubWorkflowModal(true);
                              }}
                            />
                          </div>
                          {version?.data?.subWorkflows?.map((s: any) => {
                            return (
                              <div
                                className='flex gap-2 flex-row items-center'
                                key={s.refId}
                              >
                                <Button
                                  icon={
                                    <DeleteOutlined
                                      onClick={() => {
                                        const newData = structuredClone(
                                          version?.data
                                        );

                                        const index =
                                          newData.subWorkflows.findIndex(
                                            (v: any) => v.refId === s.refId
                                          );
                                        const subWorkflowStartNode =
                                          newData.subWorkflows.find(
                                            (v: any) => v.refId === s.refId
                                          ).start;
                                        if (index !== -1) {
                                          newData.subWorkflows.splice(index, 1);
                                          const fk = newData.checkpoints.find(
                                            (ckp: any) =>
                                              ckp.vote_machine_type ===
                                                'forkNode' &&
                                              ckp.data?.start?.includes(s.refId)
                                          );
                                          if (fk) {
                                            fk.data.start.splice(
                                              fk.data.start.indexOf(s.refId),
                                              1
                                            );
                                            const idxStart =
                                              fk.children?.indexOf(
                                                subWorkflowStartNode
                                              );
                                            if (idxStart !== -1) {
                                              fk.children?.splice(idxStart, 1);
                                            }
                                            const endIdx = fk.data.end?.indexOf(
                                              s.refId
                                            );
                                            if (endIdx !== -1) {
                                              fk.data.end.splice(endIdx, 1);
                                            }
                                          }
                                          setVersion({
                                            ...version,
                                            data: newData,
                                          });
                                        }
                                      }}
                                    />
                                  }
                                  danger
                                />
                                <div>{s.refId}</div>
                                <div>
                                  {
                                    allCheckPoints.find(
                                      (ckp: any) => ckp.id === s.start
                                    )?.title
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </Space>
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
                    onAddNewDoc={onAddNewDoc}
                    onChangeDoc={onChangeDoc}
                    onDeleteDoc={onDeleteDoc}
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
