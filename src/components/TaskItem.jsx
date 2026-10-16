import React from 'react';
import { Trash2, Check } from 'lucide-react';

export default function TaskItem({ task, onToggleStatus, onDeleteTask }) {
  const isCompleted = task.status === 'Completed';

  const handleCheckboxKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggleStatus(task.id);
    }
  };

  return (
    <li className={`task-item ${isCompleted ? 'task-item-completed' : ''}`}>
      <div className="task-main-content">
        {/* Custom accessible checkbox */}
        <div
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
          className={`custom-checkbox ${isCompleted ? 'checkbox-checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
          onKeyDown={handleCheckboxKeyDown}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          aria-label={`Mark task "${task.text}" as ${isCompleted ? 'pending' : 'completed'}`}
        >
          {isCompleted && <Check size={14} strokeWidth={3} className="check-icon" />}
        </div>

        {/* Task Text */}
        <span
          className={`task-text ${isCompleted ? 'text-strikethrough' : ''}`}
          onClick={() => onToggleStatus(task.id)}
          title="Click to toggle status"
        >
          {task.text}
        </span>
      </div>

      <div className="task-actions">
        {/* Status Pill Badge (Clickable toggle) */}
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          className={`status-pill ${isCompleted ? 'pill-completed' : 'pill-pending'}`}
          title={`Click to switch to ${isCompleted ? 'Pending' : 'Completed'}`}
          aria-label={`Status: ${task.status}. Click to change.`}
        >
          <span className="status-indicator-dot" aria-hidden="true"></span>
          <span>{task.status}</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="btn-delete"
          title="Delete task"
          aria-label={`Delete task: ${task.text}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
