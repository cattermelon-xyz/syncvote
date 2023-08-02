import { ClockCircleOutlined } from '@ant-design/icons';

export const displayDelayDuration = (duration: moment.Duration) => {
  const years =
    duration.years() === 0
      ? ''
      : `${duration.years()} ${duration.years() > 1 ? 'years' : 'year'} `;
  const months =
    duration.months() === 0
      ? ''
      : `${duration.months()} ${duration.months() > 1 ? 'months' : 'month'} `;
  const days =
    duration.days() === 0
      ? ''
      : `${duration.days()} ${duration.days() > 1 ? 'days' : 'day'} `;
  const hours =
    duration.hours() === 0
      ? ''
      : `${duration.hours()} ${duration.hours() > 1 ? 'hours' : 'hour'} `;
  const minutes =
    duration.minutes() === 0 ? '' : `${duration.minutes()} minutes `;
  const delay = years + months + days + hours + minutes;
  return delay ? (
    <div>
      <ClockCircleOutlined className='mr-1' />
      {delay}
    </div>
  ) : (
    <div>
      <ClockCircleOutlined className='mr-1' />
      No Timelock
    </div>
  );
};
