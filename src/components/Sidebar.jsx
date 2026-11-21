import {
  WalletIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  UsersIcon,
  PieChartIcon,
  SparklesIcon,
  XIcon,
  ShieldCheckIcon,
} from './Icons';

export default function Sidebar({
  activeTab,
  setActiveTab,
  memberCount,
  expenseCount,
  onLoadSampleGroup,
  mobileOpen,
  setMobileOpen,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, badge: null },
    { id: 'expenses', label: 'Expenses', icon: ReceiptIcon, badge: expenseCount > 0 ? expenseCount : null },
    { id: 'group', label: 'Group Setup', icon: UsersIcon, badge: `${memberCount}/6` },
    { id: 'balances', label: 'Balances & Settle', icon: PieChartIcon, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <div className="brand-icon-box">
              <WalletIcon size={24} className="brand-icon" />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                Split<span>Easy</span>
              </div>
              <span className="brand-tag">EXPENSE TRACKER</span>
            </div>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-section-title">MAIN MENU</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <div className="nav-item-content">
                  <Icon size={19} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </div>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Quick Test Callout */}
        <div className="sidebar-callout">
          <div className="callout-header">
            <SparklesIcon size={16} className="callout-icon" />
            <span>Quick Demo</span>
          </div>
          <p className="callout-desc">
            Load a sample group with 3 members and shared expenses in 1 click.
          </p>
          <button
            type="button"
            className="callout-btn"
            onClick={() => {
              onLoadSampleGroup();
              setActiveTab('dashboard');
              setMobileOpen(false);
            }}
          >
            Load Sample Group
          </button>
        </div>

        {/* User Visual Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-card">
            <div className="profile-avatar">JA</div>
            <div className="profile-info">
              <div className="profile-name">Jeevitha A</div>
              <div className="profile-role">Workspace Admin</div>
            </div>
          </div>
          <div className="profile-badge-row">
            <span className="profile-status-pill">
              <ShieldCheckIcon size={13} /> Active Workspace
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
