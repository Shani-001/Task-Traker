import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export default function TaskList({
  tasks,
  activeFilter,
  totalTasks,
  onToggleStatus,
  onDeleteTask,
}) {
  if (tasks.length === 0) {
    return <EmptyState activeFilter={activeFilter} totalTasks={totalTasks} />;
  }

  return (
    <ul className="task-list" aria-label="Tasks List">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}
