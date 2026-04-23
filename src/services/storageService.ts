import { Task } from '../types/task.types';

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
