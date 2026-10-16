import React from 'react';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

export default function TaskStats({ totalCount, completedCount, pendingCount }) {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="task-stats-section" aria-label="Task Statistics Summary">
      <div className="stats-grid">
        {/* Total Tasks Card */}
        <div className="stat-card stat-total">
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-number">{totalCount}</span>
          </div>
          <div className="stat-icon-wrapper total-icon" aria-hidden="true">
            <Layers size={22} />
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="stat-card stat-completed">
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-number text-completed">{completedCount}</span>
          </div>
          <div className="stat-icon-wrapper completed-icon" aria-hidden="true">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="stat-card stat-pending">
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-number text-pending">{pendingCount}</span>
          </div>
          <div className="stat-icon-wrapper pending-icon" aria-hidden="true">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="progress-container" aria-label={`Progress: ${completionPercentage}% completed`}>
          <div className="progress-label-row">
            <span>Overall Completion</span>
            <span className="progress-percentage">{completionPercentage}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
