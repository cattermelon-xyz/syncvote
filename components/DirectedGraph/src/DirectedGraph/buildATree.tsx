import { MarkerType, Position } from 'reactflow';
import SelfConnectingEdge from './CustomEdges/SelfConnectingEdge';
import MultipleDiretionNode from './CustomNodes/MultipleDiretionNode';
import { emptyStage } from './empty';
import { getVoteMachine } from './voteMachine';
import {
  IVoteMachine,
  IWorkflowVersionData,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from './interface';
import BezierCustomEdge from './CustomEdges/BezierCustomEdge';
import SmoothCustomEdge from './CustomEdges/SmoothCustomEdge';

const widths = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875,
  0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125,
  0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875,
  0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
  0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625,
  0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625,
  0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625,
  0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625,
  0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625,
  0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875,
  0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875,
  0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5,
  0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375,
  0.353125, 0.5890625,
]; //eslint-disable-line
const avg = 0.5279276315789471;

function measureText(str: string, fontSize: number) {
  return (
    Array.from(str).reduce(
      (acc, cur) => acc + (widths[cur.charCodeAt(0)] ?? avg),
      0
    ) * fontSize
  );
}

function getCenterPos({ node, label = '' }: { node: any; label?: string }) {
  // root font size is 16px; 1 rem = 16px
  // p-2: 0.5 rem; line-height: 1.5 rem = 24px
  return {
    x: (measureText(label, 16) + 16) / 2 + node.position.x,
    y: (24 + 16) / 2 + node.position.y,
  };
}

function calcAngle(cx: number, cy: number, ex: number, ey: number) {
  const dy: number = ey - cy;
  const dx: number = ex - cx;
  let theta: number = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

const SELECTED_COLOR = '#5D23BB';

const SELECTED_NODE_STYLE = {
  backgroundColor: SELECTED_COLOR,
};

const SELECTED_EDGE_STYLE = {
  stroke: SELECTED_COLOR,
  strokeWidth: 2,
};

const buildEdge = ({
  selectedEdgeId,
  source,
  target,
  label,
  style = {},
  labelStyle = {},
  animated = false,
}: {
  selectedEdgeId: string | undefined;
  source: any;
  target: any;
  label: JSX.Element;
  style?: any;
  labelStyle?: any;
  animated: boolean;
}) => {
  const sourcePos = getCenterPos({
    node: source,
    label: source.label ? source.label : source.id,
  });
  const targetPos = getCenterPos({
    node: target,
    label: target.label ? target.label : target.id,
  });
  const angle = calcAngle(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
  let type = 'default';
  let sourceHandle = '';
  let targetHandle = '';
  // let edgeType = '';
  if (angle <= 45 || angle >= 315) {
    // edgeType = 'right->left';
    sourceHandle = `s-${Position.Right}`;
    targetHandle = `t-${Position.Left}`;
    // type = BezierCustomEdge.getTypeName();
    type = SmoothCustomEdge.getTypeName();
  } else if (angle > 45 && angle <= 135) {
    // edgeType = 'bottom->top';
    sourceHandle = `s-${Position.Bottom}`;
    targetHandle = `t-${Position.Top}`;
    // type = BezierCustomEdge.getTypeName();
    type = SmoothCustomEdge.getTypeName();
  } else if (angle > 135 && angle <= 225) {
    // edgeType = 'top->top';
    sourceHandle = `s-${Position.Top}`;
    targetHandle = `t-${Position.Top}`;
    type = SelfConnectingEdge.getTypeName();
  } else {
    // edgeType = 'top->bottom';
    sourceHandle = `s-${Position.Top}`;
    targetHandle = `t-${Position.Bottom}`;
    // type = BezierCustomEdge.getTypeName();
    type = SmoothCustomEdge.getTypeName();
  }
  // console.log(`${source.id}->${target.id}`, sourceHandle, targetHandle,'; angle: ',angle);
  return {
    id: `${source.id}-${target.id}`,
    source: source.id,
    target: target.id,
    label,
    sourceHandle,
    targetHandle,
    style,
    type,
    animated: selectedEdgeId === `${source.id}-${target.id}` ? true : animated,
    markerEnd: {
      type: MarkerType.Arrow,
      color: style.stroke || '#000',
    },
    labelStyle,
    data: source.data.raw,
  };
};

const findSubWorkflowId = (data: any, id: string) => {
  const subWorkflows = data?.subWorkflows ? data?.subWorkflows : [];
  let wfId = undefined;
  let isStart = false;
  for (var i = 0; i < data?.checkpoints?.length; i++) {
    if (data?.checkpoints[i].id === id) {
      wfId = '';
      if (data?.start === id) {
        isStart = true;
      }
      break;
    }
  }
  if (wfId === undefined) {
    for (var i = 0; i < subWorkflows.length; i++) {
      for (var j = 0; j < subWorkflows[i].checkpoints.length; j++) {
        if (subWorkflows[i].checkpoints[j].id === id) {
          wfId = subWorkflows[i].refId;
          if (subWorkflows[i].start === id) {
            isStart = true;
          }
          break;
        }
      }
    }
  }
  return { subWorkflowId: wfId, isStart };
};

export const buildATree = ({
  data,
  selectedNodeId,
  selectedLayoutId,
  selectedEdgeId,
}: {
  data: IWorkflowVersionData;
  selectedNodeId: string | undefined;
  selectedLayoutId: string | undefined;
  selectedEdgeId: string | undefined;
}) => {
  const checkpoints: Array<any> = [];
  let newData = structuredClone(data);
  const cosmetic = newData.cosmetic;
  const layouts: IWorkflowVersionLayout[] = cosmetic?.layouts || [];
  const defaultLayout = cosmetic?.defaultLayout;
  const layout = layouts.find((l) => l.id === selectedLayoutId);
  // TODO: render based on layout
  if (data.checkpoints === undefined || data.checkpoints.length === 0) {
    newData = emptyStage;
  }
  const forkNodes: any[] = [];
  newData.checkpoints.forEach((checkpoint: any) => {
    checkpoints.push(
      structuredClone({
        ...checkpoint,
        edgeConstructed: false,
      })
    );
    if (checkpoint.vote_machine_type === 'forkNode') {
      forkNodes.push(checkpoint);
    }
  });
  if (newData.subWorkflows) {
    newData.subWorkflows.map((subWorkflow: any) => {
      const fk = forkNodes.find((nd: any) =>
        nd.data?.start?.includes(subWorkflow.refId)
      );
      const connectToJoinNode = fk?.data?.end?.includes(subWorkflow.refId);
      const joinNodeId = fk?.data?.joinNode;
      subWorkflow.checkpoints.forEach((checkpoint: any) => {
        const children = checkpoint.children ? [...checkpoint.children] : [];
        if (connectToJoinNode && joinNodeId && checkpoint.isEnd) {
          children.push(joinNodeId);
        }
        checkpoints.push({
          ...checkpoint,
          children,
          edgeConstructed: false,
          subWorkflowId: subWorkflow.refId,
        });
      });
    });
  }
  const startNodeId = newData.start;
  // each node is 300px away from other horizontally
  // each node is 100px away from other vertically
  const nodes: any[] = [];
  const edges: any[] = [];
  const depth: {
    [key: number]: number;
  } = {};
  const iterNode = (node: any, x: number, y: number) => {
    if (node.x === undefined) {
      node.x = x; // eslint-disable-line no-param-reassign
      node.y = y; // eslint-disable-line no-param-reassign
      if (!node.children || node.children.length === 0) {
        return;
      }
      node.children?.forEach((childId: any) => {
        const child = checkpoints.find((_node) => _node.id === childId);
        depth[node.x + 1] =
          depth[node.x + 1] === undefined ? 1 : depth[node.x + 1] + 1;
        iterNode(child, node.x + 1, depth[node.x + 1]);
      });
    }
  };
  const iterEdge = (node: any) => {
    const buildLabel = ({
      voteMachine,
      source,
      target,
    }: {
      voteMachine: string;
      source: any;
      target: any;
    }) => {
      if (voteMachine === undefined) {
        return <span>End</span>;
      }
      const vm: any = getVoteMachine(voteMachine);
      return vm.getLabel({ source, target });
    };

    if (!node.edgeConstructed && node.children && node.children.length > 0) {
      node.edgeConstructed = true; // eslint-disable-line no-param-reassign
      const sourceId = node.id;
      node.children.forEach((childId: string) => {
        const child = checkpoints.find((_node) => _node.id === childId);
        const edgeFromLayout: any = layout?.edges?.find(
          (n: any) => n.id === sourceId + '-' + childId
        );
        let edgeStyle = { ...edgeFromLayout?.style };
        let edgeLableStyle = { ...edgeFromLayout?.labelStyle };
        let animated = false;
        if (selectedNodeId && sourceId === selectedNodeId) {
          edgeStyle = SELECTED_EDGE_STYLE;
          animated = true;
        } else if (node.edgeStyle) {
          edgeStyle = node.edgeStyle;
        }
        const newEdge = buildEdge({
          selectedEdgeId,
          source: nodes.find((_node) => _node.id === sourceId),
          target: nodes.find((_node) => _node.id === childId),
          label: buildLabel({
            voteMachine: node.vote_machine_type,
            source: node,
            target: child,
          }),
          style: edgeStyle,
          labelStyle: edgeLableStyle,
          animated,
        });
        // return the newEdge
        edges.push(newEdge);
        iterEdge(child);
      });
    }
  };
  const startNode = checkpoints.find((node) => node.id === startNodeId);
  if (startNode?.id && startNodeId) {
    iterNode(startNode, 1, 1);
    checkpoints.forEach((checkpoint) => {
      let nodeStyle = {};
      if (selectedNodeId && checkpoint.id === selectedNodeId) {
        nodeStyle = SELECTED_NODE_STYLE;
      } else if (checkpoint.style) {
        nodeStyle = checkpoint.style;
      }
      const checkpointFromLayout: any = layout?.nodes?.find(
        (n: any) => n.id === checkpoint.id
      );
      const position = checkpointFromLayout?.position || checkpoint.position;
      const style = { ...nodeStyle, ...checkpointFromLayout?.style };
      const vm = getVoteMachine(checkpoint.vote_machine_type);
      const vmIcon = vm?.getIcon();
      let label = checkpoint.title ? checkpoint.title : checkpoint.id;
      label = label.length > 30 ? label.substr(0, 30) + '...' : label;
      if (vmIcon) {
        label = (
          <div className='flex gap-1 items-center'>
            {vmIcon}
            {label}
          </div>
        );
      }
      const { subWorkflowId, isStart } = findSubWorkflowId(
        newData,
        checkpoint.id
      );
      nodes.push({
        id: checkpoint.id,
        data: {
          label: label,
          style,
          isEnd: checkpoint.isEnd,
          raw: checkpoint,
          triggers: checkpoint.triggers,
          selected: checkpoint.id === selectedNodeId,
          abstract: vm?.abstract({
            checkpoint,
            data: checkpoint.data,
            graphData: data,
          }),
          subWorkflowId,
          isStart,
        },
        x: checkpoint.x,
        y: checkpoint.y,
        draggable: true,
        type: MultipleDiretionNode.getTypeName(),
        position: { ...position },
      });
    });
    nodes.forEach((node) => {
      node.position = node.position
        ? node.position
        : {
            // eslint-disable-line no-param-reassign
            x: node.x ? node.x * 300 : 0,
            y: node.y ? node.y * 100 : 0,
          };
    });
    checkpoints.forEach((node) => {
      if (!node.edgeConstructed) {
        iterEdge(node);
      }
    });
  }
  return { nodes, edges };
};
