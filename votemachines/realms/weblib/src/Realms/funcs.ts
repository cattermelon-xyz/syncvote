import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { Realms as Interface } from './interface';

export namespace Realms {
  export const getName = () => {
    return 'Realms';
  };

  export const getProgramAddress = () => {
    return 'Realms';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'Realms';
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

    if (!checkpoint?.data.realms) {
      isValid = false;
      message.push('Missing realms address');
    }

    if (!checkpoint?.data.governance_program) {
      isValid = false;
      message.push('Missing governance_program address');
    }

    if (!checkpoint?.data.proposalId) {
      isValid = false;
      message.push('Missing variable to store proposal ID');
    }

    if (!checkpoint?.data.proposal_mint) {
      isValid = false;
      message.push('Missing proposal mint address');
    }
    return {
      isValid,
      message,
    };
  };
}
