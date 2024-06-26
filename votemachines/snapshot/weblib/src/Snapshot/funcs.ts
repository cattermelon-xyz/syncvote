import { ICheckPoint } from 'directed-graph';
// import { IData } from './interface';
import { Snapshot as Interface } from './interface';

export namespace Snapshot {
  export const getName = () => {
    return 'Snapshot';
  };

  export const getProgramAddress = () => {
    return 'Snapshot';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'Snapshot';
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
      snapShotOption: [],
      space: '',
      action: 'create-proposal',
      type: 'single-choice',
      proposalId: '',
      template: '',
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
    if (!checkpoint?.data.type) {
      isValid = false;
      message.push('Missing type of vote in snapshot');
    }

    if (!checkpoint?.data.space) {
      isValid = false;
      message.push('Missing space of snapshot');
    }

    if (!checkpoint?.data.action) {
      isValid = false;
      message.push('Missing action for snapshot checkpoint');
    }

    if (checkpoint?.data.action === 'create-proposal') {
      if (!checkpoint.data.proposalId) {
        isValid = false;
        message.push('Missiong variable to store proposalId');
      }

      if (!checkpoint?.data.fallback || !checkpoint.data.next) {
        isValid = false;
        message.push('Missing fallback or next checkpoint');
      }

      if (!checkpoint?.children || checkpoint.children.length === 0) {
        isValid = false;
        message.push('Missing options');
      }

      if (!checkpoint?.data.snapshotDuration) {
        isValid = false;
        message.push('Missing duration for Snapshot proposal');
      }
    } else {
      if (!checkpoint?.data.snapshotIdToSync) {
        isValid = false;
        message.push('Missing checkpoint snapshot parent');
      }

      const snapshotOption = checkpoint?.data?.snapShotOption
        ? checkpoint?.data?.snapShotOption
        : [];

      if (
        !checkpoint?.children ||
        checkpoint.children.length === 0 ||
        checkpoint.children.length !== snapshotOption.length + 1
      ) {
        isValid = false;
        message.push('Missing children checkpoint for option');
      }

      if (!checkpoint?.data.fallback) {
        isValid = false;
        message.push('Missing fallback checkpoint');
      }
    }

    return {
      isValid,
      message,
    };
  };
}
