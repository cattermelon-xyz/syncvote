import { IVoteMachine } from './interface';
import ForkNode from './VoteMachines/ForkNode';
import JoinNode from './VoteMachines/JoinNode';

type Machines = {
  [key: string]: IVoteMachine;
};

const machines: Machines = {
  forkNode: ForkNode,
  joinNode: JoinNode,
};
export const registerVoteMachine = (machine: IVoteMachine) => {
  machines[machine.getType()] = machine;
};

export const getVoteMachine = (name: string | undefined) => {
  if (!name || !machines[name]) {
    return undefined;
  }
  return machines[name];
};

export const getAllVoteMachines = () => {
  return machines;
};
