import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskFormData, TaskFormErrors } from '@/types/task.types';
import { validationService } from '@/services/validationService';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import styles from './TaskModal.module.css';

/**
 * Initial form state
 */
const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
};

/**
 * Task create/edit modal component
 */
export function TaskModal(): React.ReactElement | null {
  const { state, addTask, updateTask, closeModal, getTaskById } = useTaskContext();
  const { modal } = state;

  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (modal.isOpen && modal.mode === 'edit' && modal.editingTaskId) {
      const task = getTaskById(modal.editingTaskId);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        });
      }
    } else if (modal.isOpen && modal.mode === 'create') {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [modal.isOpen, modal.mode, modal.editingTaskId, getTaskById]);

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TaskFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const validation = validationService.validateTaskForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (modal.mode === 'create') {
      addTask(formData);
    } else if (modal.editingTaskId) {
      updateTask(modal.editingTaskId, formData);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = (): void => {
    setFormData(initialFormData);
    setErrors({});
    closeModal();
  };

  if (!modal.isOpen) {
    return null;
  }

  const modalTitle = modal.mode === 'create' ? 'Create Task' : 'Edit Task';

  return (
    <Modal isOpen={modal.isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          maxLength={100}
          placeholder="Enter task title"
        />

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            maxLength={500}
            placeholder="Enter task description (optional)"
            rows={4}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
