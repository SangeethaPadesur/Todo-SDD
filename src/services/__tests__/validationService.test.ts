import { describe, it, expect } from 'vitest';
import { validationService } from '../validationService';
import { TaskFormData } from '../../types/task.types';

describe('validationService', () => {
  const validFormData: TaskFormData = {
    title: 'Valid Title',
    description: 'Valid Description',
    dueDate: '2026-04-25',
  };

  describe('validateTaskForm', () => {
    describe('title validation', () => {
      it('should pass with valid title', () => {
        const result = validationService.validateTaskForm(validFormData);
        expect(result.isValid).toBe(true);
        expect(result.errors.title).toBeUndefined();
      });

      it('should fail when title is empty', () => {
        const data = { ...validFormData, title: '' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBe('Title is required');
      });

      it('should fail when title is only whitespace', () => {
        const data = { ...validFormData, title: '   ' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBe('Title is required');
      });

      it('should fail when title exceeds 100 characters', () => {
        const data = { ...validFormData, title: 'a'.repeat(101) };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBe('Title must be 100 characters or less');
      });
    });

    describe('description validation', () => {
      it('should pass with empty description', () => {
        const data = { ...validFormData, description: '' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
        expect(result.errors.description).toBeUndefined();
      });

      it('should fail when description exceeds 500 characters', () => {
        const data = { ...validFormData, description: 'a'.repeat(501) };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.description).toBe('Description must be 500 characters or less');
      });
    });

    describe('dueDate validation', () => {
      it('should pass with valid date', () => {
        const result = validationService.validateTaskForm(validFormData);
        expect(result.errors.dueDate).toBeUndefined();
      });

      it('should fail when dueDate is empty', () => {
        const data = { ...validFormData, dueDate: '' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.dueDate).toBe('Due date is required');
      });

      it('should fail with invalid date format', () => {
        const data = { ...validFormData, dueDate: 'invalid-date' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.dueDate).toBe('Please enter a valid date');
      });
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date string', () => {
      expect(validationService.isValidDate('2026-04-25')).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(validationService.isValidDate('invalid')).toBe(false);
    });
  });
});
