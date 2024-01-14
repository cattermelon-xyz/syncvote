import { ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

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
    <div className='whitespace-nowrap'>
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

// return TRUE if str is not empty and not '<p></p>' and not '<p><br></p>'
export const isRTE = (str: string | undefined) => {
  return str && str !== '<p></p>' && str !== '<p><br></p>';
};

export const displayDuration = (duration: moment.Duration) => {
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
    duration.minutes() === 0
      ? ''
      : `${duration.minutes()} ${
          duration.minutes() > 1 ? 'minutes' : 'minute'
        } `;
  const seconds =
    duration.seconds() === 0
      ? ''
      : `${duration.seconds()} ${
          duration.seconds() > 1 ? 'seconds' : 'second'
        } `;
  const drt = years + months + days + hours + minutes + seconds;
  return drt ? drt : '0 seconds';
};

export const shortenString = (str: string, maxLength: number = 30) => {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};

export const replaceVariables = async (
  template: string,
  variables: any,
  onSuccess: any
) => {
  let result = template;
  Object.keys(variables).forEach(async (key) => {
    if (variables[key]) {
      const v = variables[key];
      result = result.replace(`{{${key}}}`, v);
      const regex = new RegExp(`{{${key}.\\w*}}`, 'g');
      const matches = result.matchAll(regex);
      for (const match of matches) {
        const _key = match[0].replace('{{', '').replace('}}', '').split('.')[1];
        await axios.get(v).then((res) => {
          result = result.replace(match[0], res.data[_key]);
        });
      }
    }
    onSuccess(result);
  });
  return result;
};
