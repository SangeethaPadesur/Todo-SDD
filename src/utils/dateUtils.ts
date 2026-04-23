/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Apr 23, 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Gets current ISO timestamp
 * @returns Current date/time in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Formats date for input[type="date"]
 * @param dateString - ISO date string
 * @returns Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
