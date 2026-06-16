import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'nav-link active' : 'nav-link'
      }
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function SectionLabel({ text }) {
  return <div className="nav-section-label">{text}</div>;
}

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const isAdminOrLibrarian =
    hasRole('Admin') || hasRole('Librarian');

  const isAdmin = hasRole('Admin');

  const initials =
    user?.fullName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryRole =
    user?.roles?.[0] || 'Member';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-row">
          <div className="logo-icon">📚</div>

          <div>
            <div className="logo-title">
              Open Library
            </div>

            <div className="logo-subtitle">
              Library Management System
            </div>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {initials}
        </div>

        <div className="user-info">
          <div className="user-name">
            {user?.fullName}
          </div>

          <div className="user-role">
            {primaryRole}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <SectionLabel text="MAIN MENU" />

        <NavItem
          to="/dashboard"
          icon="🏠"
          label="Dashboard"
        />

        <NavItem
          to="/books"
          icon="📚"
          label="Catalog"
        />

        <NavItem
          to="/my-history"
          icon="🕓"
          label="My Borrows"
        />

        {isAdminOrLibrarian && (
          <>
            <SectionLabel text="MANAGEMENT" />

            <NavItem
              to="/borrows"
              icon="🔄"
              label="Circulation"
            />

            <NavItem
              to="/overdue-books"
              icon="⚠️"
              label="Overdue"
            />

            <NavItem
              to="/reports"
              icon="📊"
              label="Reports"
            />
          </>
        )}

        {isAdmin && (
          <>
            <SectionLabel text="ADMINISTRATION" />

            <NavItem
              to="/users"
              icon="👥"
              label="Patrons"
            />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-logout" style={{ borderTop: "none" }}>
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          ← Sign Out
        </button>
      </div>
    </aside>
  );
}