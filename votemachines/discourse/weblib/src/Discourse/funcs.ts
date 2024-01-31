import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { Discourse as Interface } from './interface';

export namespace Discourse {
  export const getName = () => {
    return 'Discourse';
  };

  export const getProgramAddress = () => {
    return 'Discourse';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'Discourse';
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
      action: '',
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
    // if (!checkpoint?.data || !checkpoint.data.max) {
    if (!checkpoint?.data.action) {
      isValid = false;
      message.push('Missing action of vote in discourse');
    }
    if (!checkpoint?.data.variables) {
      isValid = false;
      message.push('Missing variables to save topic id discourse');
    }
    return {
      isValid,
      message,
    };
  };
}
