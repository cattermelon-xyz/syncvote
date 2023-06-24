import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from 'reactflow';

// TODO: think of a better name
const Path = memo((props: EdgeProps) => {
  const {
    sourceX, sourceY, targetX, targetY, id, markerEnd, style, label, //eslint-disable-line
  } = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX
  } ${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - radiusY - 28;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
            backgroundColor: 'white',
          }}
          className="nodrag nopan text-center"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

const getTypeName = () => {
  return 'selfconnecting';
};

const getType = () => {
  return {
    selfconnecting: Path,
  };
};

export default {
  Path,
  getType,
  getTypeName,
};
