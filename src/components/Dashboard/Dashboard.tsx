import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskList } from '../TaskList';
import { TaskModal } from '../TaskModal';
import { Button } from '../common/Button';
import styles from './Dashboard.module.css';

/**
 * Main dashboard component
 */
export function Dashboard(): React.ReactElement {
  const { state, openCreateModal } = useTaskContext();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to TODO list</h1>
      </header>

      <div className={styles.actions}>
        <Button onClick={openCreateModal} variant="primary">
          Create Task
        </Button>
      </div>

      <main className={styles.content}>
        {state.isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <TaskList tasks={state.tasks} />
        )}
      </main>

      <TaskModal />
    </div>
  );
}
