import { DislikeOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { Veto as Interface } from './interface';
import { ICheckPoint, IVoteMachineGetLabelProps } from '@types';

export namespace Veto {
  export const deleteChildNode = (
    data: Interface.IVeto,
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
    return 'Veto';
  };

  /**
   * Providing both getType and getProgramAddress enables the same program with different views
   * @returns Type of the voting machine
   */
  export const getType = () => {
    return 'Veto';
  };

  export const getName = () => {
    return 'Veto Vote';
  };

  export const getLabel = (props: IVoteMachineGetLabelProps) => {
    const { source, target } = props;
    return source?.data.pass === target?.id ? (
      <span>Pass</span>
    ) : (
      <span>Fail</span>
    );
  };

  export const getIcon = () => {
    return <DislikeOutlined />;
  };

  export const getInitialData = () => {
    const data: Interface.IVeto = {
      pass: '',
      fallback: '',
      token: '',
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
    if (!checkpoint?.quorum) {
      isValid = false;
      message.push('Missing quorum');
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
