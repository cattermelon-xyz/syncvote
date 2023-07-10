import {
  ICheckPoint,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from '@types';
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
  const newData = structuredClone(versionData);
  const index = newData.checkpoints.findIndex(
    (item: any) => item.id === selectedNodeId
  );
  if (changedCheckPointData.data) {
    newData.checkpoints[index].data = {
      ...changedCheckPointData.data,
    };
  }
  if (changedCheckPointData.children) {
    newData.checkpoints[index].children = changedCheckPointData.children;
  }
  if (changedCheckPointData.title) {
    newData.checkpoints[index].title = changedCheckPointData.title;
  }
  if (changedCheckPointData.description) {
    newData.checkpoints[index].description = changedCheckPointData.description;
  }
  if (changedCheckPointData.votingLocation) {
    newData.checkpoints[index].votingLocation =
      changedCheckPointData.votingLocation;
  }
  if (changedCheckPointData.locked) {
    newData.checkpoints[index].locked = changedCheckPointData.locked;
  }
  if (changedCheckPointData.triggers) {
    newData.checkpoints[index].triggers = changedCheckPointData.triggers;
  }
  if (changedCheckPointData.duration) {
    newData.checkpoints[index].duration = changedCheckPointData.duration;
  }
  newData.checkpoints[index].isEnd = changedCheckPointData.isEnd === true;
  if (changedCheckPointData.isEnd === true) {
    newData.checkpoints[index].children = [];
    delete newData.checkpoints[index].vote_machine_type;
    delete newData.checkpoints[index].data;
  }
  if (changedCheckPointData.vote_machine_type) {
    newData.checkpoints[index].vote_machine_type =
      changedCheckPointData.vote_machine_type;
    newData.checkpoints[index].data = changedCheckPointData.data;
  }
  if (changedCheckPointData.participation) {
    newData.checkpoints[index].participation =
      changedCheckPointData.participation;
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

export const validateWorkflow = ({
  checkPoint,
}: {
  checkPoint: ICheckPoint | undefined;
}) => {
  const message = [];
  let isValid = true;
  if (checkPoint?.isEnd) {
    // End checkPoint require no condition
    isValid = true;
  } else {
    if (
      checkPoint?.participation === undefined ||
      checkPoint?.participation?.data === undefined
    ) {
      isValid = false;
      message.push('Missing voting participation condition');
    }
    if (checkPoint?.vote_machine_type === undefined) {
      isValid = false;
      message.push('Missing voting machine type');
    }
    if (!checkPoint?.duration) {
      isValid = false;
      message.push('Missing duration');
    }
    if (!checkPoint?.data) {
      isValid = false;
      message.push('Vote configuration is missing');
    }
  }
  return {
    isValid,
    message,
  };
};

export const validateMission = ({
  checkPoint,
}: {
  checkPoint: ICheckPoint | undefined;
}) => {
  let message = '';
  let isValid = true;
  if (checkPoint?.isEnd) {
    // End checkPoint require no condition
    isValid = true;
  } else {
    isValid = true;
    message = 'nothing has been done';
  }
  return {
    isValid,
    message,
  };
};
