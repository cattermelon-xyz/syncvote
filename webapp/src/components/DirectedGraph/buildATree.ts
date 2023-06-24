import { MarkerType, Position } from 'reactflow';
import SelfConnectingEdge from './SelfConnectingEdge';
import MultipleDiretionNode from './MultipleDiretionNode';
import { emptyStage } from './emptyStage';
import { getVoteMachine } from './voteMachine';
import { IVoteMachine } from '../../types';
import BezierCustomEdge from './BezierCustomEdge';

const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625]; //eslint-disable-line
const avg = 0.5279276315789471;

function measureText(str:string, fontSize:number) {
  return Array.from(str).reduce(
    (acc, cur) => acc + (widths[cur.charCodeAt(0)] ?? avg), 0) * fontSize;
}

function getCenterPos({ node, label = '' }:{
  node: any,
  label?: string,
}) {
  // root font size is 16px; 1 rem = 16px
  // p-2: 0.5 rem; line-height: 1.5 rem = 24px
  return {
    x: (measureText(label, 16) + 16) / 2 + node.position.x,
    y: (24 + 16) / 2 + node.position.y,
  };
}

function calcAngle(cx:number, cy:number, ex:number, ey:number) {
  const dy:number = ey - cy;
  const dx:number = ex - cx;
  let theta:number = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

const SELECTED_COLOR = '#caf0f8';

const SELECTED_NODE_STYLE = {
  backgroundColor: SELECTED_COLOR,
};

const SELECTED_EDGE_STYLE = {
  stroke: SELECTED_COLOR,
  strokeWidth: 5,
};

const buildEdge = ({
  source, target, label, style = {},
}: {
  source: any,
  target: any,
  label: JSX.Element,
  style?: any,
}) => {
  const sourcePos = getCenterPos({ node: source, label: source.label ? source.label : source.id });
  const targetPos = getCenterPos({ node: target, label: target.label ? target.label : target.id });
  const angle = calcAngle(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
  let type = 'default';
  let sourceHandle = '';
  let targetHandle = '';
  // let edgeType = '';
  if (angle <= 45 || angle >= 315) {
    // edgeType = 'right->left';
    sourceHandle = `s-${Position.Right}`;
    targetHandle = `t-${Position.Left}`;
    type = BezierCustomEdge.getTypeName();
  } else if (angle > 45 && angle <= 135) {
    // edgeType = 'bottom->top';
    sourceHandle = `s-${Position.Bottom}`;
    targetHandle = `t-${Position.Top}`;
    type = BezierCustomEdge.getTypeName();
  } else if (angle > 135 && angle <= 225) {
    // edgeType = 'top->top';
    sourceHandle = `s-${Position.Top}`;
    targetHandle = `t-${Position.Top}`;
    type = SelfConnectingEdge.getTypeName();
  } else {
    // edgeType = 'top->bottom';
    sourceHandle = `s-${Position.Top}`;
    targetHandle = `t-${Position.Bottom}`;
    type = BezierCustomEdge.getTypeName();
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
    markerEnd: {
      type: MarkerType.Arrow,
      // TODO: how to highligh color of arrow?
    },
  };
};

export const buildATree = (data:any, selectedNodeId:string | undefined) => {
  const checkpoints: Array<any> = [];
  let newData = { ...data };
  if (data.checkpoints === undefined || data.checkpoints.length === 0) {
    newData = emptyStage;
  }
  newData.checkpoints.forEach((checkpoint:any) => {
    checkpoints.push({
      ...checkpoint, edgeConstructed: false,
    });
  });
  const startNodeId = newData.start;
  // each node is 300px away from other horizontally
  // each node is 100px away from other vertically
  const nodes: any[] = [];
  const edges: any[] = [];
  const depth:{
    [key: number]: number
  } = {};
  const iterNode = (node:any, x:number, y:number) => {
    if (node.x === undefined) {
      node.x = x; // eslint-disable-line no-param-reassign
      node.y = y; // eslint-disable-line no-param-reassign
      if (!node.children || node.children.length === 0) {
        return;
      }
      node.children?.forEach((childId:any) => {
        const child = checkpoints.find((_node) => _node.id === childId);
        depth[node.x + 1] = depth[node.x + 1] === undefined ? 1 : depth[node.x + 1] + 1;
        iterNode(child, node.x + 1, depth[node.x + 1]);
      });
    }
  };
  const iterEdge = (node:any) => {
    const buildLabel = ({
      voteMachine, source, target,
    } : {
      voteMachine: string,
      source: any,
      target: any,
    }) => {
      const vm:IVoteMachine = getVoteMachine(voteMachine);
      return vm.getLabel({ source, target });
    };

    if (!node.edgeConstructed && node.children && node.children.length > 0) {
      node.edgeConstructed = true; // eslint-disable-line no-param-reassign
      const sourceId = node.id;
      node.children.forEach((childId:string) => {
        const child = checkpoints.find((_node) => _node.id === childId);
        let edgeStyle = {};
        if (selectedNodeId && sourceId === selectedNodeId) {
          edgeStyle = SELECTED_EDGE_STYLE;
        } else if (node.edgeStyle) {
          edgeStyle = node.edgeStyle;
        }
        const newEdge = buildEdge({
          source: nodes.find((_node) => _node.id === sourceId),
          target: nodes.find((_node) => _node.id === childId),
          label: buildLabel({
            voteMachine: node.vote_machine_type,
            source: node,
            target: child,
          }),
          style: edgeStyle,
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
      nodes.push({
        id: checkpoint.id,
        data: {
          label: checkpoint.title ? checkpoint.title : checkpoint.id,
          style: nodeStyle,
          isEnd: checkpoint.isEnd,
          triggers: checkpoint.triggers,
        },
        x: checkpoint.x,
        y: checkpoint.y,
        draggable: true,
        type: MultipleDiretionNode.getTypeName(),
        position: checkpoint.position,
      });
    });
    nodes.forEach((node) => {
      node.position = node.position ? node.position : { // eslint-disable-line no-param-reassign
        x: node.x ? node.x * 300 : 0,
        y: node.y ? node.y * 100 : 0,
      };
    });
    checkpoints.forEach((node) => {
      if (!node.edgeConstructed) {
        iterEdge(node);
      }
    });
    // console.log('buildATree ** edges: ',edges,'; nodes: ',nodes);
  }
  return { nodes, edges };
};
