import {
  ICheckPoint,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from 'directed-graph';
import { generateId } from '@utils/helpers';

export const changeVersion = ({
  versionData,
  selectedNodeId,
  changedCheckPointData,
}: {
  versionData: any;
  selectedNodeId: string;
  changedCheckPointData: ICheckPoint;
}) => {
  // TODO: refactor this function, do not be crazy about pointer.
  // You can use varible to keep pointer and make change to it
  console.log('changeversion invoked ', changedCheckPointData);
  const newData = structuredClone(versionData);
  let subWorkflowId = changedCheckPointData.subWorkflowId;
  let subWorkflowIndex = -1;
  let indexAtRoot = newData.checkpoints.findIndex(
    (item: any) => item.id === selectedNodeId
  );
  let indexAtSubWorkflow = -1;
  // if subWorkflowId is undefined, then find it
  if (subWorkflowId === undefined) {
    newData.subWorkflows?.map((workflow: any, i: number) => {
      for (var j = 0; j < workflow.checkpoints.length; j++) {
        if (workflow.checkpoints[j].id === selectedNodeId) {
          subWorkflowId = workflow.refId;
          subWorkflowIndex = i;
          indexAtSubWorkflow = j;
          break;
        }
      }
    });
  }
  if (indexAtRoot !== -1) {
    // if there is a workflow at root
    if (subWorkflowId !== undefined) {
      for (var i = 0; i < newData.subWorkflows.length; i++) {
        subWorkflowIndex = i;
        let s = newData.subWorkflows[i];
        if (s.refId === subWorkflowId) {
          const c = { ...newData.checkpoints[indexAtRoot] };
          s.checkpoints.push(c);
          console.log('newly pushed: ', c);
          indexAtSubWorkflow = s.checkpoints.length - 1;
          console.log('splice: ', indexAtRoot);
          newData.checkpoints.splice(indexAtRoot, 1);
          break;
        }
      }
    }
  } else {
    // else if there is a workflow at a different subWorkflowId
    let cSubWorkflow: any = null;
    let cSubWorkflowId = null;
    let chkp: any = null;
    newData.subWorkflows?.map((workflow: any) => {
      for (var i = 0; i < workflow.checkpoints.length; i++) {
        if (workflow.checkpoints[i].id === selectedNodeId) {
          chkp = workflow.checkpoints[i];
          indexAtSubWorkflow = i;
          break;
        }
      }
      if (chkp) {
        cSubWorkflow = workflow;
        cSubWorkflowId = workflow.id;
        subWorkflowIndex = i;
      }
    });
    if (cSubWorkflowId !== subWorkflowId) {
      // move to new subWorkflow
      newData.subWorkflows.map((s: any, index: number) => {
        if (s.refId === subWorkflowId) {
          s.checkpoints.push(chkp);
          subWorkflowIndex = index;
          cSubWorkflow.checkpoints.splice(indexAtSubWorkflow, 1);
          indexAtSubWorkflow = s.checkpoints.length - 1;
        }
      });
    } else if (cSubWorkflowId === subWorkflowId) {
      // same subWorkflow, then do nothing
    }
  }

  const index = indexAtSubWorkflow !== -1 ? indexAtSubWorkflow : indexAtRoot;
  console.log(
    'index: ',
    index,
    '; indexAtSubWorkflow: ',
    indexAtSubWorkflow,
    '; indexAtRoot: ',
    indexAtRoot,
    'subWorkflowId: ',
    subWorkflowId,
    '; subWorkflowIndex: ',
    subWorkflowIndex
  );
  if (changedCheckPointData.data) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].data = {
        ...changedCheckPointData.data,
      };
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].data = {
        ...changedCheckPointData.data,
      };
    }
  }
  if (changedCheckPointData.children) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].children = changedCheckPointData.children;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].children =
        changedCheckPointData.children;
    }
  }
  // TODO: error here
  if (changedCheckPointData.hasOwnProperty('title')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].title = changedCheckPointData.title;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].title =
        changedCheckPointData.title;
    }
  }
  if (changedCheckPointData.hasOwnProperty('description')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].description =
        changedCheckPointData.description;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].description =
        changedCheckPointData.description;
    }
  }
  if (changedCheckPointData.hasOwnProperty('note')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].note = changedCheckPointData.note;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].note =
        changedCheckPointData.note;
    }
  }
  if (changedCheckPointData.votingLocation) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].votingLocation =
        changedCheckPointData.votingLocation;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].votingLocation =
        changedCheckPointData.votingLocation;
    }
  }
  if (changedCheckPointData.locked) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].locked = changedCheckPointData.locked;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].locked =
        changedCheckPointData.locked;
    }
  }
  if (changedCheckPointData.triggers) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].triggers = changedCheckPointData.triggers;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].triggers =
        changedCheckPointData.triggers;
    }
  }
  if (changedCheckPointData.hasOwnProperty('duration')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].duration = changedCheckPointData.duration;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].duration =
        changedCheckPointData.duration;
    }
  }
  if (changedCheckPointData.isEnd === true) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].children = [];
      delete newData.checkpoints[index].vote_machine_type;
      delete newData.checkpoints[index].data;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].children = [];
      delete newData.subWorkflows[subWorkflowIndex].checkpoints[index]
        .vote_machine_type;
      delete newData.subWorkflows[subWorkflowIndex].checkpoints[index].data;
    }
  }
  if (changedCheckPointData.vote_machine_type) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].vote_machine_type =
        changedCheckPointData.vote_machine_type;
      newData.checkpoints[index].data = changedCheckPointData.data;
      delete newData.checkpoints[index].isEnd;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].vote_machine_type = changedCheckPointData.vote_machine_type;
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].data =
        changedCheckPointData.data;
      delete newData.subWorkflows[subWorkflowIndex].checkpoints[index].data
        .isEnd;
    }
  }
  if (changedCheckPointData.participation) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].participation =
        changedCheckPointData.participation;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].participation =
        changedCheckPointData.participation;
    }
  }
  if (changedCheckPointData.hasOwnProperty('participationDescription')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].participationDescription =
        changedCheckPointData.participationDescription;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].participationDescription =
        changedCheckPointData.participationDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('quorum')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].quorum = changedCheckPointData.quorum;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].quorum =
        changedCheckPointData.quorum;
    }
  }
  if (changedCheckPointData.delays) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].delays = changedCheckPointData.delays;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].delays =
        changedCheckPointData.delays;
    }
  }
  if (changedCheckPointData.delayUnits) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].delayUnits = changedCheckPointData.delayUnits;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].delayUnits =
        changedCheckPointData.delayUnits;
    }
  }
  if (changedCheckPointData.delayNotes) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].delayNotes = changedCheckPointData.delayNotes;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[index].delayNotes =
        changedCheckPointData.delayNotes;
    }
  }
  if (changedCheckPointData.hasOwnProperty('includedAbstain')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].includedAbstain =
        changedCheckPointData.includedAbstain;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].includedAbstain = changedCheckPointData.includedAbstain;
    }
  }
  if (changedCheckPointData.hasOwnProperty('resultDescription')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].resultDescription =
        changedCheckPointData.resultDescription;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].resultDescription = changedCheckPointData.resultDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('optionsDescription')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].optionsDescription =
        changedCheckPointData.optionsDescription;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].optionsDescription = changedCheckPointData.optionsDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('durationDescription')) {
    if (subWorkflowId === undefined || subWorkflowIndex === -1) {
      newData.checkpoints[index].durationDescription =
        changedCheckPointData.durationDescription;
    } else {
      newData.subWorkflows[subWorkflowIndex].checkpoints[
        index
      ].durationDescription = changedCheckPointData.durationDescription;
    }
  }
  return newData;
};

export const changeCosmetic = (
  original: IWorkflowVersionCosmetic,
  changed: IWorkflowVersionCosmetic
) => {
  const { defaultLayout, layouts } = changed;
  const result = original
    ? { ...original }
    : {
        defaultLayout: undefined,
        layouts: [],
      };
  if (defaultLayout) {
    const { horizontal, vertical } = defaultLayout;
    if (!result.defaultLayout) {
      result.defaultLayout = { ...defaultLayout };
    } else {
      result.defaultLayout = {
        horizontal: horizontal || result.defaultLayout.horizontal,
        vertical: vertical || result.defaultLayout.vertical,
      };
    }
  }
  if (layouts) {
    if (!result.layouts) {
      result.layouts = [];
      layouts.forEach((layout) => {
        if (!layout.id) {
          result.layouts.push({ ...layout, id: generateId(4) });
        }
      });
    } else {
      layouts.forEach((layout) => {
        const index = result.layouts.findIndex((item) => item.id === layout.id);
        if (index === -1) {
          result.layouts.push({ ...layout, id: generateId(4) });
        } else {
          result.layouts[index] = { ...layout };
        }
      });
    }
  }
  return { ...result };
};

export const changeLayout = (
  original: IWorkflowVersionLayout,
  changed: IWorkflowVersionLayout
) => {
  const { nodes, edges, markers } = changed;
  const {
    nodes: originalNodes,
    edges: originalEdges,
    markers: originalMarkers,
  } = original;
  const result = structuredClone(original);
  if (original.id === changed.id) {
    if (!originalNodes || result.nodes === undefined) {
      result.nodes = [];
    }
    if (!originalEdges || result.edges === undefined) {
      result.edges = [];
    }
    if (!originalMarkers || result.markers === undefined) {
      result.markers = [];
    }
    if (nodes && nodes.length > 0) {
      nodes.forEach((node) => {
        if (!originalNodes) {
          result.nodes?.push(node);
        } else {
          const index = result.nodes?.findIndex(
            (orginalNode: any) => orginalNode.id === node.id
          );
          if (index === -1) {
            result.nodes?.push(node);
          } else if (index !== undefined) {
            result.nodes
              ? (result.nodes[index] = {
                  ...result.nodes[index],
                  ...node,
                })
              : null;
          }
        }
      });
    }
    if (edges && edges.length > 0) {
      edges.forEach((edge) => {
        if (originalEdges === undefined || originalEdges.length === 0) {
          result.edges?.push(edge);
        } else {
          const index = result.edges?.findIndex(
            (orginalEdge: any) => orginalEdge.id === edge.id
          );
          if (index === -1) {
            result.edges?.push(edge);
          } else if (index !== undefined) {
            result.edges
              ? (result.edges[index] = {
                  ...result.edges[index],
                  ...edge,
                })
              : null;
          }
        }
      });
    }
    if (markers && markers.length > 0) {
      result.markers = [...markers];
    }
    return result;
  }
};
