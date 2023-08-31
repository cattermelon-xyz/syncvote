import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from 'reactflow';
import EdgeLabel from './fragments/EdgeLabel';

// strokeWidth: 2,
// stroke: '#6F00FF',

// TODO: think of a better name
const Path = memo((props: EdgeProps) => {
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
    data,
    target,
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
        <EdgeLabel
          labelX={labelX}
          labelY={labelY}
          labelStyle={labelStyle}
          label={label}
          target={target}
          data={data}
        />
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
