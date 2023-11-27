import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { AD1 as Interface } from './interface';

export namespace AD1 {
  export const getName = () => {
    return 'AD1';
  };

  export const getProgramAddress = () => {
    return 'AD1';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'AD1';
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
      max: 0,
      token: '',
      title: '',
      raw: '',
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
    if (!checkpoint?.data.max) {
      isValid = false;
      message.push('Missing number of vote need to win');
    }
    return {
      isValid,
      message,
    };
  };
}
