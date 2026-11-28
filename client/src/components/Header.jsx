import { useMemo } from 'react';
import {
  MenuIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
} from './Icons';

export default function Header({
  groupName,
  members,
  onOpenAddExpense,
  onLoadSampleGroup,
  setMobileOpen,
}) {
  // Determine greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <MenuIcon size={24} />
        </button>

        <div className="header-titles">
          <div className="greeting-row">
            <h1 className="header-greeting">{greeting}!</h1>
            <span className="header-tag">SplitEasy Hub</span>
          </div>
          <p className="header-description">
            Track shared expenses, balance group budgets, and settle payments effortlessly.
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Active Group Chip */}
        <div className="active-group-chip" title="Current active group">
          <div className="group-chip-indicator" />
          <div className="group-chip-info">
            <span className="group-chip-label">ACTIVE GROUP</span>
            <span className="group-chip-name">{groupName || 'Untitled Group'}</span>
          </div>
          <span className="group-member-count-pill">
            <UsersIcon size={13} />
            {members.length} {members.length === 1 ? 'Person' : 'People'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm test-case-btn"
            onClick={onLoadSampleGroup}
            title="Load sample group data"
          >
            <SparklesIcon size={15} />
            <span className="btn-text">Sample Group</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddExpense}
          >
            <PlusIcon size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
}
