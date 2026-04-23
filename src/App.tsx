import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { Dashboard } from './components/Dashboard';
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
