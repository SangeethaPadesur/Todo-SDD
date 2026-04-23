import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { Task } from '../../types/task.types';

describe('storageService', () => {
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-04-25',
    createdAt: '2026-04-23T10:00:00.000Z',
    updatedAt: '2026-04-23T10:00:00.000Z',
  };

  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = storageService.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should return tasks from session storage', () => {
      sessionStorage.setItem('todo_tasks', JSON.stringify([mockTask]));
      
      const tasks = storageService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual(mockTask);
    });
  });

  describe('saveTasks', () => {
    it('should save tasks to session storage', () => {
      storageService.saveTasks([mockTask]);
      
      const stored = sessionStorage.getItem('todo_tasks');
      expect(stored).toBe(JSON.stringify([mockTask]));
    });

    it('should save empty array', () => {
      storageService.saveTasks([]);
      
      const stored = sessionStorage.getItem('todo_tasks');
      expect(stored).toBe('[]');
    });
  });

  describe('clearTasks', () => {
    it('should remove tasks from session storage', () => {
      sessionStorage.setItem('todo_tasks', JSON.stringify([mockTask]));
      
      storageService.clearTasks();
      
      expect(sessionStorage.getItem('todo_tasks')).toBeNull();
    });
  });

  describe('isAvailable', () => {
    it('should return true when storage is available', () => {
      expect(storageService.isAvailable()).toBe(true);
    });
  });
});
