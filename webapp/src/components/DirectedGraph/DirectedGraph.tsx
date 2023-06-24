import ReactFlow, {
  Controls, Background, BackgroundVariant, Panel, ReactFlowProvider,
  useOnViewportChange,
} from 'reactflow';
import React, { useEffect, useCallback } from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import 'reactflow/dist/style.css';
import { buildATree } from './buildATree';
import MultipleDirectNode from './MultipleDiretionNode';
import SelfConnectingEdge from './SelfConnectingEdge';
import BezierCustomEdge from './BezierCustomEdge';

const nodeTypes = { ...MultipleDirectNode.getType() };
const edgeTypes = { ...SelfConnectingEdge.getType(), ...BezierCustomEdge.getType() };

interface IFlow {
  data?: any, // eslint-disable-line
  onNodeClick?: (event:any, data:any) => void,
  selectedNodeId?: string, // eslint-disable-line
  onPaneClick? : (event:any) => void,
  onNodeChanged? : (nodes: any) => void,
  onResetPosition? : () => void,
  onAddNewNode? : () => void,
  nodes?: any, // eslint-disable-line
  edges?: any, // eslint-disable-line
  onViewPortChange?: (viewport:any) => void,
  editable?: boolean, // eslint-disable-line
  navPanel?: JSX.Element, // eslint-disable-line
}
// TODO: should change editable to isWorkflow to reflect the real meaning
const Flow = ({
  onNodeClick = () => {},
  onPaneClick = () => {},
  onNodeChanged = () => {},
  onResetPosition = () => {},
  onAddNewNode = () => {},
  onViewPortChange = () => {},
  nodes,
  edges,
  editable = true,
  navPanel = (<></>),
}: IFlow) => {
  useOnViewportChange({
    onChange: useCallback((viewport: any) => {
      onViewPortChange(viewport);
    }, []),
  });
  const proOptions = {
    hideAttribution: true,
  };
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodesChange={onNodeChanged}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={proOptions}
      fitView
    >
      <Controls
        position="top-right"
      />
      <Background color="#aaa" variant={BackgroundVariant.Dots} />
      <Panel position="top-left">
        <Space direction="horizontal">
          {navPanel}
        </Space>
      </Panel>
      <Panel position="bottom-left">
        <Space direction="horizontal">
          <Button className="flex items-center" type="default" icon={<VerticalAlignMiddleOutlined />} onClick={onResetPosition}>Reset Position</Button>
          <Button className="flex items-center" type="default" icon={<PlusOutlined />} onClick={onAddNewNode} disabled={!editable}>Add CheckPoint</Button>
        </Space>
      </Panel>
    </ReactFlow>
  );
};
// TODO: expose a function for manually trigger fitview
export const DirectedGraph = ({
  data, onNodeClick = () => {},
  selectedNodeId,
  onPaneClick = () => {},
  onNodeChanged = () => {},
  onResetPosition = () => {},
  onAddNewNode = () => {},
  onViewPortChange = () => {},
  editable = true,
  navPanel = <></>,
}: IFlow) => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  useEffect(() => {
    const obj:any = buildATree(data, selectedNodeId);
    setNodes(obj.nodes);
    setEdges(obj.edges);
  }, [data, selectedNodeId]);
  return (
    <div
      style={{
        width: '100%', minWidth: '800px', backgroundColor: 'white',
      }}
      className="h-full"
    >
      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeChanged={onNodeChanged}
          onResetPosition={onResetPosition}
          onAddNewNode={onAddNewNode}
          onViewPortChange={onViewPortChange}
          editable={editable}
          navPanel={navPanel}
        />
      </ReactFlowProvider>
    </div>
  );
};
