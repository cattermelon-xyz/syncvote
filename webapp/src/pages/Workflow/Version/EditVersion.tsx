import {
  BranchesOutlined,
  DownloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import {
  DirectedGraph,
  emptyCosmetic,
  emptyStage,
  getVoteMachine,
  renderVoteMachineConfigPanel,
} from '@components/DirectedGraph';
import Icon from '@components/Icon/Icon';
import {
  queryWeb2Integration,
  queryWorkflow,
  upsertWorkflowVersion,
} from '@middleware/data';
import { changeCosmetic, changeLayout, changeVersion } from '@middleware/logic';
import { extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import { Button, Drawer, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditInfo from './fragment/EditInfo';
import { IWorkflowVersionCosmetic, IWorkflowVersionLayout } from '@types';
import SaveGraphImage from '@components/SaveGraphImage/SaveGraphImage';

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

export const EditVersion = () => {
  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const workflowId = extractIdFromIdString(workflowIdString);
  const versionId = extractIdFromIdString(versionIdString);
  const dispatch = useDispatch();
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const { web2Integrations } = useSelector((state: any) => state.integration);
  const { workflows, lastFetch } = useSelector((state: any) => state.workflow);
  const [version, setVersion] = useState<any>(
    extractVersion({
      workflows,
      workflowId,
      versionId,
    })
  );
  const [web2IntegrationsState, setWeb2IntegrationsState] =
    useState(web2Integrations);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [workflow, setWorkflow] = useState<any>(
    workflows.find((w: any) => w.id === workflowId)
  );
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState('');
  const [selectedLayoutId, setSelectedLayoutId] = useState('');
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
        console.log(tmp);
        setVersion({
          ...tmp,
        });
      }
    }
  };
  const onEdgeClick = (e: any, edge: any) => {
    // TODO: move this to IGraph interface to drill selectedEdge into children components
    setSelectedEdgeId(edge.id);
  };
  return (
    <div className="w-full h-full">
      <Drawer
        open={showInfoPanel}
        onClose={() => {
          setShowInfoPanel(false);
        }}
        title="Edit Version Info"
      >
        <EditInfo
          info={version}
          onSave={(data: any) => {
            setVersion(data);
            handleSave('info', data);
            setShowInfoPanel(false);
          }}
          shouldResetDisplay={showInfoPanel}
        />
      </Drawer>
      <DirectedGraph
        navPanel={
          <Space
            direction="horizontal"
            size="middle"
            className="flex items-center border-2 bg-white p-2 rounded-md"
          >
            <Space direction="horizontal" size="small">
              <Icon iconUrl={workflow?.icon_url} size="small" />
              <div
                className="hover:text-violet-500 cursor-pointer"
                onClick={() => {
                  navigate(`/${orgIdString}/workflow/${workflowIdString}`);
                }}
              >
                {workflow?.title}
              </div>
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
            <SaveGraphImage>
              <Button>Download</Button>
            </SaveGraphImage>
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
          </Space>
        }
        editable
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
        onNodeChanged={(changedNodes) => {
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
          setVersion({
            ...version,
            data: newData,
          });
          if (selectedNodeId) {
            setDataHasChanged(true);
          }
        }}
        onCosmeticChanged={(changed: IWorkflowVersionCosmetic) => {
          const cosmetic = changeCosmetic(version?.data.cosmetic, changed);
          setVersion({
            ...version,
            data: { ...version.data, cosmetic },
          });
        }}
        onLayoutClick={(selectedLayoutId) => {
          setSelectedLayoutId(selectedLayoutId);
        }}
        onNodeClick={(event, node) => {
          setSelectedNodeId(node.id);
        }}
        onPaneClick={() => {
          setSelectedNodeId('');
        }}
        onResetPosition={() => {
          const newData = structuredClone(version?.data);
          newData.checkpoints.forEach((v: any, index: number) => {
            delete newData.checkpoints[index].position;
          });
          setVersion({
            ...version,
            data: newData,
          });
          setDataHasChanged(true);
        }}
        onAddNewNode={() => {
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
        }}
        onViewPortChange={(viewport) => {
          setCenterPos({
            x: (-viewport.x + 600) / viewport.zoom,
            y: (-viewport.y + 250) / viewport.zoom,
          });
        }}
      />
    </div>
  );
};
