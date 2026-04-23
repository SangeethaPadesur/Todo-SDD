# Test Specification Document
## TODO List Web Application

**Document Version:** 1.0  
**Date:** April 23, 2026  
**Phase:** 4 - Test Specification  
**Reference:** Engineering Requirements v1.0, Architecture & Design v1.0

---

## 1. Overview

This document defines the comprehensive test strategy, test cases, and testing guidelines for the TODO List Web Application. It covers unit tests, integration tests, and end-to-end test scenarios.

---

## 2. Test Strategy

### 2.1 Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │  (10%)
                    │  Tests  │
                   ─┴─────────┴─
                  ┌─────────────┐
                  │ Integration │  (20%)
                  │    Tests    │
                 ─┴─────────────┴─
                ┌─────────────────┐
                │   Unit Tests    │  (70%)
                │                 │
               ─┴─────────────────┴─
```

### 2.2 Test Coverage Targets

| Category | Target Coverage | Priority |
|----------|-----------------|----------|
| Services | 100% | Critical |
| Utilities | 100% | Critical |
| Hooks | 90% | High |
| Components | 80% | High |
| Integration | Key flows | Medium |
| E2E | Critical paths | Medium |

### 2.3 Testing Tools

| Tool | Purpose | Version |
|------|---------|---------|
| Vitest | Unit & Integration testing | ^1.0.0 |
| React Testing Library | Component testing | ^14.0.0 |
| jsdom | DOM simulation | ^22.0.0 |
| MSW | API mocking (if needed) | ^2.0.0 |
| Playwright | E2E testing | ^1.40.0 |

---

## 3. Test Environment Setup

### 3.1 Installation

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install E2E testing
npm install -D @playwright/test
```

### 3.2 Vitest Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3.3 Test Setup File (src/test/setup.ts)

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Reset mocks before each test
beforeEach(() => {
  sessionStorageMock.clear();
  vi.clearAllMocks();
});
```

---

## 4. Unit Tests

### 4.1 Utility Functions Tests

#### 4.1.1 ID Generator Tests (src/utils/__tests__/idGenerator.test.ts)

```typescript
import { describe, it, expect } from 'vitest';
import { generateId } from '../idGenerator';

describe('generateId', () => {
  it('should generate a valid UUID string', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs on each call', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();
    
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it('should generate 1000 unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(1000);
  });
});
```

#### 4.1.2 Date Utilities Tests (src/utils/__tests__/dateUtils.test.ts)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, getCurrentTimestamp, formatDateForInput, getTodayDate } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format ISO date string to readable format', () => {
      const result = formatDate('2026-04-23');
      expect(result).toBe('Apr 23, 2026');
    });

    it('should handle full ISO timestamp', () => {
      const result = formatDate('2026-04-23T10:30:00.000Z');
      expect(result).toContain('Apr');
      expect(result).toContain('2026');
    });

    it('should handle different months correctly', () => {
      expect(formatDate('2026-01-15')).toBe('Jan 15, 2026');
      expect(formatDate('2026-12-25')).toBe('Dec 25, 2026');
    });
  });

  describe('getCurrentTimestamp', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return current ISO timestamp', () => {
      const mockDate = new Date('2026-04-23T10:30:00.000Z');
      vi.setSystemTime(mockDate);
      
      const result = getCurrentTimestamp();
      expect(result).toBe('2026-04-23T10:30:00.000Z');
    });
  });

  describe('formatDateForInput', () => {
    it('should format date for HTML date input', () => {
      const result = formatDateForInput('2026-04-23T10:30:00.000Z');
      expect(result).toBe('2026-04-23');
    });

    it('should handle date-only string', () => {
      const result = formatDateForInput('2026-04-23');
      expect(result).toBe('2026-04-23');
    });
  });

  describe('getTodayDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return today date in YYYY-MM-DD format', () => {
      vi.setSystemTime(new Date('2026-04-23T10:30:00.000Z'));
      
      const result = getTodayDate();
      expect(result).toBe('2026-04-23');
    });
  });
});
```

### 4.2 Service Tests

#### 4.2.1 Storage Service Tests (src/services/__tests__/storageService.test.ts)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { Task } from '@/types/task.types';

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

    it('should return empty array on parse error', () => {
      sessionStorage.setItem('todo_tasks', 'invalid json');
      
      const tasks = storageService.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should handle multiple tasks', () => {
      const tasks = [mockTask, { ...mockTask, id: '456', title: 'Task 2' }];
      sessionStorage.setItem('todo_tasks', JSON.stringify(tasks));
      
      const result = storageService.getTasks();
      expect(result).toHaveLength(2);
    });
  });

  describe('saveTasks', () => {
    it('should save tasks to session storage', () => {
      storageService.saveTasks([mockTask]);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'todo_tasks',
        JSON.stringify([mockTask])
      );
    });

    it('should save empty array', () => {
      storageService.saveTasks([]);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'todo_tasks',
        '[]'
      );
    });

    it('should throw error when storage fails', () => {
      vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      expect(() => storageService.saveTasks([mockTask])).toThrow('Failed to save tasks');
    });
  });

  describe('clearTasks', () => {
    it('should remove tasks from session storage', () => {
      sessionStorage.setItem('todo_tasks', JSON.stringify([mockTask]));
      
      storageService.clearTasks();
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('todo_tasks');
    });
  });

  describe('isAvailable', () => {
    it('should return true when storage is available', () => {
      expect(storageService.isAvailable()).toBe(true);
    });

    it('should return false when storage throws error', () => {
      vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      
      expect(storageService.isAvailable()).toBe(false);
    });
  });
});
```

#### 4.2.2 Validation Service Tests (src/services/__tests__/validationService.test.ts)

```typescript
import { describe, it, expect } from 'vitest';
import { validationService } from '../validationService';
import { TaskFormData } from '@/types/task.types';

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

      it('should pass with exactly 100 characters', () => {
        const data = { ...validFormData, title: 'a'.repeat(100) };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
        expect(result.errors.title).toBeUndefined();
      });

      it('should pass with 1 character title', () => {
        const data = { ...validFormData, title: 'a' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
      });
    });

    describe('description validation', () => {
      it('should pass with empty description', () => {
        const data = { ...validFormData, description: '' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
        expect(result.errors.description).toBeUndefined();
      });

      it('should pass with valid description', () => {
        const result = validationService.validateTaskForm(validFormData);
        expect(result.errors.description).toBeUndefined();
      });

      it('should fail when description exceeds 500 characters', () => {
        const data = { ...validFormData, description: 'a'.repeat(501) };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.description).toBe('Description must be 500 characters or less');
      });

      it('should pass with exactly 500 characters', () => {
        const data = { ...validFormData, description: 'a'.repeat(500) };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
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

      it('should pass with ISO date format', () => {
        const data = { ...validFormData, dueDate: '2026-04-25T00:00:00.000Z' };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(true);
      });
    });

    describe('multiple errors', () => {
      it('should return all errors when multiple fields are invalid', () => {
        const data: TaskFormData = {
          title: '',
          description: 'a'.repeat(501),
          dueDate: '',
        };
        const result = validationService.validateTaskForm(data);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBeDefined();
        expect(result.errors.description).toBeDefined();
        expect(result.errors.dueDate).toBeDefined();
      });
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date string', () => {
      expect(validationService.isValidDate('2026-04-25')).toBe(true);
    });

    it('should return true for ISO timestamp', () => {
      expect(validationService.isValidDate('2026-04-25T10:30:00.000Z')).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(validationService.isValidDate('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validationService.isValidDate('')).toBe(false);
    });
  });

  describe('validateField', () => {
    it('should validate single field - title', () => {
      const error = validationService.validateField('title', '');
      expect(error).toBe('Title is required');
    });

    it('should return undefined for valid field', () => {
      const error = validationService.validateField('title', 'Valid Title');
      expect(error).toBeUndefined();
    });
  });
});
```

### 4.3 Component Tests

#### 4.3.1 Button Component Tests (src/components/common/Button/__tests__/Button.test.tsx)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('should apply secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('should apply danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('danger');
  });

  it('should apply medium size by default', () => {
    render(<Button>Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('medium');
  });

  it('should apply small size', () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('small');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should pass through additional props', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>);
    expect(screen.getByTestId('custom-button')).toHaveAttribute('type', 'submit');
  });
});
```

#### 4.3.2 Input Component Tests (src/components/common/Input/__tests__/Input.test.tsx)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Username" name="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input label="Title" name="title" error="Title is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
  });

  it('should have aria-invalid when error exists', () => {
    render(<Input label="Title" name="title" error="Error" />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" name="name" onChange={handleChange} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply error styling when error exists', () => {
    render(<Input label="Title" name="title" error="Error" />);
    expect(screen.getByLabelText('Title')).toHaveClass('inputError');
  });

  it('should use name as id when id not provided', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  });

  it('should use provided id over name', () => {
    render(<Input label="Email" name="email" id="custom-id" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'custom-id');
  });
});
```

#### 4.3.3 Modal Component Tests (src/components/common/Modal/__tests__/Modal.test.tsx)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  it('should render when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display title', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should display children content', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have correct ARIA attributes', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
```

#### 4.3.4 EmptyState Component Tests (src/components/EmptyState/__tests__/EmptyState.test.tsx)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
```

#### 4.3.5 TaskItem Component Tests (src/components/TaskItem/__tests__/TaskItem.test.tsx)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '../TaskItem';
import { Task } from '@/types/task.types';

// Mock the context
const mockOpenEditModal = vi.fn();
const mockDeleteTask = vi.fn();

vi.mock('@/context/TaskContext', () => ({
  useTaskContext: () => ({
    openEditModal: mockOpenEditModal,
    deleteTask: mockDeleteTask,
  }),
}));

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-04-25',
    createdAt: '2026-04-23T10:00:00.000Z',
    updatedAt: '2026-04-23T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('should render task title', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render formatted due date', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/Apr 25, 2026/)).toBeInTheDocument();
  });

  it('should not render description when empty', () => {
    const taskWithoutDesc = { ...mockTask, description: '' };
    render(<TaskItem task={taskWithoutDesc} />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should call openEditModal when Edit button is clicked', () => {
    render(<TaskItem task={mockTask} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOpenEditModal).toHaveBeenCalledWith('123');
  });

  it('should call deleteTask when Delete is confirmed', () => {
    render(<TaskItem task={mockTask} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDeleteTask).toHaveBeenCalledWith('123');
  });

  it('should not call deleteTask when Delete is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<TaskItem task={mockTask} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it('should have listitem role', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});
```

#### 4.3.6 TaskList Component Tests (src/components/TaskList/__tests__/TaskList.test.tsx)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from '../TaskList';
import { Task } from '@/types/task.types';

// Mock TaskItem component
vi.mock('@/components/TaskItem', () => ({
  TaskItem: ({ task }: { task: Task }) => (
    <li data-testid={`task-${task.id}`}>{task.title}</li>
  ),
}));

// Mock EmptyState component
vi.mock('@/components/EmptyState', () => ({
  EmptyState: ({ message }: { message: string }) => (
    <div data-testid="empty-state">{message}</div>
  ),
}));

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2026-04-25',
      createdAt: '2026-04-23T10:00:00.000Z',
      updatedAt: '2026-04-23T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2026-04-26',
      createdAt: '2026-04-23T11:00:00.000Z',
      updatedAt: '2026-04-23T11:00:00.000Z',
    },
  ];

  it('should render EmptyState when tasks array is empty', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks');
  });

  it('should render task items when tasks exist', () => {
    render(<TaskList tasks={mockTasks} />);
    
    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  });

  it('should render correct number of tasks', () => {
    render(<TaskList tasks={mockTasks} />);
    
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should have list role', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
```

---

## 5. Integration Tests

### 5.1 Task Context Integration Tests (src/context/__tests__/TaskContext.integration.test.tsx)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../TaskContext';
import { storageService } from '@/services/storageService';

// Test component that uses the context
function TestComponent() {
  const { state, addTask, updateTask, deleteTask, openCreateModal, closeModal } = useTaskContext();
  
  return (
    <div>
      <div data-testid="task-count">{state.tasks.length}</div>
      <div data-testid="modal-open">{state.modal.isOpen.toString()}</div>
      <div data-testid="modal-mode">{state.modal.mode}</div>
      <button onClick={openCreateModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
      <button onClick={() => addTask({ title: 'New Task', description: '', dueDate: '2026-04-25' })}>
        Add Task
      </button>
      {state.tasks.map((task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          <span>{task.title}</span>
          <button onClick={() => updateTask(task.id, { ...task, title: 'Updated' })}>
            Update
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

describe('TaskContext Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should load tasks from storage on mount', async () => {
    const existingTasks = [{
      id: '123',
      title: 'Existing Task',
      description: '',
      dueDate: '2026-04-25',
      createdAt: '2026-04-23T10:00:00.000Z',
      updatedAt: '2026-04-23T10:00:00.000Z',
    }];
    sessionStorage.setItem('todo_tasks', JSON.stringify(existingTasks));
    
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });
  });

  it('should add a new task', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });
  });

  it('should save tasks to storage when adding', async () => {
    const saveSpy = vi.spyOn(storageService, 'saveTasks');
    
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  it('should open and close modal', () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
    expect(screen.getByTestId('modal-mode')).toHaveTextContent('create');
    
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
  });

  it('should delete a task', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    // Add a task first
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });
    
    // Delete the task
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
    });
  });
});
```

### 5.2 Task Flow Integration Tests (src/__tests__/taskFlow.integration.test.tsx)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Task Flow Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should display welcome message on load', () => {
    render(<App />);
    expect(screen.getByText('Welcome to TODO list')).toBeInTheDocument();
  });

  it('should display "No tasks" when empty', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('No tasks')).toBeInTheDocument();
    });
  });

  it('should display Create Task button', () => {
    render(<App />);
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('should complete full create task flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click Create Task button
    await user.click(screen.getByText('Create Task'));
    
    // Modal should open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Title/), 'My New Task');
    await user.type(screen.getByLabelText(/Description/), 'Task description');
    await user.type(screen.getByLabelText(/Due Date/), '2026-04-25');
    
    // Submit the form
    await user.click(screen.getByText('Submit'));
    
    // Modal should close and task should appear
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('My New Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('should complete full edit task flow', async () => {
    // Pre-populate with a task
    const existingTask = {
      id: '123',
      title: 'Original Title',
      description: 'Original Description',
      dueDate: '2026-04-25',
      createdAt: '2026-04-23T10:00:00.000Z',
      updatedAt: '2026-04-23T10:00:00.000Z',
    };
    sessionStorage.setItem('todo_tasks', JSON.stringify([existingTask]));
    
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument();
    });
    
    // Click Edit button
    await user.click(screen.getByText('Edit'));
    
    // Modal should open with pre-filled data
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
    
    // Update the title
    const titleInput = screen.getByLabelText(/Title/);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');
    
    // Submit
    await user.click(screen.getByText('Submit'));
    
    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });
    expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
  });

  it('should complete full delete task flow', async () => {
    // Pre-populate with a task
    const existingTask = {
      id: '123',
      title: 'Task to Delete',
      description: '',
      dueDate: '2026-04-25',
      createdAt: '2026-04-23T10:00:00.000Z',
      updatedAt: '2026-04-23T10:00:00.000Z',
    };
    sessionStorage.setItem('todo_tasks', JSON.stringify([existingTask]));
    
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument();
    });
    
    // Click Delete button
    await user.click(screen.getByText('Delete'));
    
    // Task should be removed
    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
    
    // Should show empty state
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open modal
    await user.click(screen.getByText('Create Task'));
    
    // Try to submit without filling fields
    await user.click(screen.getByText('Submit'));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Due date is required')).toBeInTheDocument();
    });
  });

  it('should close modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open modal
    await user.click(screen.getByText('Create Task'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Click Cancel
    await user.click(screen.getByText('Cancel'));
    
    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should persist tasks across component remounts', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    
    // Create a task
    await user.click(screen.getByText('Create Task'));
    await user.type(screen.getByLabelText(/Title/), 'Persistent Task');
    await user.type(screen.getByLabelText(/Due Date/), '2026-04-25');
    await user.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Persistent Task')).toBeInTheDocument();
    });
    
    // Unmount and remount
    unmount();
    render(<App />);
    
    // Task should still be there
    await waitFor(() => {
      expect(screen.getByText('Persistent Task')).toBeInTheDocument();
    });
  });
});
```

---

## 6. End-to-End Tests

### 6.1 Playwright Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 6.2 E2E Test Scenarios (e2e/todo.spec.ts)

```typescript
import { test, expect } from '@playwright/test';

test.describe('TODO List Application', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
  });

  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to TODO list')).toBeVisible();
  });

  test('should display "No tasks" when empty', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('No tasks')).toBeVisible();
  });

  test('should display Create Task button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeVisible();
  });

  test('should open modal when Create Task is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Create Task' }).click();
    
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Due Date')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    
    // Fill form
    await page.getByLabel('Title').fill('E2E Test Task');
    await page.getByLabel('Description').fill('This is an E2E test');
    await page.getByLabel('Due Date').fill('2026-04-25');
    
    // Submit
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify task appears
    await expect(page.getByText('E2E Test Task')).toBeVisible();
    await expect(page.getByText('This is an E2E test')).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    await page.goto('/');
    
    // Create a task first
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByLabel('Title').fill('Original Task');
    await page.getByLabel('Due Date').fill('2026-04-25');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Original Task')).toBeVisible();
    
    // Click Edit
    await page.getByRole('button', { name: 'Edit' }).click();
    
    // Verify modal has pre-filled data
    await expect(page.getByLabel('Title')).toHaveValue('Original Task');
    
    // Update title
    await page.getByLabel('Title').clear();
    await page.getByLabel('Title').fill('Updated Task');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify update
    await expect(page.getByText('Updated Task')).toBeVisible();
    await expect(page.getByText('Original Task')).not.toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    await page.goto('/');
    
    // Create a task first
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByLabel('Title').fill('Task to Delete');
    await page.getByLabel('Due Date').fill('2026-04-25');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Task to Delete')).toBeVisible();
    
    // Handle confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Click Delete
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // Verify deletion
    await expect(page.getByText('Task to Delete')).not.toBeVisible();
    await expect(page.getByText('No tasks')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    
    // Submit without filling required fields
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify errors
    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Due date is required')).toBeVisible();
  });

  test('should close modal with Cancel button', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Verify modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Verify modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Click overlay (outside modal)
    await page.locator('.overlay').click({ position: { x: 10, y: 10 } });
    
    // Verify modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should persist tasks in session storage', async ({ page }) => {
    await page.goto('/');
    
    // Create a task
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByLabel('Title').fill('Persistent Task');
    await page.getByLabel('Due Date').fill('2026-04-25');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify task exists
    await expect(page.getByText('Persistent Task')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Task should still be there
    await expect(page.getByText('Persistent Task')).toBeVisible();
  });

  test('should clear tasks when session ends', async ({ page, context }) => {
    await page.goto('/');
    
    // Create a task
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByLabel('Title').fill('Session Task');
    await page.getByLabel('Due Date').fill('2026-04-25');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify task exists
    await expect(page.getByText('Session Task')).toBeVisible();
    
    // Close and reopen browser context (simulates new session)
    await context.close();
    const newContext = await page.context().browser()!.newContext();
    const newPage = await newContext.newPage();
    await newPage.goto('/');
    
    // Task should not be there (new session)
    await expect(newPage.getByText('No tasks')).toBeVisible();
    
    await newContext.close();
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab to Create Task button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeFocused();
    
    // Press Enter to open modal
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Title')).toBeFocused();
  });

  test('should have proper ARIA attributes on modal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Create Task' }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByText('Welcome to TODO list')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeVisible();
    
    // Open modal
    await page.getByRole('button', { name: 'Create Task' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
```

---

## 7. Test Data

### 7.1 Mock Data Factory (src/test/factories/taskFactory.ts)

```typescript
import { Task, TaskFormData } from '@/types/task.types';
import { generateId } from '@/utils/idGenerator';

/**
 * Creates a mock task with default or custom values
 */
export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: generateId(),
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-04-25',
    createdAt: '2026-04-23T10:00:00.000Z',
    updatedAt: '2026-04-23T10:00:00.000Z',
    ...overrides,
  };
}

/**
 * Creates mock form data with default or custom values
 */
export function createMockFormData(overrides: Partial<TaskFormData> = {}): TaskFormData {
  return {
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-04-25',
    ...overrides,
  };
}

/**
 * Creates an array of mock tasks
 */
export function createMockTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      id: `task-${index + 1}`,
      title: `Task ${index + 1}`,
    })
  );
}
```

---

## 8. Test Execution

### 8.1 NPM Scripts (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

### 8.2 Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run all unit tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run E2E tests headless |
| `npm run test:e2e:headed` | Run E2E tests with browser visible |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

---

## 9. Test Checklist

### 9.1 Unit Test Checklist

| Component/Service | Test File | Status |
|-------------------|-----------|--------|
| generateId | idGenerator.test.ts | ☐ |
| dateUtils | dateUtils.test.ts | ☐ |
| storageService | storageService.test.ts | ☐ |
| validationService | validationService.test.ts | ☐ |
| Button | Button.test.tsx | ☐ |
| Input | Input.test.tsx | ☐ |
| Modal | Modal.test.tsx | ☐ |
| EmptyState | EmptyState.test.tsx | ☐ |
| TaskItem | TaskItem.test.tsx | ☐ |
| TaskList | TaskList.test.tsx | ☐ |
| TaskModal | TaskModal.test.tsx | ☐ |
| Dashboard | Dashboard.test.tsx | ☐ |

### 9.2 Integration Test Checklist

| Flow | Test File | Status |
|------|-----------|--------|
| TaskContext operations | TaskContext.integration.test.tsx | ☐ |
| Create task flow | taskFlow.integration.test.tsx | ☐ |
| Edit task flow | taskFlow.integration.test.tsx | ☐ |
| Delete task flow | taskFlow.integration.test.tsx | ☐ |
| Validation flow | taskFlow.integration.test.tsx | ☐ |

### 9.3 E2E Test Checklist

| Scenario | Status |
|----------|--------|
| Display welcome message | ☐ |
| Display empty state | ☐ |
| Create task | ☐ |
| Edit task | ☐ |
| Delete task | ☐ |
| Validation errors | ☐ |
| Modal interactions | ☐ |
| Session persistence | ☐ |
| Keyboard navigation | ☐ |
| Mobile responsiveness | ☐ |

---

## 10. Acceptance Criteria Verification

| AC ID | Criteria | Test Coverage |
|-------|----------|---------------|
| AC-001 | Dashboard displays "Welcome to TODO list" on load | Unit, E2E |
| AC-002 | "No tasks" shown when task list is empty | Unit, Integration, E2E |
| AC-003 | "Create Task" button opens modal | Unit, Integration, E2E |
| AC-004 | Modal contains Title, Description, Due Date fields | Unit, E2E |
| AC-005 | Submitting creates task and displays in list | Integration, E2E |
| AC-006 | Edit button opens modal with pre-filled data | Integration, E2E |
| AC-007 | Delete button removes task from list | Integration, E2E |
| AC-008 | Tasks persist in session storage | Integration, E2E |
| AC-009 | Tasks cleared when browser session ends | E2E |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-23 | AI Generated | Initial Test Specification |

---

*This document provides testing guidelines for Phase 5: Implementation & Deploy*
