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
