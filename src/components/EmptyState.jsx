import React from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function EmptyState({ activeFilter, totalTasks }) {
  if (totalTasks === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon-box">
          <ClipboardList size={38} className="empty-icon text-muted" />
        </div>
        <h3 className="empty-state-title">No tasks yet</h3>
        <p className="empty-state-desc">
          Get started by adding your first task using the input field above.
        </p>
      </div>
    );
  }

  if (activeFilter === 'Completed') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon-box icon-box-completed">
          <CheckCircle2 size={38} className="empty-icon text-completed" />
        </div>
        <h3 className="empty-state-title">No completed tasks</h3>
        <p className="empty-state-desc">
          Tasks you mark as completed will appear here. Keep going!
        </p>
      </div>
    );
  }

  if (activeFilter === 'Pending') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon-box icon-box-pending">
          <Clock size={38} className="empty-icon text-pending" />
        </div>
        <h3 className="empty-state-title">All caught up!</h3>
        <p className="empty-state-desc">
          There are no pending tasks right now. Great job completing your to-do list!
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon-box">
        <ClipboardList size={38} className="empty-icon text-muted" />
      </div>
      <h3 className="empty-state-title">No matching tasks</h3>
      <p className="empty-state-desc">Try selecting another filter or adding new tasks.</p>
    </div>
  );
}
