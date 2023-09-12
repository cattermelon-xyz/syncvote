import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import { Layout } from 'antd';
import { emptyStage } from './DirectedGraph/empty';
import { DirectedGraph } from './DirectedGraph/DirectedGraph';
import { GraphViewMode } from './DirectedGraph/interface';
import { fakeVersion } from './mockData/fakeVersion';

function App() {
  const [shouldDownloadImage, setShouldDownloadImage] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [version, setVersion] = useState<any>(fakeVersion);
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const [isVoteMachineRegistered, setIsVoteMachineRegistered] = useState(false);

  return (
    <div className='App h-screen'>
      {isVoteMachineRegistered && (
        <Layout className='relative items-center w-full h-screen'>
          <DirectedGraph
            viewMode={GraphViewMode.VIEW_ONLY}
            shouldExportImage={shouldDownloadImage}
            setExportImage={setShouldDownloadImage}
            data={version?.data || emptyStage}
            selectedNodeId={selectedNodeId}
            selectedLayoutId={
              version?.data?.cosmetic?.defaultLayout?.horizontal
            }
            onChange={(newData) => {}}
            onChangeLayout={(newData) => {}}
            onDeleteNode={(nodeId) => {}}
            onConfigEdgePanelClose={() => {}}
            onConfigPanelClose={() => setSelectedNodeId('')}
            onNodeChanged={(changedNodes) => {
              const newData = structuredClone(version?.data);
              newData?.checkpoints?.forEach((v: any, index: number) => {
                const changedNode = changedNodes.find(
                  (cN: any) => cN.id === v.id
                );
                if (changedNode && changedNode.position) {
                  newData.checkpoints[index].position = changedNode.position;
                }
              });
              setVersion({
                ...version,
                data: newData,
              });
              if (selectedNodeId) {
                setDataHasChanged(true);
              }
            }}
            onNodeClick={(_event, node) => {
              setSelectedNodeId(node.id);
            }}
            onPaneClick={() => {
              setSelectedNodeId('');
            }}
            onResetPosition={() => {}}
            onAddNewNode={() => {}}
            onViewPortChange={(viewport) => {
              setCenterPos({
                x: (-viewport.x + 600) / viewport.zoom,
                y: (-viewport.y + 250) / viewport.zoom,
              });
            }}
          />
        </Layout>
      )}
    </div>
  );
}

export default App;
