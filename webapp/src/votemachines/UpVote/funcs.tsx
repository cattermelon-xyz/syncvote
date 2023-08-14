import { LikeOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { UpVote as Interface } from './interface';
import { ICheckPoint, IVoteMachineGetLabelProps } from '@types';

export namespace UpVote {
  export const deleteChildNode = (
    data: Interface.IData,
    children: string[],
    childId: string
  ) => {
    //eslint-disable-line
    const result = structuredClone(data);
    if (childId === data.pass) {
      delete result.pass;
    } else if (childId === data.fallback) {
      delete result.fallback;
    }
    return result;
  };

  export const getProgramAddress = () => {
    return 'UpVote';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'UpVote';
  };

  export const getName = () => {
    return 'Up Vote';
  };

  export const getLabel = (props: IVoteMachineGetLabelProps) => {
    const { source, target } = props;
    return source?.data.pass === target?.id ? (
      <span>Passed</span>
    ) : (
      <span>Failed to reach unanimous</span>
    );
  };

  export const getIcon = () => {
    return <LikeOutlined />;
  };

  export const getInitialData = () => {
    const data: Interface.IData = {
      pass: '',
      fallback: '',
      token: '',
      threshold: 0,
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
    if (!checkpoint?.data.threshold) {
      isValid = false;
      message.push('Missing number of vote need to win');
    }
    if (!checkpoint?.data.pass || !checkpoint?.data.fallback) {
      isValid = false;
      message.push('Missing pass or fallback option');
    }
    return {
      isValid,
      message,
    };
  };
}
