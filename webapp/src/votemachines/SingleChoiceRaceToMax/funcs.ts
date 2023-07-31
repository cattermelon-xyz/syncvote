import { ICheckPoint } from '@types';
import { IData } from './interface';

export const getName = () => {
  return 'Single Choice';
};

export const getProgramAddress = () => {
  return 'SingleChoiceRaceToMax';
};

/**
 * Providing both getType and getProgramAddress enables the same program with different views
 * @returns Type of the voting machine
 */
export const getType = () => {
  return 'SingleChoiceRaceToMax';
};

export const deleteChildNode = (
  data: IData,
  children: string[],
  childId: string
) => {
  const index = children ? children.indexOf(childId) : -1;
  const result = data.options ? [...data.options] : [];
  if (index === -1) {
    return result;
  }
  result.splice(index, 1);
  return { ...data, options: result };
};

export const getInitialData = () => {
  const data: IData = {
    options: [],
    max: 0,
    includedAbstain: true,
    token: '',
    delays: [],
    delayUnits: [],
  };
  return data;
};

export const validate = ({
  checkpoint, //eslint-disable-line
}: {
  checkpoint: ICheckPoint | undefined;
}) => {
  let isValid = true;
  const message = [];
  if (!checkpoint?.children || checkpoint.children.length === 0) {
    isValid = false;
    message.push('Missing options');
  }
  if (!checkpoint?.data || !checkpoint.data.max) {
    isValid = false;
    message.push('Missing number of vote need to win');
  }
  return {
    isValid,
    message,
  };
};

const displayDelayDuration = (duration: moment.Duration) => {
  const years = duration.years() === 0 ? '' : `${duration.years()} years `;
  const months = duration.months() === 0 ? '' : `${duration.months()} months `;
  const days = duration.days() === 0 ? '' : `${duration.days()} days `;
  const hours = duration.hours() === 0 ? '' : `${duration.hours()} hours `;
  const minutes =
    duration.minutes() === 0 ? '' : `${duration.minutes()} minutes `;
  const delay = years + months + days + hours + minutes;
  return delay ? 'Delay ' + delay : 'No delay';
};
