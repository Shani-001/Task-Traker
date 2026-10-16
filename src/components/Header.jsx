import React from 'react';
import { CheckSquare, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-badge" aria-hidden="true">
            <CheckSquare className="logo-icon" size={24} />
          </div>
          <div>
            <div className="title-row">
              <h1 className="app-title">Task Tracker</h1>
              <span className="brand-tag">
                <Sparkles size={12} className="tag-icon" /> JTRONIX
              </span>
            </div>
            <p className="app-subtitle">Organize your day, one task at a time.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
