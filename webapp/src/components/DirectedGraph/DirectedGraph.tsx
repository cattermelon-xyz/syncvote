import ReactFlow, {
  Controls, Background, BackgroundVariant, Panel, ReactFlowProvider,
  useOnViewportChange,
} from 'reactflow';
import React, { useEffect, useCallback, useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import { EditOutlined, FolderOpenOutlined, FormOutlined, PlusOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import 'reactflow/dist/style.css';
import { buildATree } from './buildATree';
import MultipleDirectNode from './CustomNodes/MultipleDiretionNode';
import SelfConnectingEdge from './CustomEdges/SelfConnectingEdge';
import BezierCustomEdge from './CustomEdges/BezierCustomEdge';
import SmoothCustomEdge from './CustomEdges/SmoothCustomEdge';
import { IWorkflowVersionCosmetic, IWorkflowVersionLayout } from './interface';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import CosmeticConfigPanel from './CosmeticConfigPanel';

const nodeTypes = { ...MultipleDirectNode.getType() };
const edgeTypes = { ...SelfConnectingEdge.getType(), ...BezierCustomEdge.getType(), ...SmoothCustomEdge.getType() };

interface IFlow {
  data?: any, // eslint-disable-line
  onNodeClick?: (event:any, data:any) => void,
  onLayoutClick?: (data:any) => void,
  selectedNodeId?: string, // eslint-disable-line
  selectedLayoutId?: string,
  onPaneClick? : (event:any) => void,
  onNodeChanged? : (nodes: any) => void,
  onCosmeticChanged? : (changed: IWorkflowVersionCosmetic) => void,
  onResetPosition? : () => void,
  onAddNewNode? : () => void,
  nodes?: any, // eslint-disable-line
  edges?: any, // eslint-disable-line
  cosmetic?: any, // eslint-disable-line
  onViewPortChange?: (viewport:any) => void,
  editable?: boolean, // eslint-disable-line
  navPanel?: JSX.Element, // eslint-disable-line
}
// TODO: should change editable to isWorkflow to reflect the real meaning
const Flow = ({
  onNodeClick = () => {},
  onLayoutClick = (data:any) => {},
  onPaneClick = () => {},
  onNodeChanged = () => {},
  onResetPosition = () => {},
  onAddNewNode = () => {},
  onViewPortChange = () => {},
  onCosmeticChanged = (changed: IWorkflowVersionCosmetic) => {},
  selectedLayoutId,
  nodes,
  edges,
  cosmetic,
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
  const layouts:IWorkflowVersionLayout[] = cosmetic?.layouts;
  const defaultLayout = cosmetic?.default;
  const [showCosmeticPanel, setShowCosmeticPanel] = useState(false);
  return (
    <>
      <Drawer
        title="Layout Config"
        open={showCosmeticPanel}
        onClose={() => setShowCosmeticPanel(false)}
      >
        <CosmeticConfigPanel layouts={layouts} onCosmeticChanged={onCosmeticChanged} deleteLayoutHandler={(id:string) => {}} />
      </Drawer>
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
          <Space direction="vertical">
            <Space direction="horizontal">
              {navPanel}
            </Space>
            <Space direction="horizontal" size="middle" className="p-2 border rounded-md flex items-center bg-white">
              <Space direction="horizontal" size="small" className="flex items-center">
                Layout
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCosmeticPanel(true);
                  }}>
                  <EditIcon />
                </span>
              </Space>
              {layouts?.map((layout, index) => {
                const selected = layout.id === selectedLayoutId ? 'bg-violet-100' : 'bg-white';
                return (
                  <div
                    key={layout.id}
                    className={`cursor-pointer p-2 border rounded-md hover:bg-violet-100 ${selected}`}
                    onClick={() => {
                      onLayoutClick(layout.id);
                    }}
                  >
                    {layout.title}
                  </div>
                )
              })}
            </Space>
          </Space>
        </Panel>
        <Panel position="bottom-left">
          <Space direction="horizontal">
            <Button className="flex items-center" type="default" icon={<VerticalAlignMiddleOutlined />} onClick={onResetPosition}>Reset Position</Button>
            <Button className="flex items-center" type="default" icon={<PlusOutlined />} onClick={onAddNewNode} disabled={!editable}>Add CheckPoint</Button>
          </Space>
        </Panel>
      </ReactFlow>    
    </>
  );
};
// TODO: expose a function for manually trigger fitview
export const DirectedGraph = ({
  data, onNodeClick = () => {}, onLayoutClick = () => {},
  selectedNodeId,
  selectedLayoutId,
  onPaneClick = () => {},
  onNodeChanged = () => {},
  onResetPosition = () => {},
  onAddNewNode = () => {},
  onViewPortChange = () => {},
  onCosmeticChanged = (changed: IWorkflowVersionCosmetic) => {},
  editable = true,
  navPanel = <></>,
}: IFlow) => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  useEffect(() => {
    const obj:any = buildATree({data, selectedNodeId, selectedLayoutId});
    setNodes(obj.nodes);
    setEdges(obj.edges);
  }, [data, selectedNodeId, selectedLayoutId]);
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
          cosmetic={data.cosmetic}
          onNodeClick={onNodeClick}
          onLayoutClick={onLayoutClick}
          onPaneClick={onPaneClick}
          onNodeChanged={onNodeChanged}
          onResetPosition={onResetPosition}
          onAddNewNode={onAddNewNode}
          onViewPortChange={onViewPortChange}
          onCosmeticChanged={onCosmeticChanged}
          editable={editable}
          navPanel={navPanel}
          selectedLayoutId={selectedLayoutId}
        />
      </ReactFlowProvider>
    </div>
  );
};
