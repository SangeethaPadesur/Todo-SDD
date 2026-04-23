import React from 'react';
import { Task } from '@/types/task.types';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
}

/**
 * Renders list of tasks or empty state
 */
export function TaskList({ tasks }: TaskListProps): React.ReactElement {
  if (tasks.length === 0) {
    return <EmptyState message="No tasks" />;
  }

  return (
    <ul className={styles.taskList} role="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
