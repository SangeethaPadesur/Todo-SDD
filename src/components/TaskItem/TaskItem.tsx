import React from 'react';
import { Task } from '@/types/task.types';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/dateUtils';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
}

/**
 * Individual task item component
 */
export function TaskItem({ task }: TaskItemProps): React.ReactElement {
  const { openEditModal, deleteTask } = useTaskContext();

  const handleEdit = (): void => {
    openEditModal(task.id);
  };

  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <li className={styles.taskItem} role="listitem">
      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        <span className={styles.taskDueDate}>
          Due: {formatDate(task.dueDate)}
        </span>
      </div>
      <div className={styles.taskActions}>
        <Button onClick={handleEdit} variant="secondary" size="small">
          Edit
        </Button>
        <Button onClick={handleDelete} variant="danger" size="small">
          Delete
        </Button>
      </div>
    </li>
  );
}
