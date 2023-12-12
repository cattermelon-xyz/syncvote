import {
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

const ColorLegend = ({
  showColorLegend,
  setShowColorLegend,
  markers,
  version,
  selectedLayoutId,
  changeCosmetic,
  setVersion,
  setDataHasChanged,
}: {
  showColorLegend: any;
  setShowColorLegend: any;
  markers: any;
  version: any;
  selectedLayoutId: any;
  changeCosmetic: any;
  setVersion: any;
  setDataHasChanged: any;
}) => {
  return (
    <>
      <div
        className='text-gray-400 font-bold flex items-center gap-2'
        style={{ marginBottom: '0px' }}
      >
        <div>Color legend</div>
        <div
          className='hover:text-violet-500 cursor-pointer'
          onClick={() => setShowColorLegend(!showColorLegend)}
        >
          {showColorLegend ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </div>
      </div>
      {showColorLegend &&
        markers.map((marker: any) => {
          return (
            <div className='flex gap-2 items-center' key={marker.color}>
              <div
                className='w-[16px] h-[16px]'
                style={{ backgroundColor: marker.color }}
              ></div>
              <Typography.Paragraph
                editable={{
                  onChange: (val) => {
                    markers[markers.indexOf(marker)].title = val;
                    const selectedLayout =
                      version?.data?.cosmetic?.layouts.find(
                        (l: any) => l.id === selectedLayoutId
                      );
                    selectedLayout.markers = markers;
                    const cosmetic = changeCosmetic(version?.data.cosmetic, {
                      layouts: [selectedLayout],
                    });
                    setVersion({
                      ...version,
                      data: { ...version.data, cosmetic },
                    });
                    setDataHasChanged(true);
                  },
                }}
                style={{ marginBottom: '0px' }}
              >
                {marker.title}
              </Typography.Paragraph>

              <CloseCircleOutlined
                className='hover:text-red-500'
                onClick={() => {
                  markers.splice(markers.indexOf(marker), 1);
                  const selectedLayout = version?.data?.cosmetic?.layouts.find(
                    (l: any) => l.id === selectedLayoutId
                  );
                  selectedLayout.markers = markers;
                  const cosmetic = changeCosmetic(version?.data.cosmetic, {
                    layouts: [selectedLayout],
                  });
                  setVersion({
                    ...version,
                    data: { ...version.data, cosmetic },
                  });
                  setDataHasChanged(true);
                }}
              />
            </div>
          );
        })}
    </>
  );
};
export default ColorLegend;
