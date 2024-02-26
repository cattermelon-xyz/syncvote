import { Modal } from 'antd';
import { defaultLayout, emptyCosmetic, emptyStage } from 'directed-graph';
export const extractVersion = ({
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

export const extractWorkflowFromList = (
  wfList: any,
  workflowId: any,
  versionId: any,
  setVersion: any,
  setSelectedLayoutId: any,
  setDataHasChanged: any,
  setWorkflow: any
) => {
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

export const deleteNode = (
  id: any,
  version: any,
  getVoteMachine: any,
  setVersion: any,
  selectedNodeId: any,
  setDataHasChanged: any,
  setSelectedNodeId: any
) => {
  // TODO: move this function into DirectedGraph
  // TODO: delete triggers
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
        if (_node.triggers) {
          _node.triggers = _node.triggers.filter(
            (t: any) => t.triggerAt !== id
          );
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

export const saveNodePosition = (
  version: any,
  changedNodes: any,
  selectedLayoutId: any,
  setVersion: any
) => {
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
  return newData;
};

export const save = async (
  changedData: any,
  version: any,
  upsertWorkflowVersion: any,
  dispatch: any,
  versionId: any,
  workflow: any,
  setLastSaved: any,
  mode: any,
  hideLoading: any
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
    onError: (error: any) => {
      Modal.error({
        title: 'Error',
        content: error.message,
      });
    },
    mode,
    hideLoading,
  });
};

export const newNode = (
  version: any,
  setVersion: any,
  setDataHasChanged: any,
  centerPos: any,
  gridX: any,
  gridY: any,
  setGridX: any,
  setGridY: any,
  setSelectedNodeId: any,
  selectedNodeId: any,
  posX?: any,
  posY?: any,
  type?: any,
  initData?: any,
  name?: any
) => {
  const newData = structuredClone(version?.data);
  const newId = `node-${new Date().getTime()}`;
  const nodeSpacing = 130;

  let newPos = {
    x: posX ? posX : centerPos.x + gridX * nodeSpacing,
    y: posY ? posY : centerPos.y + gridY * nodeSpacing,
  };
  let newChkpData = {};
  try {
    newChkpData = JSON.parse(initData);
  } catch (e) {
    newChkpData = initData;
  }

  const chkpData =
    type === 'endNode'
      ? {
          isEnd: true,
        }
      : {
          vote_machine_type: type,
          data: newChkpData,
        };
  const titlePrefix = type === 'endNode' ? `End Node ` : name + ` `;
  newData.checkpoints.push({
    title: titlePrefix + version?.data?.checkpoints?.length,
    id: newId,
    position: newPos,
    ...chkpData,
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
