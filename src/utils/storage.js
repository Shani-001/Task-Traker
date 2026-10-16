/**
 * LocalStorage utility with safe serialization, deserialization, and schema validation.
 */

const STORAGE_KEY = 'jtronix_task_tracker_data_v1';

/**
 * Generates a unique, collision-resistant task identifier.
 * Uses native crypto.randomUUID() when available, with a timestamp-random fallback.
 */
export const generateTaskId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
};

/**
 * Loads tasks safely from browser localStorage.
 * Returns an empty array if storage is empty, corrupted, or unavailable.
 */
export const loadTasksFromStorage = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('Storage data corrupted (not an array). Initializing with empty list.');
      return [];
    }

    // Sanitize and validate every task item
    const validTasks = parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : generateTaskId(),
        text: typeof item.text === 'string' ? item.text.trim() : '',
        status: item.status === 'Completed' ? 'Completed' : 'Pending',
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
      }))
      .filter((task) => task.text.length > 0);

    return validTasks;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

/**
 * Saves tasks to browser localStorage with error handling (e.g. QuotaExceeded).
 */
export const saveTasksToStorage = (tasks) => {
  try {
    if (!Array.isArray(tasks)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};
