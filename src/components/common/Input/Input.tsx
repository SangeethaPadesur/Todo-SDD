import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Reusable input component with label and error handling
 */
export function Input({
  label,
  error,
  id,
  name,
  required,
  ...props
}: InputProps): React.ReactElement {
  const inputId = id || name;

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        id={inputId}
        name={name}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
