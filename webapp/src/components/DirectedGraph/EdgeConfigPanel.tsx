import { Input, Space } from 'antd';
import MarkerEditEdge from './MarkerEdit/MarkerEditEdge';
import { GraphContext } from './context';
import { useContext } from 'react';

const EdgeConfigPanel = ({
  selectedEdge,
  nodes,
}: {
  selectedEdge: any;
  nodes: any[];
}) => {
  const sourceNode: any =
    nodes.find((node: any) => node.id === selectedEdge.source) || {};
  const targetNode: any =
    nodes.find((node: any) => node.id === selectedEdge.target) || {};
  const label = selectedEdge.label; // reactjs element
  return (
    <Space direction="vertical" size="middle" className="w-full">
      <Space
        direction="vertical"
        size="middle"
        className="w-full bg-white rounded-lg p-4"
      >
        <Space direction="vertical" size="small" className="w-full">
          <div className="text-zinc-400">Result</div>
          {label}
        </Space>
        <Space direction="vertical" size="small" className="w-full">
          <div className="text-zinc-400">From checkpoint</div>
          <Input
            type="text"
            value={sourceNode.data.label}
            className="w-full"
            disabled
          />
        </Space>
        <Space direction="vertical" size="small" className="w-full">
          <div className="text-zinc-400">Navigate to checkpoint</div>
          <Input
            type="text"
            value={targetNode.data.label}
            className="w-full"
            disabled
          />
        </Space>
      </Space>
      <Space
        direction="vertical"
        size="middle"
        className="w-full bg-white rounded-lg p-4"
      >
        <Space direction="vertical" size="small" className="w-full">
          <div className="text-zinc-400">Path Color</div>
          <MarkerEditEdge selectedEdge={selectedEdge} />
        </Space>
      </Space>
    </Space>
  );
};

export default EdgeConfigPanel;
