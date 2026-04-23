import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message?: string;
}

/**
 * Empty state component displayed when no tasks exist
 */
export function EmptyState({ message = 'No tasks' }: EmptyStateProps): React.ReactElement {
  return (
    <div className={styles.emptyState}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
