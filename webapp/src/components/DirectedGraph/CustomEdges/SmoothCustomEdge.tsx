import React, { memo } from 'react';
import {
  BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath,
} from 'reactflow';

interface CustomProps extends EdgeProps {
  isHappyPath?: boolean;
}

// TODO: think of a better name
const Path = memo((props: CustomProps) => {
  const {
    sourceX, sourceY, targetX, targetY, markerEnd, style, label, sourcePosition, targetPosition,
    id, isHappyPath = true //eslint-disable-line
  } = props;
  const smoothOpts = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 24,
  });
  const path = smoothOpts[0];
  const labelX = smoothOpts[1];
  const labelY = smoothOpts[2];
  const additionalStyle = isHappyPath ? {
    strokeWidth: 2,
    stroke: '#6F00FF',
    // 1px -1px 0px 7px rgba(0,0,0,0.48);
    // filter: 'drop-shadow(0px 0px 5px rgb(111 0 255 / 0.7)) drop-shadow( 1px  0px 5px rgb(111 0 255 / 0.7))  drop-shadow(-1px  0px 5px rgb(111 20 255 / 0.5))',
  } : {};
  const finalStyle = { ...style, ...additionalStyle };
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={finalStyle} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
            backgroundColor: isHappyPath? 'rgba(212, 183, 255)' : 'white',
            color: isHappyPath ? '#6F00FF' : 'zinc',
          }}
          className="nodrag nopan text-center rounded-md p-2"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

const getTypeName = () => {
  return 'smoothcustomedge';
};

const getType = () => {
  return {
    smoothcustomedge: Path,
  };
};

export default {
  Path,
  getType,
  getTypeName,
};
