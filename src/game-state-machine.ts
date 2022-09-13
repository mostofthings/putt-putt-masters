import { StateMachine } from './core/state-machine';
import { State } from './core/state';

let gameStateMachineRef: { value?: StateMachine } = {};

export function getGameStateMachine(): StateMachine {
  return gameStateMachineRef.value!;
}

export function createGameStateMachine(initialState: State, ...args: any[]) {
  gameStateMachineRef.value = new StateMachine(initialState, ...args);
}
