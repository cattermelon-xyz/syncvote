import { Divider, Input, Popover, Space } from 'antd';
import { Markers } from '../markers';
import { GraphPanelContext } from '../context';
import { useContext } from 'react';
import { DownOutlined } from '@ant-design/icons';

const MarkerEditNode = () => {
  const { data, selectedLayoutId, selectedNodeId, onChangeLayout } =
    useContext(GraphPanelContext);
  const selectedNode = data.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const selectedLayout = data.cosmetic?.layouts?.find(
    (l: any) => l?.id === selectedLayoutId
  );
  const layoutNode = selectedLayout?.nodes?.find(
    (node: any) => node.id === selectedNode?.id
  ) || {
    style: {
      title: {
        backgroundColor: '#fff',
      },
    },
  };
  const style = layoutNode?.style;
  const markers = selectedLayout?.markers || [];
  return (
    <Input
      size='large'
      addonBefore={
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
                      const tmp = structuredClone(selectedLayout);
                      if (tmp) {
                        const nodes = tmp?.nodes;
                        const markers = tmp?.markers;
                        const style = {
                          title: { ...marker.title },
                          content: { ...marker.content },
                        };
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
                        if (!nodes) {
                          tmp.nodes = [];
                          tmp.nodes.push({
                            id: selectedNode?.id,
                            style,
                          });
                        } else {
                          const idx = nodes.findIndex(
                            (node: any) => node.id === selectedNode?.id
                          );
                          if (idx === -1) {
                            nodes.push({
                              id: selectedNode?.id,
                              style,
                            });
                          } else {
                            nodes[idx].style = {
                              ...nodes[idx].style,
                              ...style,
                            };
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
          trigger='click'
        >
          <Space.Compact direction='horizontal' className='flex items-center'>
            <div
              className='w-[24px] h-[24px] rounded-md border cursor-pointer mr-1'
              style={{
                backgroundColor: style?.title.backgroundColor,
              }}
            ></div>
            <DownOutlined />
          </Space.Compact>
        </Popover>
      }
      className='w-full py-2'
      value={
        markers.find(
          (marker: any) => marker.color === style?.title?.backgroundColor
        )?.title || ''
      }
      placeholder='Write a label'
      onChange={(e) => {
        const label = e.target.value;
        const tmp = structuredClone(selectedLayout);
        if (tmp) {
          const idx = markers?.findIndex(
            (marker: any) => marker.color === style?.title?.backgroundColor
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
      disabled={style?.title?.backgroundColor === '#fff'}
    />
  );
};

export default MarkerEditNode;
