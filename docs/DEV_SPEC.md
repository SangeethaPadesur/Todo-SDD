# Development Specification Document
## TODO List Web Application

**Document Version:** 1.0  
**Date:** April 23, 2026  
**Phase:** 4 - Development Specification  
**Reference:** Architecture & Design v1.0

---

## 1. Overview

This document provides detailed development specifications for implementing the TODO List Web Application. It includes code templates, implementation guidelines, and step-by-step instructions for each component.

---

## 2. Development Environment Setup

### 2.1 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 18.x | Runtime environment |
| npm | >= 9.x | Package manager |
| VS Code | Latest | Recommended IDE |

### 2.2 Project Initialization

```bash
# Create project with Vite
npm create vite@latest todo-app -- --template react-ts

# Navigate to project
cd todo-app

# Install dependencies
npm install

# Install additional dependencies
npm install uuid
npm install -D @types/uuid
```

### 2.3 Project Configuration

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@context/*": ["src/context/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
});
```

---

## 3. Type Definitions

### 3.1 Task Types (src/types/task.types.ts)

```typescript
/**
 * Represents a single task in the TODO list
 */
export interface Task {
  /** Unique identifier (UUID v4) */
  id: string;
  /** Task title (1-100 characters) */
  title: string;
  /** Task description (0-500 characters) */
  description: string;
  /** Due date in ISO 8601 format (YYYY-MM-DD) */
  dueDate: string;
  /** Creation timestamp in ISO 8601 format */
  createdAt: string;
  /** Last update timestamp in ISO 8601 format */
  updatedAt: string;
}

/**
 * Form data for creating/editing a task
 */
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

/**
 * Validation errors for task form
 */
export interface TaskFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}
```

### 3.2 Modal Types (src/types/modal.types.ts)

```typescript
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
```

### 3.3 State Types (src/types/state.types.ts)

```typescript
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
```

---

## 4. Utility Functions

### 4.1 ID Generator (src/utils/idGenerator.ts)

```typescript
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier using UUID v4
 * @returns Unique string identifier
 */
export const generateId = (): string => {
  return uuidv4();
};
```

### 4.2 Date Utilities (src/utils/dateUtils.ts)

```typescript
/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Apr 23, 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Gets current ISO timestamp
 * @returns Current date/time in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Formats date for input[type="date"]
 * @param dateString - ISO date string
 * @returns Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
```

---

## 5. Service Layer Implementation

### 5.1 Storage Service (src/services/storageService.ts)

```typescript
import { Task } from '@/types/task.types';

const STORAGE_KEY = 'todo_tasks';

/**
 * Storage service for managing tasks in session storage
 */
export const storageService = {
  /**
   * Retrieves all tasks from session storage
   * @returns Array of tasks or empty array if none exist
   */
  getTasks(): Task[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return [];
    }
  },

  /**
   * Saves tasks array to session storage
   * @param tasks - Array of tasks to save
   * @throws Error if storage operation fails
   */
  saveTasks(tasks: Task[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to session storage:', error);
      throw new Error('Failed to save tasks. Storage may be full.');
    }
  },

  /**
   * Clears all tasks from session storage
   */
  clearTasks(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Checks if session storage is available
   * @returns Boolean indicating storage availability
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
};
```

### 5.2 Validation Service (src/services/validationService.ts)

```typescript
import { TaskFormData, TaskFormErrors } from '@/types/task.types';

/**
 * Validation constants
 */
const VALIDATION_RULES = {
  title: {
    maxLength: 100,
    minLength: 1,
  },
  description: {
    maxLength: 500,
  },
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: TaskFormErrors;
}

/**
 * Validation service for task form data
 */
export const validationService = {
  /**
   * Validates task form data
   * @param data - Form data to validate
   * @returns Validation result with errors if any
   */
  validateTaskForm(data: TaskFormData): ValidationResult {
    const errors: TaskFormErrors = {};

    // Title validation
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.trim().length > VALIDATION_RULES.title.maxLength) {
      errors.title = `Title must be ${VALIDATION_RULES.title.maxLength} characters or less`;
    }

    // Description validation (optional field)
    if (data.description && data.description.length > VALIDATION_RULES.description.maxLength) {
      errors.description = `Description must be ${VALIDATION_RULES.description.maxLength} characters or less`;
    }

    // Due date validation
    if (!data.dueDate) {
      errors.dueDate = 'Due date is required';
    } else if (!this.isValidDate(data.dueDate)) {
      errors.dueDate = 'Please enter a valid date';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validates a date string
   * @param dateString - Date string to validate
   * @returns Boolean indicating if date is valid
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Validates a single field
   * @param field - Field name
   * @param value - Field value
   * @returns Error message or undefined
   */
  validateField(field: keyof TaskFormData, value: string): string | undefined {
    const data: TaskFormData = {
      title: field === 'title' ? value : 'valid',
      description: field === 'description' ? value : '',
      dueDate: field === 'dueDate' ? value : '2026-01-01',
    };
    const result = this.validateTaskForm(data);
    return result.errors[field];
  },
};
```

---

## 6. Context & State Management

### 6.1 Task Context (src/context/TaskContext.tsx)

```typescript
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
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
```

---

## 7. Component Implementation

### 7.1 App Component (src/App.tsx)

```typescript
import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import { Dashboard } from '@/components/Dashboard';
import './App.css';

/**
 * Root application component
 */
function App(): React.ReactElement {
  return (
    <TaskProvider>
      <div className="app">
        <Dashboard />
      </div>
    </TaskProvider>
  );
}

export default App;
```

### 7.2 Dashboard Component (src/components/Dashboard/Dashboard.tsx)

```typescript
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskList } from '@/components/TaskList';
import { TaskModal } from '@/components/TaskModal';
import { Button } from '@/components/common/Button';
import styles from './Dashboard.module.css';

/**
 * Main dashboard component
 */
export function Dashboard(): React.ReactElement {
  const { state, openCreateModal } = useTaskContext();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to TODO list</h1>
      </header>

      <div className={styles.actions}>
        <Button onClick={openCreateModal} variant="primary">
          Create Task
        </Button>
      </div>

      <main className={styles.content}>
        {state.isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <TaskList tasks={state.tasks} />
        )}
      </main>

      <TaskModal />
    </div>
  );
}
```

### 7.3 TaskList Component (src/components/TaskList/TaskList.tsx)

```typescript
import React from 'react';
import { Task } from '@/types/task.types';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
}

/**
 * Renders list of tasks or empty state
 */
export function TaskList({ tasks }: TaskListProps): React.ReactElement {
  if (tasks.length === 0) {
    return <EmptyState message="No tasks" />;
  }

  return (
    <ul className={styles.taskList} role="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

### 7.4 TaskItem Component (src/components/TaskItem/TaskItem.tsx)

```typescript
import React from 'react';
import { Task } from '@/types/task.types';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/dateUtils';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
}

/**
 * Individual task item component
 */
export function TaskItem({ task }: TaskItemProps): React.ReactElement {
  const { openEditModal, deleteTask } = useTaskContext();

  const handleEdit = (): void => {
    openEditModal(task.id);
  };

  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <li className={styles.taskItem} role="listitem">
      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        <span className={styles.taskDueDate}>
          Due: {formatDate(task.dueDate)}
        </span>
      </div>
      <div className={styles.taskActions}>
        <Button onClick={handleEdit} variant="secondary" size="small">
          Edit
        </Button>
        <Button onClick={handleDelete} variant="danger" size="small">
          Delete
        </Button>
      </div>
    </li>
  );
}
```

### 7.5 TaskModal Component (src/components/TaskModal/TaskModal.tsx)

```typescript
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskFormData, TaskFormErrors } from '@/types/task.types';
import { validationService } from '@/services/validationService';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import styles from './TaskModal.module.css';

/**
 * Initial form state
 */
const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
};

/**
 * Task create/edit modal component
 */
export function TaskModal(): React.ReactElement | null {
  const { state, addTask, updateTask, closeModal, getTaskById } = useTaskContext();
  const { modal } = state;

  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (modal.isOpen && modal.mode === 'edit' && modal.editingTaskId) {
      const task = getTaskById(modal.editingTaskId);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        });
      }
    } else if (modal.isOpen && modal.mode === 'create') {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [modal.isOpen, modal.mode, modal.editingTaskId, getTaskById]);

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TaskFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const validation = validationService.validateTaskForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (modal.mode === 'create') {
      addTask(formData);
    } else if (modal.editingTaskId) {
      updateTask(modal.editingTaskId, formData);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = (): void => {
    setFormData(initialFormData);
    setErrors({});
    closeModal();
  };

  if (!modal.isOpen) {
    return null;
  }

  const modalTitle = modal.mode === 'create' ? 'Create Task' : 'Edit Task';

  return (
    <Modal isOpen={modal.isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          maxLength={100}
          placeholder="Enter task title"
        />

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            maxLength={500}
            placeholder="Enter task description (optional)"
            rows={4}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### 7.6 EmptyState Component (src/components/EmptyState/EmptyState.tsx)

```typescript
import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message?: string;
}

/**
 * Empty state component displayed when no tasks exist
 */
export function EmptyState({ message = 'No tasks' }: EmptyStateProps): React.ReactElement {
  return (
    <div className={styles.emptyState}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
```

---

## 8. Common Components

### 8.1 Button Component (src/components/common/Button/Button.tsx)

```typescript
import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

/**
 * Reusable button component
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}: ButtonProps): React.ReactElement {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
```

### 8.2 Modal Component (src/components/common/Modal/Modal.tsx)

```typescript
import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Reusable modal component
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps): React.ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
```

### 8.3 Input Component (src/components/common/Input/Input.tsx)

```typescript
import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Reusable input component with label and error handling
 */
export function Input({
  label,
  error,
  id,
  name,
  required,
  ...props
}: InputProps): React.ReactElement {
  const inputId = id || name;

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        id={inputId}
        name={name}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

---

## 9. Styling

### 9.1 Global Styles (src/styles/globals.css)

```css
/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, textarea {
  font-family: inherit;
  font-size: inherit;
}
```

### 9.2 CSS Variables (src/styles/variables.css)

```css
:root {
  /* Colors */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-secondary: #6B7280;
  --color-secondary-hover: #4B5563;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-danger-hover: #DC2626;
  
  /* Background Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-overlay: rgba(0, 0, 0, 0.5);
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --text-white: #FFFFFF;
  
  /* Border */
  --border-color: #E5E7EB;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  
  /* Layout */
  --max-width: 800px;
  --modal-width: 500px;
}
```

---

## 10. Implementation Checklist

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Project setup with Vite + React + TypeScript | High | ☐ |
| 2 | Configure path aliases | Medium | ☐ |
| 3 | Create type definitions | High | ☐ |
| 4 | Implement utility functions | High | ☐ |
| 5 | Implement storage service | High | ☐ |
| 6 | Implement validation service | High | ☐ |
| 7 | Create TaskContext and provider | High | ☐ |
| 8 | Create common Button component | Medium | ☐ |
| 9 | Create common Modal component | High | ☐ |
| 10 | Create common Input component | Medium | ☐ |
| 11 | Create EmptyState component | Low | ☐ |
| 12 | Create TaskItem component | High | ☐ |
| 13 | Create TaskList component | High | ☐ |
| 14 | Create TaskModal component | High | ☐ |
| 15 | Create Dashboard component | High | ☐ |
| 16 | Create App component | High | ☐ |
| 17 | Add global styles and CSS variables | Medium | ☐ |
| 18 | Test all functionality | High | ☐ |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-23 | AI Generated | Initial Development Specification |

---

*This document provides implementation details for Phase 5: Implementation & Deploy*
