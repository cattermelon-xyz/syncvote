import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useOnViewportChange,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow';
import { toPng } from 'html-to-image';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { Button, Drawer, Modal, Space } from 'antd';
import { BulbOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import 'reactflow/dist/style.css';
import { buildATree } from './buildATree';
import MultipleDirectNode from './CustomNodes/MultipleDiretionNode';
import SelfConnectingEdge from './CustomEdges/SelfConnectingEdge';
import BezierCustomEdge from './CustomEdges/BezierCustomEdge';
import SmoothCustomEdge from './CustomEdges/SmoothCustomEdge';
import { GraphViewMode, IGraph, IWorkflowVersionLayout } from './interface';
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
function downloadImage(dataUrl: any) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

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
    viewMode,
    navPanel,
    web2Integrations,
    onDeleteNode,
    onChange,
    onConfigPanelClose,
    onChangeLayout,
    onConfigEdgePanelClose,
    shouldExportImage,
    setExportImage,
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
    if (shouldExportImage) {
      selfDownloadImage({ imageWidth: 1344, imageHeight: 768 });
      setExportImage ? setExportImage(false) : null;
    }
  }, [data, selectedNodeId, selectedLayoutId, shouldExportImage]);
  const proOptions = {
    hideAttribution: true,
  };
  const layouts: IWorkflowVersionLayout[] = data?.cosmetic?.layouts || [];
  // const defaultLayout = data?.cosmetic?.default;
  const [showCosmeticPanel, setShowCosmeticPanel] = useState(false);
  const [showQuickStartDialog, setShowQuickStartDialog] = useState(false);
  const selectedEdge = edges?.find((edge: any) => edge.id === selectedEdgeId);

  const { getNodes } = useReactFlow();
  const selfDownloadImage = ({
    imageWidth = 1344,
    imageHeight = 768,
  }: {
    imageWidth?: number;
    imageHeight?: number;
  }) => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.4,
      10
    );

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#fff',
      width: imageWidth,
      height: imageHeight,
      skipAutoScale: true,
      style: {
        width: imageWidth + 'px',
        height: imageHeight + 'px',
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <>
      {renderVoteMachineConfigPanel({
        viewMode,
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
        title='Layout Config'
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
        title='Navigation Path'
        open={selectedEdgeId !== '' && selectedEdgeId !== undefined}
        onClose={onConfigEdgePanelClose}
        className='edge-config-panel'
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
        fitView={true}
        fitViewOptions={{
          padding: 20,
          maxZoom: 4,
          minZoom: 1,
        }}
      >
        <Controls position='bottom-left' />
        <Background color='#aaa' variant={BackgroundVariant.Dots} />
        <Panel position='top-left'>
          <Space direction='vertical'>
            <Space direction='horizontal'>{navPanel}</Space>
            {/* <Space
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
            </Space> */}
          </Space>
        </Panel>
        {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ? (
          <>
            <Panel position='bottom-center'>
              <Space direction='horizontal'>
                <div
                  className='flex items-center justify-center w-[44px] h-[44px] rounded-lg text-violet-500 cursor-pointer'
                  style={{ backgroundColor: '#F4F0FA' }}
                  onClick={onResetPosition}
                >
                  <SyncOutlined />
                </div>
                <div
                  className={`flex items-center justify-center w-[44px] h-[44px] rounded-lg text-violet-500 cursor-pointer`}
                  style={{ backgroundColor: '#F4F0FA' }}
                  onClick={() => {
                    onAddNewNode ? onAddNewNode() : null;
                  }}
                >
                  <PlusOutlined />
                </div>
              </Space>
            </Panel>
            <Panel position='bottom-right'>
              <>
                <Modal
                  open={showQuickStartDialog}
                  onCancel={() => setShowQuickStartDialog(false)}
                  title='🔥 Guide to master Syncvote'
                  footer={null}
                >
                  <QuickStartDialog />
                </Modal>
                <Button
                  icon={<BulbOutlined />}
                  type='link'
                  className='flex items-center'
                  onClick={() => setShowQuickStartDialog(true)}
                >
                  Quick Start
                </Button>
              </>
            </Panel>
          </>
        ) : null}
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
      className='h-full directed-graph'
    >
      <GraphContext.Provider value={props}>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </GraphContext.Provider>
    </div>
  );
};
