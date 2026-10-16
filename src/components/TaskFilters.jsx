import React from 'react';
import { CheckCircle2, Clock, ListFilter } from 'lucide-react';

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  totalCount,
  pendingCount,
  completedCount,
}) {
  const filters = [
    { id: 'All', label: 'All', count: totalCount },
    { id: 'Pending', label: 'Pending', count: pendingCount },
    { id: 'Completed', label: 'Completed', count: completedCount },
  ];

  const getFilterIcon = (filterId) => {
    switch (filterId) {
      case 'Completed':
        return <CheckCircle2 size={15} />;
      case 'Pending':
        return <Clock size={15} />;
      default:
        return <ListFilter size={15} />;
    }
  };

  return (
    <div className="task-filters-container">
      <div className="filters-toolbar">
        <div className="filter-buttons-wrapper" role="tablist" aria-label="Task Filters">
          <span className="filter-label">Filter by:</span>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                className={`filter-btn ${isActive ? 'filter-active' : ''}`}
                onClick={() => onFilterChange(filter.id)}
              >
                {filter.label}
                <span className={`filter-badge ${isActive ? 'badge-active' : ''}`}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current view banner matching PDF Page 4 mockup */}
      <div className="current-view-banner">
        <span className="current-view-icon" aria-hidden="true">
          {getFilterIcon(activeFilter)}
        </span>
        <span className="current-view-text">
          Current View: <strong>{activeFilter} Tasks</strong> ({activeFilter === 'All' ? totalCount : activeFilter === 'Pending' ? pendingCount : completedCount})
        </span>
      </div>
    </div>
  );
}
