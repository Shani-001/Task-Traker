import React, { useState } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';

export default function TaskForm({ onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = taskText.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a task before adding.');
      return;
    }

    onAddTask(trimmed);
    setTaskText('');
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setTaskText(e.target.value);
    if (errorMessage) {
      // Clear validation message as soon as user types something
      setErrorMessage('');
    }
  };

  return (
    <section className="task-form-card" aria-label="Add New Task">
      <h2 className="form-title">Add a New Task</h2>
      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="input-group">
          <input
            type="text"
            className={`task-input ${errorMessage ? 'input-error' : ''}`}
            placeholder="Enter a new task..."
            value={taskText}
            onChange={handleChange}
            aria-label="New task title"
            aria-describedby={errorMessage ? 'task-input-error' : undefined}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary add-task-btn" aria-label="Add Task">
            <PlusCircle size={18} className="btn-icon" />
            <span>Add Task</span>
          </button>
        </div>

        {errorMessage && (
          <div id="task-input-error" className="error-message" role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </section>
  );
}
