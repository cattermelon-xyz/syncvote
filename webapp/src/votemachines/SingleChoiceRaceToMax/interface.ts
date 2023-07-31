export interface IData {
  //eslint-disable-line
  options: string[];
  max: number;
  token: string;
  includedAbstain: boolean;
  delays: number[];
  delayUnits: DelayUnit[];
}

export enum DelayUnit {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface IOption {
  id: string;
  title: string;
  delay: number;
  delayUnit: DelayUnit;
}

export const displayDelayDuration = (duration: moment.Duration) => {
  const years = duration.years() === 0 ? '' : `${duration.years()} years `;
  const months = duration.months() === 0 ? '' : `${duration.months()} months `;
  const days = duration.days() === 0 ? '' : `${duration.days()} days `;
  const hours = duration.hours() === 0 ? '' : `${duration.hours()} hours `;
  const minutes =
    duration.minutes() === 0 ? '' : `${duration.minutes()} minutes `;
  const delay = years + months + days + hours + minutes;
  return delay ? 'Delay ' + delay : 'No delay';
};
