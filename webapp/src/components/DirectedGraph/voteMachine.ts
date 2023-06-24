import { IVoteMachine } from '../../types';

const machines:any = {};
export const registerVoteMachine = (machine:IVoteMachine) => {
  machines[machine.getType()] = machine;
};

export const getVoteMachine = (name:string) => {
  return machines[name];
};

export const getAllVoteMachines = () => {
  return machines;
};
