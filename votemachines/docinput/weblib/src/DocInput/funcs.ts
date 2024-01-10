import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { DocInput as Interface } from './interface';
import moment from 'moment';

export namespace DocInput {
  export const getName = () => {
    return 'Document Input';
  };

  export const getProgramAddress = () => {
    return 'DocInput';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'DocInput';
  };

  export const deleteChildNode = (
    data: Interface.IData,
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
    const data: Interface.IData = {
      options: [],
      docs: [],
      variables: [],
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
    return {
      isValid,
      message,
    };
  };
}

export const getTimeRemainingToEnd = (endToVote: string) => {
  const now = moment.utc();
  const end = moment.utc(endToVote);
  const duration = moment.duration(end.diff(now));
  if (duration.asMilliseconds() <= 0) {
    return 'expired';
  }
  return duration.humanize(true);
};
