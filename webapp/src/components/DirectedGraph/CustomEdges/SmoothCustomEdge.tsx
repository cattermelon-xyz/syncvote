import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from 'reactflow';

interface CustomProps extends EdgeProps {}

// strokeWidth: 2,
// stroke: '#6F00FF',

// TODO: think of a better name
const Path = memo((props: CustomProps) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    style,
    labelStyle,
    label,
    sourcePosition,
    targetPosition,
    id,
  } = props;

  const smoothOpts = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 24,
  });
  const path = smoothOpts[0];
  const labelX = smoothOpts[1];
  const labelY = smoothOpts[2];
  
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />\{' '}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
            ...labelStyle,
            // backgroundColor: "beige"
          }}
          className='nodrag nopan text-center rounded-md p-2'
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
