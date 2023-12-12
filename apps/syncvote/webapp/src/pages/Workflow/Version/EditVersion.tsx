import {
  DirectedGraph,
  IDoc,
  emptyStage,
  getVoteMachine,
} from 'directed-graph';
import {
  canUserEditWorkflowVersion,
  queryWeb2Integration,
  queryWorkflow,
  upsertWorkflowVersion,
} from '@dal/data';
import { changeCosmetic, changeLayout, changeVersion } from '@middleware/logic';
import { shouldUseCachedData } from '@utils/helpers';
import { extractIdFromIdString } from 'utils';
import { Button, Modal, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
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
import WorkflowList from './fragment/WorkflowList';
import ColorLegend from './fragment/ColorLegend';
import PermissionDeniedToView from './fragment/PermissionDeniedToView';
import PermissionDeniedEdit from './fragment/PermissionDeniedEdit';
const workerBlob = new Blob([autoSaveWorkerString], {
  type: 'text/javascript',
});
const workerURL = URL.createObjectURL(workerBlob);
const autoSaveWorker = new Worker(workerURL, { type: 'classic' });
const env = import.meta.env.VITE_ENV;

import {
  changeNode,
  deleteNode,
  extractVersion,
  extractWorkflowFromList,
  newNode,
  save,
} from './funcs';
import VariableList from './fragment/VariableList';

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
        extractWorkflowFromList(
          wfList,
          workflowId,
          versionId,
          setVersion,
          setSelectedLayoutId,
          setDataHasChanged,
          setWorkflow
        );
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
      const isDataInRedux = extractWorkflowFromList(
        workflows,
        workflowId,
        versionId,
        setVersion,
        setSelectedLayoutId,
        setDataHasChanged,
        setWorkflow
      );
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
    await save(
      changedData,
      version,
      upsertWorkflowVersion,
      dispatch,
      versionId,
      workflow,
      setLastSaved,
      mode,
      hideLoading
    );
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
    deleteNode(
      id,
      version,
      getVoteMachine,
      setVersion,
      selectedNodeId,
      setDataHasChanged,
      setSelectedNodeId
    );
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
    changeNode(
      version,
      changedNodes,
      selectedLayoutId,
      setVersion,
      setDataHasChanged
    );
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
    newNode(
      version,
      setVersion,
      setDataHasChanged,
      centerPos,
      gridX,
      gridY,
      setGridX,
      setGridY,
      setSelectedNodeId,
      selectedNodeId
    );
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
                  <PermissionDeniedToView />
                ) : (
                  <NotFound404 />
                )
              ) : viewMode === GraphViewMode.VIEW_ONLY ? (
                <PermissionDeniedEdit
                  navigate={navigate}
                  orgIdString={orgIdString}
                  workflowIdString={workflowIdString}
                  versionIdString={versionIdString}
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
                        <ColorLegend
                          showColorLegend={showColorLegend}
                          setShowColorLegend={setShowColorLegend}
                          markers={markers}
                          version={version}
                          selectedLayoutId={selectedLayoutId}
                          changeCosmetic={changeCosmetic}
                          setVersion={setVersion}
                          setDataHasChanged={setDataHasChanged}
                        />
                        <WorkflowList
                          version={version}
                          setVersion={setVersion}
                          allCheckPoints={allCheckPoints}
                        />
                        <VariableList
                          version={version}
                          setVersion={setVersion}
                        />
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
