import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

/**
 * Reusable button component
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}: ButtonProps): React.ReactElement {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
