import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier using UUID v4
 * @returns Unique string identifier
 */
export const generateId = (): string => {
  return uuidv4();
};
