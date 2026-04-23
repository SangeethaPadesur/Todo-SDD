# Architecture & Design Document
## TODO List Web Application

**Document Version:** 1.0  
**Date:** April 23, 2026  
**Phase:** 3 - Architecture & Design  
**Reference:** Engineering Requirements v1.0

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Environment                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                 Presentation Layer                   │  │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌───────────────────────┐ │  │  │
│  │  │  │Dashboard│ │ TaskList │ │      TaskModal        │ │  │  │
│  │  │  └─────────┘ └──────────┘ └───────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  State Layer                         │  │  │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │  │  │
│  │  │  │ TaskContext │ │ ModalState  │ │  useReducer   │  │  │  │
│  │  │  └─────────────┘ └─────────────┘ └───────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                 Service Layer                        │  │  │
│  │  │  ┌─────────────────┐ ┌────────────────────────────┐ │  │  │
│  │  │  │ StorageService  │ │    ValidationService       │ │  │  │
│  │  │  └─────────────────┘ └────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Session Storage                          │  │
│  │                   Key: "todo_tasks"                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Pattern

**Pattern:** Component-Based Architecture with Context API

| Layer | Responsibility | Technologies |
|-------|----------------|--------------|
| Presentation | UI rendering, user interactions | React Components, CSS Modules |
| State | Application state management | React Context, useReducer |
| Service | Business logic, storage operations | TypeScript Services |
| Storage | Data persistence | Session Storage API |

---

## 2. Project Structure

```
todo-app/
├── docs/
│   ├── ENGINEERING_REQUIREMENTS.md
│   └── ARCHITECTURE_DESIGN.md
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── index.ts
│   │   │   └── Input/
│   │   │       ├── Input.tsx
│   │   │       ├── Input.module.css
│   │   │       └── index.ts
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── index.ts
│   │   ├── TaskList/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskList.module.css
│   │   │   └── index.ts
│   │   ├── TaskItem/
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskItem.module.css
│   │   │   └── index.ts
│   │   ├── TaskModal/
│   │   │   ├── TaskModal.tsx
│   │   │   ├── TaskModal.module.css
│   │   │   └── index.ts
│   │   └── EmptyState/
│   │       ├── EmptyState.tsx
│   │       ├── EmptyState.module.css
│   │       └── index.ts
│   ├── context/
│   │   ├── TaskContext.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useTaskManager.ts
│   │   ├── useModal.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── storageService.ts
│   │   ├── validationService.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── task.types.ts
│   │   ├── modal.types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── idGenerator.ts
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.tsx
│   ├── App.module.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy Diagram

```
                            ┌─────────────┐
                            │     App     │
                            │ (Provider)  │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │  Dashboard  │
                            └──────┬──────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
     ┌──────▼──────┐        ┌──────▼──────┐        ┌──────▼──────┐
     │   Header    │        │  TaskList   │        │ TaskModal   │
     │  (Welcome)  │        │             │        │ (Conditional)│
     └─────────────┘        └──────┬──────┘        └─────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
             ┌──────▼──────┐      ...      ┌──────▼──────┐
             │  TaskItem   │              │ EmptyState  │
             │             │              │ (if empty)  │
             └──────┬──────┘              └─────────────┘
                    │
         ┌─────────┬─────────┐
         │         │         │
    ┌────▼───┐ ┌───▼────┐ ┌──▼───┐
    │ Title  │ │  Edit  │ │Delete│
    │ Desc   │ │  Btn   │ │ Btn  │
    │ Date   │ └────────┘ └──────┘
    └────────┘
```

### 3.2 Component Specifications

#### App Component
```typescript
// App.tsx
interface AppProps {}

/**
 * Root component that wraps the application with TaskProvider
 * Responsibilities:
 * - Initialize TaskContext provider
 * - Render Dashboard component
 */
```

#### Dashboard Component
```typescript
// Dashboard.tsx
interface DashboardProps {}

/**
 * Main container component
 * Responsibilities:
 * - Display welcome header
 * - Render CreateTask button
 * - Render TaskList
 * - Manage TaskModal visibility
 */
```

#### TaskList Component
```typescript
// TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Renders list of tasks or empty state
 * Responsibilities:
 * - Map tasks to TaskItem components
 * - Show EmptyState when no tasks
 */
```

#### TaskItem Component
```typescript
// TaskItem.tsx
interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Individual task display
 * Responsibilities:
 * - Display task details (title, description, due date)
 * - Provide Edit and Delete action buttons
 */
```

#### TaskModal Component
```typescript
// TaskModal.tsx
interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onClose: () => void;
}

/**
 * Modal for creating/editing tasks
 * Responsibilities:
 * - Render form with Title, Description, Due Date fields
 * - Validate form inputs
 * - Handle form submission
 * - Support both create and edit modes
 */
```

#### EmptyState Component
```typescript
// EmptyState.tsx
interface EmptyStateProps {
  message?: string;
}

/**
 * Displayed when task list is empty
 * Default message: "No tasks"
 */
```

---

## 4. State Management Design

### 4.1 State Structure

```typescript
// types/task.types.ts
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// types/modal.types.ts
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  editingTaskId: string | null;
}

// context/TaskContext.tsx
interface TaskState {
  tasks: Task[];
  modal: ModalState;
  isLoading: boolean;
  error: string | null;
}
```

### 4.2 Actions & Reducer

```typescript
// Action Types
type TaskAction =
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'OPEN_CREATE_MODAL' }
  | { type: 'OPEN_EDIT_MODAL'; payload: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer Function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, isLoading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    case 'OPEN_CREATE_MODAL':
      return {
        ...state,
        modal: { isOpen: true, mode: 'create', editingTaskId: null }
      };
    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        modal: { isOpen: true, mode: 'edit', editingTaskId: action.payload }
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: { isOpen: false, mode: 'create', editingTaskId: null }
      };
    default:
      return state;
  }
}
```

### 4.3 Context Provider Design

```typescript
// context/TaskContext.tsx
interface TaskContextValue {
  state: TaskState;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  openCreateModal: () => void;
  openEditModal: (id: string) => void;
  closeModal: () => void;
  getTaskById: (id: string) => Task | undefined;
}
```

---

## 5. Data Flow Diagrams

### 5.1 Create Task Flow

```
┌──────────┐    Click     ┌──────────────┐
│  Create  │ ──────────▶  │ Open Modal   │
│  Button  │              │ (create mode)│
└──────────┘              └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Fill Form   │
                          │ Title, Desc, │
                          │   Due Date   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │   Validate   │
                          │    Form      │
                          └──────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │ Valid?                  │
              ┌─────▼─────┐            ┌──────▼──────┐
              │    Yes    │            │     No      │
              └─────┬─────┘            └──────┬──────┘
                    │                         │
                    ▼                         ▼
           ┌────────────────┐         ┌──────────────┐
           │  Generate ID   │         │ Show Errors  │
           │  Create Task   │         └──────────────┘
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Dispatch       │
           │ ADD_TASK       │
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Save to        │
           │ Session Storage│
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Close Modal    │
           │ Update UI      │
           └────────────────┘
```

### 5.2 Edit Task Flow

```
┌──────────┐    Click     ┌──────────────┐
│   Edit   │ ──────────▶  │ Open Modal   │
│  Button  │              │ (edit mode)  │
└──────────┘              └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Load Task    │
                          │ Data by ID   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Pre-fill     │
                          │ Form Fields  │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ User Edits   │
                          │ Fields       │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │   Validate   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Dispatch     │
                          │ UPDATE_TASK  │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Save to      │
                          │ Session Store│
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Close Modal  │
                          │ Update UI    │
                          └──────────────┘
```

### 5.3 Delete Task Flow

```
┌──────────┐    Click     ┌──────────────┐
│  Delete  │ ──────────▶  │   Confirm    │
│  Button  │              │   Dialog     │
└──────────┘              └──────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │ Confirmed?              │
              ┌─────▼─────┐            ┌──────▼──────┐
              │    Yes    │            │     No      │
              └─────┬─────┘            └──────┬──────┘
                    │                         │
                    ▼                         ▼
           ┌────────────────┐         ┌──────────────┐
           │ Dispatch       │         │   Cancel     │
           │ DELETE_TASK    │         │   (No-op)    │
           └────────┬───────┘         └──────────────┘
                    │
                    ▼
           ┌────────────────┐
           │ Remove from    │
           │ Session Storage│
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Update UI      │
           │ (Re-render)    │
           └────────────────┘
```

---

## 6. Service Layer Design

### 6.1 Storage Service

```typescript
// services/storageService.ts

const STORAGE_KEY = 'todo_tasks';

interface StorageService {
  getTasks(): Task[];
  saveTasks(tasks: Task[]): void;
  clearTasks(): void;
  isAvailable(): boolean;
}

const storageService: StorageService = {
  getTasks(): Task[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to session storage:', error);
      throw new Error('Failed to save tasks');
    }
  },

  clearTasks(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  },

  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export default storageService;
```

### 6.2 Validation Service

```typescript
// services/validationService.ts

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ValidationRules {
  title: {
    required: true;
    minLength: 1;
    maxLength: 100;
  };
  description: {
    required: false;
    maxLength: 500;
  };
  dueDate: {
    required: true;
  };
}

const validationService = {
  validateTaskForm(data: TaskFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Title validation
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }

    // Description validation
    if (data.description && data.description.length > 500) {
      errors.description = 'Description must be 500 characters or less';
    }

    // Due Date validation
    if (!data.dueDate) {
      errors.dueDate = 'Due date is required';
    } else if (!this.isValidDate(data.dueDate)) {
      errors.dueDate = 'Please enter a valid date';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
};

export default validationService;
```

---

## 7. UI/UX Design

### 7.1 Wireframes

#### Dashboard View (With Tasks)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   Welcome to TODO list                      │
│                                                             │
│                    ┌─────────────────┐                      │
│                    │  + Create Task  │                      │
│                    └─────────────────┘                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────┐   │  │
│  │ │  📋 Task Title 1                                │   │  │
│  │ │  Description text here...                       │   │  │
│  │ │  📅 Due: 2026-04-25         [Edit] [Delete]    │   │  │
│  │ └─────────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │ ┌─────────────────────────────────────────────────┐   │  │
│  │ │  📋 Task Title 2                                │   │  │
│  │ │  Another description...                         │   │  │
│  │ │  📅 Due: 2026-04-30         [Edit] [Delete]    │   │  │
│  │ └─────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Dashboard View (Empty State)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   Welcome to TODO list                      │
│                                                             │
│                    ┌─────────────────┐                      │
│                    │  + Create Task  │                      │
│                    └─────────────────┘                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                                                       │  │
│  │                      No tasks                         │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Task Modal (Create/Edit)
```
┌─────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░  ┌─────────────────────────────────────────┐  ░░░░░░░ │
│ ░░░░  │  Create Task                        ✕   │  ░░░░░░░ │
│ ░░░░  ├─────────────────────────────────────────┤  ░░░░░░░ │
│ ░░░░  │                                         │  ░░░░░░░ │
│ ░░░░  │  Title *                                │  ░░░░░░░ │
│ ░░░░  │  ┌─────────────────────────────────┐    │  ░░░░░░░ │
│ ░░░░  │  │                                 │    │  ░░░░░░░ │
│ ░░░░  │  └─────────────────────────────────┘    │  ░░░░░░░ │
│ ░░░░  │                                         │  ░░░░░░░ │
│ ░░░░  │  Description                            │  ░░░░░░░ │
│ ░░░░  │  ┌─────────────────────────────────┐    │  ░░░░░░░ │
│ ░░░░  │  │                                 │    │  ░░░░░░░ │
│ ░░░░  │  │                                 │    │  ░░░░░░░ │
│ ░░░░  │  └─────────────────────────────────┘    │  ░░░░░░░ │
│ ░░░░  │                                         │  ░░░░░░░ │
│ ░░░░  │  Due Date *                             │  ░░░░░░░ │
│ ░░░░  │  ┌─────────────────────────────────┐    │  ░░░░░░░ │
│ ░░░░  │  │  📅 Select date...              │    │  ░░░░░░░ │
│ ░░░░  │  └─────────────────────────────────┘    │  ░░░░░░░ │
│ ░░░░  │                                         │  ░░░░░░░ │
│ ░░░░  │         ┌────────┐  ┌────────┐          │  ░░░░░░░ │
│ ░░░░  │         │ Cancel │  │ Submit │          │  ░░░░░░░ │
│ ░░░░  │         └────────┘  └────────┘          │  ░░░░░░░ │
│ ░░░░  │                                         │  ░░░░░░░ │
│ ░░░░  └─────────────────────────────────────────┘  ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Design Tokens

```css
/* styles/variables.css */

:root {
  /* Colors */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-secondary: #6B7280;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-danger-hover: #DC2626;
  --color-warning: #F59E0B;
  
  /* Background Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-overlay: rgba(0, 0, 0, 0.5);
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  
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
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

## 8. Error Handling Strategy

### 8.1 Error Boundaries

```typescript
// components/common/ErrorBoundary/ErrorBoundary.tsx

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  // Catches rendering errors in child components
  // Displays fallback UI
  // Logs errors for debugging
}
```

### 8.2 Error Types

| Error Type | Handling Strategy |
|------------|-------------------|
| Storage Unavailable | Display warning, disable persistence |
| Validation Error | Show inline field errors |
| Storage Quota Exceeded | Display error toast, suggest cleanup |
| Render Error | Show error boundary fallback |

---

## 9. Accessibility Design

### 9.1 ARIA Implementation

| Component | ARIA Attributes |
|-----------|-----------------|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Task List | `role="list"` |
| Task Item | `role="listitem"` |
| Buttons | `aria-label` for icon-only buttons |
| Form Inputs | `aria-required`, `aria-invalid`, `aria-describedby` |

### 9.2 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between focusable elements |
| Enter | Activate buttons, submit forms |
| Escape | Close modal |
| Space | Activate buttons |

---

## 10. Performance Considerations

### 10.1 Optimization Strategies

| Strategy | Implementation |
|----------|----------------|
| Memoization | `React.memo` for TaskItem, `useMemo` for filtered lists |
| Lazy Loading | Not required (small app) |
| Debouncing | Form validation on input change |
| Virtual List | Not required (expected < 100 tasks) |

### 10.2 Bundle Size Targets

| Metric | Target |
|--------|--------|
| Initial JS Bundle | < 100KB gzipped |
| CSS Bundle | < 20KB gzipped |
| Total Assets | < 150KB gzipped |

---

## 11. Testing Strategy

### 11.1 Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Dashboard.test.tsx
│   │   ├── TaskList.test.tsx
│   │   ├── TaskItem.test.tsx
│   │   └── TaskModal.test.tsx
│   ├── services/
│   │   ├── storageService.test.ts
│   │   └── validationService.test.ts
│   ├── hooks/
│   │   └── useTaskManager.test.ts
│   └── integration/
│       └── taskFlow.test.tsx
```

### 11.2 Test Coverage Targets

| Category | Target |
|----------|--------|
| Services | 100% |
| Hooks | 90% |
| Components | 80% |
| Integration | Key flows |

---

## 12. Security Considerations

| Concern | Mitigation |
|---------|------------|
| XSS | React's built-in escaping, no `dangerouslySetInnerHTML` |
| Data Exposure | Session storage clears on tab close |
| Input Validation | Client-side validation before storage |

---

## 13. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Process                            │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Source │ -> │  Vite   │ -> │  Build  │ -> │  Dist   │  │
│  │  Code   │    │  Build  │    │ Optimize│    │ Output  │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Static Hosting                            │
│         (Vercel / Netlify / GitHub Pages / S3)              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  index.html + JS bundles + CSS + Assets             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-23 | AI Generated | Initial Architecture & Design |

---

*This document serves as the foundation for Phase 4: Dev Spec & Test Spec*
