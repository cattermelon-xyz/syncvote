import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import EdgeLabel from './fragments/EdgeLabel';

// TODO: think of a better name
const Path = memo((props: EdgeProps) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    style,
    label,
    sourcePosition,
    targetPosition,
    id, //eslint-disable-line
    data,
    labelStyle,
    target,
  } = props;
  const bezierOpts = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const path = bezierOpts[0];
  const labelX = bezierOpts[1];
  const labelY = bezierOpts[2];
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <EdgeLabel
          labelX={labelX}
          labelY={labelY}
          label={label}
          target={target}
          data={data}
          labelStyle={labelStyle}
        />
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
