import React, { memo } from 'react';
import {
  BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath,
} from 'reactflow';

// TODO: think of a better name
const Path = memo((props: EdgeProps) => {
  const {
    sourceX, sourceY, targetX, targetY, markerEnd, style, label, sourcePosition, targetPosition,
    id, //eslint-disable-line
  } = props;
  const bezierOpts = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  });
  const path = bezierOpts[0];
  const labelX = bezierOpts[1];
  const labelY = bezierOpts[2];
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
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
  return 'beziercustomedge';
};

const getType = () => {
  return {
    beziercustomedge: Path,
  };
};

export default {
  Path,
  getType,
  getTypeName,
};
