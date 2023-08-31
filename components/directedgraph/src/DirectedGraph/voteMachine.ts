import { IVoteMachine } from './interface';

type Machines = {
  [key: string]: IVoteMachine;
};

const machines: Machines = {};
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
