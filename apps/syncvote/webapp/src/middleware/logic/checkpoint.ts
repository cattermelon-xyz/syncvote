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
  const newData = structuredClone(versionData);
  let subWorkflowId: any = changedCheckPointData.subWorkflowId
    ? changedCheckPointData.subWorkflowId
    : undefined;
  let indexOfSubWorkflow = -1;
  let indexAtRoot = newData.checkpoints.findIndex(
    (item: any) => item.id === selectedNodeId
  );
  let indexOfChkPAtSubWorkflow = -1;
  // if subWorkflowId is undefined, then find it
  if (indexAtRoot !== -1) {
    // if there is a workflow at root
    if (subWorkflowId !== undefined) {
      for (var i = 0; i < newData.subWorkflows.length; i++) {
        indexOfSubWorkflow = i;
        let s = newData.subWorkflows[i];
        if (s.refId === subWorkflowId) {
          const c = { ...newData.checkpoints[indexAtRoot] };
          s.checkpoints.push(c);
          indexOfChkPAtSubWorkflow = s.checkpoints.length - 1;
          newData.checkpoints.splice(indexAtRoot, 1);
          break;
        }
      }
    }
  } else {
    let cSubWorkflow: any = null;
    let cSubWorkflowId = null;
    let chkp: any = null;
    for (var j = 0; j < newData.subWorkflows.length; j++) {
      const workflow = newData.subWorkflows[j];
      for (var i = 0; i < workflow.checkpoints.length; i++) {
        if (workflow.checkpoints[i].id === selectedNodeId) {
          chkp = { ...workflow.checkpoints[i] };
          indexOfChkPAtSubWorkflow = i;
          break;
        }
      }
      if (chkp) {
        cSubWorkflow = workflow;
        cSubWorkflowId = workflow.refId;
        indexOfSubWorkflow = j;
        break;
      }
    }
    console.log(cSubWorkflowId, indexOfSubWorkflow, indexOfChkPAtSubWorkflow);
    if (subWorkflowId === undefined) {
      subWorkflowId = cSubWorkflowId;
    } else if (cSubWorkflowId !== subWorkflowId) {
      // else if there is a workflow at a different subWorkflowId
      // move to new subWorkflow
      newData.subWorkflows.map((s: any, index: number) => {
        if (s.refId === subWorkflowId) {
          s.checkpoints.push(chkp);
          indexOfSubWorkflow = index;
          cSubWorkflow.checkpoints.splice(indexOfChkPAtSubWorkflow, 1);
          indexOfChkPAtSubWorkflow = s.checkpoints.length - 1;
        }
      });
    } else if (cSubWorkflowId === subWorkflowId) {
    }
  }

  const index =
    indexOfChkPAtSubWorkflow !== -1 ? indexOfChkPAtSubWorkflow : indexAtRoot;
  if (changedCheckPointData.data) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].data = {
        ...changedCheckPointData.data,
      };
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].data = {
        ...changedCheckPointData.data,
      };
    }
  }
  if (changedCheckPointData.children) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].children = changedCheckPointData.children;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].children =
        changedCheckPointData.children;
    }
  }
  // TODO: error here
  if (changedCheckPointData.hasOwnProperty('title')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].title = changedCheckPointData.title;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].title =
        changedCheckPointData.title;
    }
  }
  if (changedCheckPointData.hasOwnProperty('description')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].description =
        changedCheckPointData.description;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].description =
        changedCheckPointData.description;
    }
  }
  if (changedCheckPointData.hasOwnProperty('note')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].note = changedCheckPointData.note;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].note =
        changedCheckPointData.note;
    }
  }
  if (changedCheckPointData.votingLocation) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].votingLocation =
        changedCheckPointData.votingLocation;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].votingLocation = changedCheckPointData.votingLocation;
    }
  }
  if (changedCheckPointData.locked) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].locked = changedCheckPointData.locked;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].locked =
        changedCheckPointData.locked;
    }
  }
  if (changedCheckPointData.triggers) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].triggers = changedCheckPointData.triggers;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].triggers =
        changedCheckPointData.triggers;
    }
  }
  if (changedCheckPointData.hasOwnProperty('duration')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].duration = changedCheckPointData.duration;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].duration =
        changedCheckPointData.duration;
    }
  }
  if (changedCheckPointData.isEnd === true) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].children = [];
      delete newData.checkpoints[index].vote_machine_type;
      delete newData.checkpoints[index].data;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].children = [];
      delete newData.subWorkflows[indexOfSubWorkflow].checkpoints[index]
        .vote_machine_type;
      delete newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].data;
    }
  }
  if (changedCheckPointData.vote_machine_type) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].vote_machine_type =
        changedCheckPointData.vote_machine_type;
      newData.checkpoints[index].data = changedCheckPointData.data;
      delete newData.checkpoints[index].isEnd;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].vote_machine_type = changedCheckPointData.vote_machine_type;
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].data =
        changedCheckPointData.data;
      delete newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].data
        .isEnd;
    }
  }
  if (changedCheckPointData.participation) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].participation =
        changedCheckPointData.participation;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].participation = changedCheckPointData.participation;
    }
  }
  if (changedCheckPointData.hasOwnProperty('participationDescription')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].participationDescription =
        changedCheckPointData.participationDescription;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].participationDescription =
        changedCheckPointData.participationDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('quorum')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].quorum = changedCheckPointData.quorum;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].quorum =
        changedCheckPointData.quorum;
    }
  }
  if (changedCheckPointData.delays) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].delays = changedCheckPointData.delays;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].delays =
        changedCheckPointData.delays;
    }
  }
  if (changedCheckPointData.delayUnits) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].delayUnits = changedCheckPointData.delayUnits;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].delayUnits =
        changedCheckPointData.delayUnits;
    }
  }
  if (changedCheckPointData.delayNotes) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].delayNotes = changedCheckPointData.delayNotes;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].delayNotes =
        changedCheckPointData.delayNotes;
    }
  }
  if (changedCheckPointData.hasOwnProperty('includedAbstain')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].includedAbstain =
        changedCheckPointData.includedAbstain;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].includedAbstain = changedCheckPointData.includedAbstain;
    }
  }
  if (changedCheckPointData.hasOwnProperty('resultDescription')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].resultDescription =
        changedCheckPointData.resultDescription;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].resultDescription = changedCheckPointData.resultDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('optionsDescription')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].optionsDescription =
        changedCheckPointData.optionsDescription;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].optionsDescription = changedCheckPointData.optionsDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('durationDescription')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].durationDescription =
        changedCheckPointData.durationDescription;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[
        index
      ].durationDescription = changedCheckPointData.durationDescription;
    }
  }
  if (changedCheckPointData.hasOwnProperty('inHappyPath')) {
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].inHappyPath =
        changedCheckPointData.inHappyPath;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].inHappyPath =
        changedCheckPointData.inHappyPath;
    }
  }
  if (changedCheckPointData.hasOwnProperty('phase')) {
    console.log('phase', changedCheckPointData.phase);
    if (subWorkflowId === undefined || indexOfSubWorkflow === -1) {
      newData.checkpoints[index].phase = changedCheckPointData.phase;
    } else {
      newData.subWorkflows[indexOfSubWorkflow].checkpoints[index].phase =
        changedCheckPointData.phase;
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
