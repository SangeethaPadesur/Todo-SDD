import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskFormData } from '@/types/task.types';
import { AppState, TaskAction } from '@/types/state.types';
import { storageService } from '@/services/storageService';
import { generateId } from '@/utils/idGenerator';
import { getCurrentTimestamp } from '@/utils/dateUtils';

/**
 * Initial state
 */
const initialState: AppState = {
  tasks: [],
  modal: {
    isOpen: false,
    mode: 'create',
    editingTaskId: null,
  },
  isLoading: true,
  error: null,
};

/**
 * Task reducer function
 */
function taskReducer(state: AppState, action: TaskAction): AppState {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, isLoading: false };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case 'OPEN_CREATE_MODAL':
      return {
        ...state,
        modal: { isOpen: true, mode: 'create', editingTaskId: null },
      };

    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        modal: { isOpen: true, mode: 'edit', editingTaskId: action.payload },
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: { isOpen: false, mode: 'create', editingTaskId: null },
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

/**
 * Context value interface
 */
interface TaskContextValue {
  state: AppState;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  openCreateModal: () => void;
  openEditModal: (id: string) => void;
  closeModal: () => void;
  getTaskById: (id: string) => Task | undefined;
}

/**
 * Create context
 */
const TaskContext = createContext<TaskContextValue | undefined>(undefined);

/**
 * Task Provider component
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from storage on mount
  useEffect(() => {
    const tasks = storageService.getTasks();
    dispatch({ type: 'LOAD_TASKS', payload: tasks });
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      storageService.saveTasks(state.tasks);
    }
  }, [state.tasks, state.isLoading]);

  /**
   * Add a new task
   */
  const addTask = (data: TaskFormData): void => {
    const timestamp = getCurrentTimestamp();
    const newTask: Task = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      dueDate: data.dueDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    dispatch({ type: 'CLOSE_MODAL' });
  };

  /**
   * Update an existing task
   */
  const updateTask = (id: string, data: TaskFormData): void => {
    const existingTask = state.tasks.find((t) => t.id === id);
    if (!existingTask) return;

    const updatedTask: Task = {
      ...existingTask,
      title: data.title.trim(),
      description: data.description.trim(),
      dueDate: data.dueDate,
      updatedAt: getCurrentTimestamp(),
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    dispatch({ type: 'CLOSE_MODAL' });
  };

  /**
   * Delete a task
   */
  const deleteTask = (id: string): void => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  /**
   * Open create modal
   */
  const openCreateModal = (): void => {
    dispatch({ type: 'OPEN_CREATE_MODAL' });
  };

  /**
   * Open edit modal
   */
  const openEditModal = (id: string): void => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: id });
  };

  /**
   * Close modal
   */
  const closeModal = (): void => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  /**
   * Get task by ID
   */
  const getTaskById = (id: string): Task | undefined => {
    return state.tasks.find((task) => task.id === id);
  };

  const value: TaskContextValue = {
    state,
    addTask,
    updateTask,
    deleteTask,
    openCreateModal,
    openEditModal,
    closeModal,
    getTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/**
 * Custom hook to use task context
 */
export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
