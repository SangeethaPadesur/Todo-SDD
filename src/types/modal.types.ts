/**
 * Modal operation mode
 */
export type ModalMode = 'create' | 'edit';

/**
 * Modal state interface
 */
export interface ModalState {
  /** Whether modal is currently open */
  isOpen: boolean;
  /** Current operation mode */
  mode: ModalMode;
  /** ID of task being edited (null for create mode) */
  editingTaskId: string | null;
}
