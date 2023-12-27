import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { Tally as Interface } from './interface';

export namespace Tally {
  export const getName = () => {
    return 'Tally';
  };

  export const getProgramAddress = () => {
    return 'Tally';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'Tally';
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

    if (!checkpoint?.data.fallback || !checkpoint.data.next) {
      isValid = false;
      message.push('Missing fallback or next checkpoint');
    }

    if (!checkpoint?.data.governor) {
      isValid = false;
      message.push('Missing governor contract');
    }

    if (!checkpoint?.data.token) {
      isValid = false;
      message.push('Missing token contract');
    }
    return {
      isValid,
      message,
    };
  };
}
