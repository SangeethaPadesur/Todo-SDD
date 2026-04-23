# TODO List Web Application

A React TypeScript TODO list application with session storage persistence.

## Features

- ✅ Display "Welcome to TODO list" on load
- ✅ Show "No tasks" when task list is empty
- ✅ Create Task button opens modal
- ✅ Modal with Title, Description, Due Date fields
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Session storage persistence

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **CSS Modules** - Styling
- **Vitest** - Testing

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Modal, Input)
│   ├── Dashboard/       # Main dashboard component
│   ├── EmptyState/      # Empty state display
│   ├── TaskItem/        # Individual task display
│   ├── TaskList/        # Task list container
│   └── TaskModal/       # Create/Edit task modal
├── context/             # React Context for state management
├── services/            # Storage and validation services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── test/                # Test setup
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## License

MIT
