import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from 'reactflow';
import EdgeLabel from './fragments/EdgeLabel';

// TODO: think of a better name
const Path = memo((props: EdgeProps) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    id,
    markerEnd,
    style,
    label,
    data,
    target, //eslint-disable-line
    labelStyle,
  } = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${targetX} ${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - radiusY - 28;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
