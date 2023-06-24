import { BranchesOutlined, SaveOutlined } from '@ant-design/icons';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import {
  DirectedGraph, emptyStage, getVoteMachine, renderVoteMachineConfigPanel,
} from '@components/DirectedGraph';
import Icon from '@components/Icon/Icon';
import { queryWeb2Integration, queryWorkflow, upsertWorkflowVersion } from '@middleware/data';
import { changeVersion } from '@middleware/logic';
import { extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import {
  Button, Drawer, Modal, Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditInfo from './fragment/EditInfo';

const extractVersion = ({
  workflows, workflowId, versionId,
}:{
  workflows: any,
  workflowId: number,
  versionId: number,
}) => {
  const wf = workflows.find((workflow:any) => workflow.id === workflowId);
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

  const { web2Integrations } = useSelector((state:any) => state.integration);
  const { workflows, lastFetch } = useSelector((state:any) => state.workflow);
  const [version, setVersion] = useState<any>(
    extractVersion({
      workflows, workflowId, versionId,
    }));
  const [web2IntegrationsState, setWeb2IntegrationsState] = useState(web2Integrations);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [workflow, setWorkflow] = useState<any>(workflows.find((w:any) => w.id === workflowId));
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const extractWorkflowFromList = (wfList:any) => {
    setVersion(extractVersion({
      workflows: wfList, workflowId, versionId,
    }));
    setDataHasChanged(false);
    setWorkflow(wfList.find((w:any) => w.id === workflowId));
  };
  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
      queryWeb2Integration({
        orgId,
        dispatch,
        onLoad: (data:any) => {
          setWeb2IntegrationsState(data);
        },
      });
      queryWorkflow({
        orgId,
        dispatch,
        onLoad: (wfList:any) => {
          extractWorkflowFromList(wfList);
        },
      });
    }
  }, [workflows, web2Integrations, lastFetch]);
  const handleSave = async (mode: 'data' | 'info' | undefined, changedData?: any | undefined) => {
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
          onLoad: (_data:any) => {
            extractWorkflowFromList(_data);
          },
          dispatch,
        });
        Modal.success({
          maskClosable: true,
          content: 'Data saved successfully',
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
  return (
    <div className="w-full h-full">
      <Drawer
        open={showInfoPanel}
        onClose={() => { setShowInfoPanel(false); }}
        title="Edit Version Info"
      >
        <EditInfo
          info={version}
          onSave={(data:any) => {
            setVersion(data);
            handleSave('info', data);
            setShowInfoPanel(false);
          }}
          shouldResetDisplay={showInfoPanel}
        />
      </Drawer>
      {renderVoteMachineConfigPanel({
        editable: true,
        web2Integrations: web2IntegrationsState,
        versionData: version?.data || emptyStage,
        selectedNodeId,
        onChange: (changedData:any) => {
          const newData = changeVersion({
            versionData: version?.data || emptyStage,
            selectedNodeId,
            changedCheckPointData: changedData,
          });
          setVersion({
            ...version, data: newData,
          });
          if (selectedNodeId) {
            setDataHasChanged(true);
          }
        },
        onDelete: (id) => {
          if (id === version?.data.start) {
            Modal.error({
              title: 'Error',
              content: 'Cannot delete start node',
            });
          } else {
            const newData = structuredClone(version?.data);
            const index = newData.checkpoints.findIndex((v:any) => v.id === id);
            newData.checkpoints?.forEach((_node:any, cindex: number) => {
              if (_node.children?.includes(id)) {
                const newChkpData = getVoteMachine(_node.vote_machine_type)
                ?.deleteChildNode(
                  _node.data, _node.children, id,
                ) || _node.data;
                newData.checkpoints[cindex].data = newChkpData;
                if (_node.children) {
                  _node.children.splice(_node.children.indexOf(id));
                }
              }
            });
            newData.checkpoints.splice(index, 1);
            setVersion({
              ...version, data: newData,
            });
            if (selectedNodeId) {
              setDataHasChanged(true);
            }
            setSelectedNodeId('');
          }
        },
        onClose: () => { setSelectedNodeId(''); },
      },
      )}
      <DirectedGraph
        navPanel={(
          <Space direction="horizontal" size="middle" className="flex items-center border-2 bg-white p-2 rounded-md">
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
              <div className="font-bold">
                {version?.version}
              </div>
              <span onClick={() => setShowInfoPanel(true)} className="cursor-pointer">
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
          </Space>
        )}
        editable
        data={version?.data || emptyStage}
        selectedNodeId={selectedNodeId}
        onNodeChanged={(changedNodes) => {
          const newData = structuredClone(version?.data);
          newData?.checkpoints?.forEach((v:any, index:number) => {
            const changedNode = changedNodes.find((cN:any) => cN.id === v.id);
            if (changedNode && changedNode.position) {
              newData.checkpoints[index].position = changedNode.position;
            }
          });
          setVersion({
            ...version, data: newData,
          });
          if (selectedNodeId) {
            setDataHasChanged(true);
          }
        }}
        onNodeClick={(event, node) => {
          setSelectedNodeId(node.id);
        }}
        onPaneClick={() => {
          setSelectedNodeId('');
        }}
        onResetPosition={() => {
          const newData = structuredClone(version?.data);
          newData.checkpoints.forEach((v:any, index:number) => {
            delete newData.checkpoints[index].position;
          });
          setVersion({
            ...version, data: newData,
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
            ...version, data: newData,
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
