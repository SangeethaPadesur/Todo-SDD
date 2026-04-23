# Engineering Requirements Document
## TODO List Web Application

**Document Version:** 1.0  
**Date:** April 23, 2026  
**Phase:** 2 - Engineering Requirements  

---

## 1. Overview

This document translates the Business Requirements into detailed Engineering Requirements for a TODO List Web Application built with React TypeScript and Session Storage.

---

## 2. Functional Requirements

### FR-001: Dashboard Display
| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-001.1 | Application SHALL display a dashboard as the default landing page on load | High | BR-1 |
| FR-001.2 | Dashboard SHALL display heading text "Welcome to TODO list" | High | BR-1 |
| FR-001.3 | Dashboard SHALL display a list of existing tasks if tasks exist in session storage | High | BR-1 |
| FR-001.4 | Dashboard SHALL display "No tasks" message when task list is empty | High | BR-1 |

### FR-002: Create Task Feature
| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-002.1 | Dashboard SHALL display a "Create Task" button | High | BR-2 |
| FR-002.2 | Clicking "Create Task" button SHALL open a modal dialog | High | BR-3 |
| FR-002.3 | Modal SHALL contain a text input field for "Title" (required, max 100 chars) | High | BR-3 |
| FR-002.4 | Modal SHALL contain a textarea field for "Description" (optional, max 500 chars) | High | BR-3 |
| FR-002.5 | Modal SHALL contain a date picker for "Due Date" (required) | High | BR-3 |
| FR-002.6 | Modal SHALL contain a "Submit" button | High | BR-3 |
| FR-002.7 | Modal SHALL contain a "Cancel" button to close without saving | Medium | Derived |
| FR-002.8 | Submit button SHALL be disabled until required fields are filled | Medium | Derived |

### FR-003: Task List Display
| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-003.1 | Each task in the list SHALL display the task Title | High | BR-4 |
| FR-003.2 | Each task in the list SHALL display the task Description | High | BR-4 |
| FR-003.3 | Each task in the list SHALL display the Due Date | High | BR-4 |
| FR-003.4 | Each task SHALL have an "Edit" button | High | BR-4 |
| FR-003.5 | Each task SHALL have a "Delete" button | High | BR-4 |

### FR-004: Edit Task Feature
| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-004.1 | Clicking "Edit" button SHALL open the task modal | High | BR-5 |
| FR-004.2 | Modal SHALL be pre-populated with existing task details | High | BR-5 |
| FR-004.3 | User SHALL be able to modify Title, Description, and Due Date | High | BR-5 |
| FR-004.4 | Submitting edited task SHALL update the task in session storage | High | BR-5 |
| FR-004.5 | Updated task SHALL reflect immediately in the dashboard list | High | Derived |

### FR-005: Delete Task Feature
| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-005.1 | Clicking "Delete" button SHALL remove the task from the list | High | BR-6 |
| FR-005.2 | Deleted task SHALL be removed from session storage | High | BR-6 |
| FR-005.3 | Dashboard SHALL update immediately after deletion | High | Derived |
| FR-005.4 | System SHOULD display confirmation before deletion | Medium | Derived |

---

## 3. Technical Requirements

### TR-001: Technology Stack
| ID | Requirement | Specification |
|----|-------------|---------------|
| TR-001.1 | Frontend Framework | React 18.x with TypeScript |
| TR-001.2 | Build Tool | Vite or Create React App |
| TR-001.3 | Styling | CSS Modules or Styled Components |
| TR-001.4 | State Management | React useState/useReducer hooks |
| TR-001.5 | Storage | Browser Session Storage API |

### TR-002: Session Storage Requirements
| ID | Requirement | Specification |
|----|-------------|---------------|
| TR-002.1 | Storage Key | `todo_tasks` |
| TR-002.2 | Data Format | JSON stringified array of Task objects |
| TR-002.3 | Persistence | Data persists for browser session only |
| TR-002.4 | Load Behavior | Tasks SHALL be loaded from session storage on app initialization |
| TR-002.5 | Save Behavior | Tasks SHALL be saved to session storage on every CRUD operation |

### TR-003: Browser Compatibility
| ID | Requirement | Specification |
|----|-------------|---------------|
| TR-003.1 | Supported Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| TR-003.2 | Session Storage | All target browsers must support Session Storage API |

---

## 4. Data Models

### DM-001: Task Interface
```typescript
interface Task {
  id: string;           // Unique identifier (UUID)
  title: string;        // Task title (required, 1-100 chars)
  description: string;  // Task description (optional, 0-500 chars)
  dueDate: string;      // ISO 8601 date string (required)
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}
```

### DM-002: Task Form Data Interface
```typescript
interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}
```

### DM-003: Modal State Interface
```typescript
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  taskId: string | null;  // null for create, task ID for edit
}
```

---

## 5. Component Specifications

### CS-001: Component Hierarchy
```
App
├── Dashboard
│   ├── Header (Welcome message)
│   ├── CreateTaskButton
│   ├── TaskList
│   │   ├── TaskItem (multiple)
│   │   │   ├── TaskDetails
│   │   │   ├── EditButton
│   │   │   └── DeleteButton
│   │   └── EmptyState ("No tasks")
│   └── TaskModal
│       ├── TitleInput
│       ├── DescriptionTextarea
│       ├── DueDatePicker
│       ├── SubmitButton
│       └── CancelButton
```

### CS-002: Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `App` | Root component, global state management |
| `Dashboard` | Main container, orchestrates task operations |
| `Header` | Displays "Welcome to TODO list" |
| `CreateTaskButton` | Triggers modal in create mode |
| `TaskList` | Renders list of tasks or empty state |
| `TaskItem` | Displays individual task with actions |
| `TaskModal` | Handles create/edit task form |
| `EmptyState` | Displays "No tasks" message |

---

## 6. State Management Requirements

### SM-001: Application State
```typescript
interface AppState {
  tasks: Task[];
  modal: ModalState;
  isLoading: boolean;
}
```

### SM-002: State Operations
| Operation | Trigger | State Change |
|-----------|---------|--------------|
| LOAD_TASKS | App mount | Load tasks from session storage |
| ADD_TASK | Submit (create mode) | Add new task to array, save to storage |
| UPDATE_TASK | Submit (edit mode) | Update task in array, save to storage |
| DELETE_TASK | Delete button click | Remove task from array, save to storage |
| OPEN_MODAL | Create/Edit button | Set modal.isOpen = true, set mode |
| CLOSE_MODAL | Cancel/Submit/Overlay click | Set modal.isOpen = false |

---

## 7. Validation Requirements

### VR-001: Input Validation Rules
| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required | "Title is required" |
| Title | Max 100 characters | "Title must be 100 characters or less" |
| Title | Min 1 character | "Title cannot be empty" |
| Description | Max 500 characters | "Description must be 500 characters or less" |
| Due Date | Required | "Due date is required" |
| Due Date | Valid date format | "Please enter a valid date" |

---

## 8. User Interface Requirements

### UI-001: Layout
| ID | Requirement |
|----|-------------|
| UI-001.1 | Dashboard SHALL be centered on the page |
| UI-001.2 | Maximum content width SHALL be 800px |
| UI-001.3 | Responsive design for mobile devices (min-width: 320px) |

### UI-002: Modal
| ID | Requirement |
|----|-------------|
| UI-002.1 | Modal SHALL appear centered with overlay background |
| UI-002.2 | Modal SHALL be closable by clicking overlay |
| UI-002.3 | Modal SHALL be closable by pressing Escape key |
| UI-002.4 | Modal width SHALL be 90% on mobile, 500px on desktop |

### UI-003: Accessibility
| ID | Requirement |
|----|-------------|
| UI-003.1 | All interactive elements SHALL be keyboard accessible |
| UI-003.2 | Form inputs SHALL have associated labels |
| UI-003.3 | Modal SHALL trap focus when open |
| UI-003.4 | Buttons SHALL have descriptive aria-labels |

---

## 9. Error Handling Requirements

### EH-001: Error Scenarios
| Scenario | Handling |
|----------|----------|
| Session storage unavailable | Display error message, disable save functionality |
| Invalid form submission | Display inline validation errors |
| Storage quota exceeded | Display error message to user |

---

## 10. Performance Requirements

### PR-001: Performance Metrics
| Metric | Target |
|--------|--------|
| Initial Load Time | < 2 seconds |
| Task CRUD Operation | < 100ms |
| Modal Open/Close | < 50ms animation |

---

## 11. Testing Requirements

### TST-001: Unit Tests
- All utility functions (storage operations, validation)
- Component rendering tests
- State management logic

### TST-002: Integration Tests
- Create task flow
- Edit task flow
- Delete task flow
- Session storage persistence

### TST-003: E2E Tests
- Complete user journey from load to task management

---

## 12. Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | Dashboard displays "Welcome to TODO list" on load | Pending |
| AC-002 | "No tasks" shown when task list is empty | Pending |
| AC-003 | "Create Task" button opens modal | Pending |
| AC-004 | Modal contains Title, Description, Due Date fields | Pending |
| AC-005 | Submitting creates task and displays in list | Pending |
| AC-006 | Edit button opens modal with pre-filled data | Pending |
| AC-007 | Delete button removes task from list | Pending |
| AC-008 | Tasks persist in session storage | Pending |
| AC-009 | Tasks cleared when browser session ends | Pending |

---

## 13. Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | UI Framework |
| TypeScript | ^5.0.0 | Type Safety |
| uuid | ^9.0.0 | Unique ID generation |

---

## 14. Glossary

| Term | Definition |
|------|------------|
| Session Storage | Web Storage API that stores data for one session |
| CRUD | Create, Read, Update, Delete operations |
| Modal | Dialog overlay for user input |
| UUID | Universally Unique Identifier |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-23 | AI Generated | Initial Engineering Requirements |

---

*This document serves as the foundation for Phase 3: Architecture & Design*
