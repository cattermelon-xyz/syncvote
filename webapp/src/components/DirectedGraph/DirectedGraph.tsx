import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useOnViewportChange,
} from 'reactflow';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { Button, Drawer, Modal, Space } from 'antd';
import { BulbOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import 'reactflow/dist/style.css';
import { buildATree } from './buildATree';
import MultipleDirectNode from './CustomNodes/MultipleDiretionNode';
import SelfConnectingEdge from './CustomEdges/SelfConnectingEdge';
import BezierCustomEdge from './CustomEdges/BezierCustomEdge';
import SmoothCustomEdge from './CustomEdges/SmoothCustomEdge';
import { IGraph, IWorkflowVersionLayout } from './interface';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import CosmeticConfigPanel from './CosmeticConfigPanel';
import QuickStartDialog from './QuickStartDialog';
import { GraphContext } from './context';
import EdgeConfigPanel from './EdgeConfigPanel';
import { renderVoteMachineConfigPanel } from './renderVoteMachineConfigPanel';

const nodeTypes = { ...MultipleDirectNode.getType() };
const edgeTypes = {
  ...SelfConnectingEdge.getType(),
  ...BezierCustomEdge.getType(),
  ...SmoothCustomEdge.getType(),
};

// TODO: should change editable to isWorkflow to reflect the real meaning
const Flow = () => {
  const {
    data,
    selectedNodeId,
    selectedEdgeId,
    onNodeClick,
    onEdgeClick,
    onLayoutClick,
    onPaneClick,
    onNodeChanged,
    onResetPosition,
    onAddNewNode,
    onViewPortChange,
    onCosmeticChanged,
    selectedLayoutId,
    editable = true,
    navPanel,
    web2Integrations,
    onDeleteNode,
    onChange,
    onConfigPanelClose,
    onChangeLayout,
    onConfigEdgePanelClose,
  } = useContext(GraphContext);
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  useOnViewportChange({
    onChange: useCallback((viewport: any) => {
      onViewPortChange ? onViewPortChange(viewport) : null;
    }, []),
  });
  useEffect(() => {
    const obj: any = buildATree({ data, selectedNodeId, selectedLayoutId });
    setNodes(obj.nodes);
    setEdges(obj.edges);
  }, [data, selectedNodeId, selectedLayoutId]);
  const proOptions = {
    hideAttribution: true,
  };
  const layouts: IWorkflowVersionLayout[] = data?.cosmetic?.layouts || [];
  // const defaultLayout = data?.cosmetic?.default;
  const [showCosmeticPanel, setShowCosmeticPanel] = useState(false);
  const [showQuickStartDialog, setShowQuickStartDialog] = useState(false);
  const selectedEdge = edges?.find((edge: any) => edge.id === selectedEdgeId);
  return (
    <>
      {renderVoteMachineConfigPanel({
        editable,
        web2Integrations,
        data,
        selectedNodeId,
        selectedLayoutId,
        onChange,
        onDelete: onDeleteNode,
        onClose: onConfigPanelClose,
        onChangeLayout,
      })}
      <Drawer
        title="Layout Config"
        open={showCosmeticPanel}
        onClose={() => setShowCosmeticPanel(false)}
      >
        <CosmeticConfigPanel
          layouts={layouts}
          onCosmeticChanged={onCosmeticChanged ? onCosmeticChanged : () => {}}
          deleteLayoutHandler={(id: string) => {}}
        />
      </Drawer>
      <Drawer
        title="Navigation Path"
        open={selectedEdgeId !== '' && selectedEdgeId !== undefined}
        onClose={onConfigEdgePanelClose}
        className="edge-config-panel"
        closeIcon={<></>}
      >
        {selectedEdgeId !== '' && selectedEdgeId !== undefined ? (
          <EdgeConfigPanel selectedEdge={selectedEdge} nodes={nodes} />
        ) : null}
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
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Controls position="bottom-left" />
        <Background color="#aaa" variant={BackgroundVariant.Dots} />
        <Panel position="top-left">
          <Space direction="vertical">
            <Space direction="horizontal">{navPanel}</Space>
            <Space
              direction="horizontal"
              size="middle"
              className="p-2 border rounded-md flex items-center bg-white"
            >
              <Space
                direction="horizontal"
                size="small"
                className="flex items-center"
              >
                Layout
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCosmeticPanel(true);
                  }}
                >
                  <EditIcon />
                </span>
              </Space>
              {layouts?.map((layout, index) => {
                const selected =
                  layout?.id === selectedLayoutId
                    ? 'bg-violet-100'
                    : 'bg-white';
                return (
                  <div
                    key={layout?.id}
                    className={`cursor-pointer p-2 border rounded-md hover:bg-violet-100 ${selected}`}
                    onClick={() => {
                      onLayoutClick ? onLayoutClick(layout.id) : null;
                    }}
                  >
                    {layout?.title}
                  </div>
                );
              })}
            </Space>
          </Space>
        </Panel>
        <Panel position="bottom-center">
          <Space direction="horizontal">
            <div
              className="flex items-center justify-center w-[44px] h-[44px] rounded-lg text-violet-500 cursor-pointer"
              style={{ backgroundColor: '#F4F0FA' }}
              onClick={onResetPosition}
            >
              <SyncOutlined />
            </div>
            <div
              className={`flex items-center justify-center w-[44px] h-[44px] rounded-lg ${
                editable ? `text-violet-500 cursor-pointer` : `text-gray-400`
              }`}
              style={{ backgroundColor: editable ? '#F4F0FA' : '#aaa' }}
              onClick={() => {
                editable && onAddNewNode ? onAddNewNode() : null;
              }}
            >
              <PlusOutlined />
            </div>
          </Space>
        </Panel>
        <Panel position="bottom-right">
          <>
            <Modal
              open={showQuickStartDialog}
              onCancel={() => setShowQuickStartDialog(false)}
              title="🔥 Guide to master Syncvote"
              footer={null}
            >
              <QuickStartDialog />
            </Modal>
            <Button
              icon={<BulbOutlined />}
              type="link"
              className="flex items-center"
              onClick={() => setShowQuickStartDialog(true)}
            >
              Quick Start
            </Button>
          </>
        </Panel>
      </ReactFlow>
    </>
  );
};
// TODO: expose a function for manually trigger fitview
export const DirectedGraph = (props: IGraph) => {
  return (
    <div
      style={{
        width: '100%',
        minWidth: '800px',
        backgroundColor: 'white',
      }}
      className="h-full directed-graph"
    >
      <GraphContext.Provider value={props}>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </GraphContext.Provider>
    </div>
  );
};
