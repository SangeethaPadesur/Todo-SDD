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
