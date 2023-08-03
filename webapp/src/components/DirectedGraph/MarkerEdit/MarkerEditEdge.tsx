import { Input, Popover, Space } from 'antd';
import { Markers } from '../markers';
import { GraphContext } from '../context';
import { useContext } from 'react';
import { GraphViewMode } from '../interface';

const MarkerEditEdge = ({ selectedEdge }: { selectedEdge: any }) => {
  const { data, selectedLayoutId, onChangeLayout, viewMode } =
    useContext(GraphContext);
  const selectedLayout = data.cosmetic?.layouts?.find(
    (l: any) => l?.id === selectedLayoutId
  );
  const layoutEdge = selectedLayout?.edges?.find(
    (node: any) => node.id === selectedEdge?.id
  ) || {
    style: {
      stroke: '#000',
    },
  };
  const style = layoutEdge?.style;
  const markers = selectedLayout?.markers || [];
  return (
    <Input
      prefix={
        <Popover
          content={
            <Space direction='horizontal'>
              {Markers.map((marker: any) => {
                return (
                  <div
                    key={marker.title.backgroundColor}
                    className='w-[16px] h-[16px] border-2 cursor-pointer'
                    style={{
                      backgroundColor: marker.title.backgroundColor,
                    }}
                    onClick={() => {
                      if (viewMode === GraphViewMode.VIEW_ONLY) {
                        return;
                      }
                      const tmp = structuredClone(selectedLayout);
                      if (tmp) {
                        const edges = tmp?.edges;
                        const markers = tmp?.markers;
                        const style = {
                          ...marker.path,
                        };
                        const labelStyle = marker.labelStyle;
                        const newMarker = {
                          color: marker.title.backgroundColor,
                          title: marker.markerTitle,
                        };
                        if (!markers) {
                          tmp.markers = [];
                          tmp.markers.push(newMarker);
                        } else {
                          const idx = markers.findIndex(
                            (marker: any) => marker.color === newMarker.color
                          );
                          if (idx === -1) {
                            markers.push(newMarker);
                          }
                        }

                        const newEdgeStyle = {
                          id: selectedEdge?.id,
                          style,
                          labelStyle,
                        };
                        if (!edges) {
                          tmp.edges = [];
                          tmp.edges.push(newEdgeStyle);
                        } else {
                          const idx = edges.findIndex(
                            (node: any) => node.id === selectedEdge?.id
                          );
                          if (idx === -1) {
                            edges.push(newEdgeStyle);
                          } else {
                            edges[idx].style = {
                              ...edges[idx].style,
                              ...style,
                            };

                            edges[idx].labelStyle = labelStyle;
                          }
                        }
                        onChangeLayout
                          ? onChangeLayout({
                              ...tmp,
                            })
                          : null;
                      }
                    }}
                  ></div>
                );
              })}
            </Space>
          }
        >
          <div
            className='w-[24px] h-[24px] rounded-md border cursor-pointer mr-2'
            style={{
              backgroundColor: style?.stroke,
            }}
          ></div>
        </Popover>
      }
      className='w-full'
      value={
        markers.find((marker: any) => marker.color === style?.stroke)?.title ||
        ''
      }
      placeholder='Write a label'
      onChange={(e) => {
        const label = e.target.value;
        const tmp = structuredClone(selectedLayout);

        if (tmp) {
          const idx = markers?.findIndex(
            (marker: any) => marker.color === style?.stroke
          );
          if (idx !== -1) {
            markers[idx].title = label;
          } else {
            markers.push({
              color: style?.title?.backgroundColor,
              title: label,
            });
          }
          onChangeLayout
            ? onChangeLayout({
                ...tmp,
                markers: [...markers],
              })
            : null;
        }
      }}
      disabled={
        style?.stroke === '#fff' || viewMode === GraphViewMode.VIEW_ONLY
      }
    />
  );
};

export default MarkerEditEdge;
