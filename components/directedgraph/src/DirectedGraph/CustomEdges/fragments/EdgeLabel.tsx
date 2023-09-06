import { DelayUnit } from '../../interface';
import { displayDelayDuration } from '../../utils';
import { Popover } from 'antd';
import moment from 'moment';
import parse from 'html-react-parser';

const EdgeLabel = ({
  labelX,
  labelY,
  label,
  target,
  data,
  labelStyle,
}: {
  labelX: number;
  labelY: number;
  label: React.ReactNode;
  target: string;
  data: any;
  labelStyle: any;
}) => {
  // Render timelock
  const optIdx = (data?.children || []).findIndex(
    (child: any) => child === target
  );
  const delay =
    optIdx !== -1 && data?.data.delays ? data?.data.delays[optIdx] : 0;
  const delayUnit =
    optIdx !== -1 && data?.data.delayUnits
      ? data?.data.delayUnits[optIdx]
      : DelayUnit.MINUTE;
  const delayNote =
    optIdx !== -1 && data?.data.delayNotes ? data?.data.delayNotes[optIdx] : '';
  return (
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
      className='nopan text-center rounded-md p-2'
    >
      {parseInt(delay) > 0 ? (
        <Popover trigger='hover' content={parse(delayNote)}>
          {displayDelayDuration(
            moment.duration(delay, delayUnit ? delayUnit : 'minute')
          )}
        </Popover>
      ) : null}
      <div className='font-bold'>{label}</div>
    </div>
  );
};

export default EdgeLabel;
