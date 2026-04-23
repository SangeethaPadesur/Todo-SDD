import { Task } from './task.types';
import { ModalState } from './modal.types';

/**
 * Application state interface
 */
export interface AppState {
  /** Array of all tasks */
  tasks: Task[];
  /** Modal state */
  modal: ModalState;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

/**
 * Action types for reducer
 */
export type TaskAction =
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'OPEN_CREATE_MODAL' }
  | { type: 'OPEN_EDIT_MODAL'; payload: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
