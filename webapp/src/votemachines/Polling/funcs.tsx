import { CheckSquareOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { Polling as Interface } from './interface';
import { IVoteMachineGetLabelProps } from '@types';

export namespace Polling {
  export const deleteChildNode = (
    data: Interface.IData,
    children: string[],
    childId: string
  ) => {
    //eslint-disable-line
    const result = structuredClone(data);
    if (childId === data.next) {
      delete result.next;
    } else if (childId === data.fallback) {
      delete result.fallback;
    }
    return result;
  };

  export const getProgramAddress = () => {
    return 'Polling';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'MultipleChoiceRaceToMax';
  };

  export const getName = () => {
    return 'Polling';
  };

  export const getLabel = (props: IVoteMachineGetLabelProps) => {
    // label = source?.data.next === target?.id ? 'Next' : 'Fallback';
    const { source, target } = props;
    return source?.data.next === target?.id ? (
      <span>Next</span>
    ) : (
      <span>Fallback</span>
    );
  };

  export const getIcon = () => {
    return <CheckSquareOutlined />;
  };

  export const getInitialData = () => {
    const data: Interface.IData = {
      options: [],
      max: undefined,
      next: '',
      fallback: '',
      upTo: 0,
      token: '',
    };
    return data;
  };
}
