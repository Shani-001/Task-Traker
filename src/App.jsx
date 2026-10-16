import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import { loadTasksFromStorage, saveTasksToStorage, generateTaskId } from './utils/storage';
import { HardDrive } from 'lucide-react';

export default function App() {
  // Safe initial load from localStorage
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [activeFilter, setActiveFilter] = useState('All');

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Derived statistics (calculated dynamically, no redundant state)
  const totalCount = tasks.length;
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === 'Completed').length,
    [tasks]
  );
  const pendingCount = totalCount - completedCount;

  // Filtered task list
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Completed') {
      return tasks.filter((task) => task.status === 'Completed');
    }
    if (activeFilter === 'Pending') {
      return tasks.filter((task) => task.status === 'Pending');
    }
    return tasks;
  }, [tasks, activeFilter]);

  // Handler: Add new task
  const handleAddTask = (taskText) => {
    const newTask = {
      id: generateTaskId(),
      text: taskText,
      status: 'Pending', // New tasks always default to Pending
      createdAt: Date.now(),
    };

    // Prepend new task so it is immediately visible at the top
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // Handler: Toggle Completed / Pending status
  const handleToggleStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Handler: Delete task
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        <div className="content-card">
          {/* Top Metric Cards */}
          <TaskStats
            totalCount={totalCount}
            completedCount={completedCount}
            pendingCount={pendingCount}
          />

          {/* Add Task Form */}
          <TaskForm onAddTask={handleAddTask} />

          {/* Filter Bar & View Indicator */}
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
          />

          {/* Filtered Tasks List */}
          <TaskList
            tasks={filteredTasks}
            activeFilter={activeFilter}
            totalTasks={totalCount}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p className="footer-note">
          <HardDrive size={14} className="footer-icon" />
          <span>Your tasks are stored locally on this device.</span>
        </p>
        <p className="footer-subnote">
          JTRONIX Frontend Internship Assessment — Task Tracker Web App
        </p>
      </footer>
    </div>
  );
}
