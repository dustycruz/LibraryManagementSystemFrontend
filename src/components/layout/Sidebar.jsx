import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function SectionLabel({ text }) {
  return (
    <div className="nav-section-label">
      {text}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrLibrarian = hasRole('Admin') || hasRole('Librarian');
  const isAdmin = hasRole('Admin');

  const getUserInitials = () => {
    return user?.fullName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">📚</div>
        <div className="logo-text">
          <div className="logo-title">LibraryMS</div>
          <div className="logo-subtitle">System</div>
        </div>
      </div>

      {/* User Info - Minimalist */}
      <div className="sidebar-user">
        <div className="user-avatar">{getUserInitials()}</div>
        <div className="user-info">
          <div className="user-name">{user?.fullName}</div>
          <div className="user-email">{user?.email}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <SectionLabel text="Main" />
        <NavItem to="/dashboard" icon="🏠" label="Dashboard" />
        <NavItem to="/books" icon="📖" label="Books Catalog" />
        <NavItem to="/my-history" icon="🕓" label="My Borrow History" />

        {isAdminOrLibrarian && (
          <>
            <SectionLabel text="Management" />
            <NavItem to="/borrows" icon="🔄" label="Manage Borrows" />
            <NavItem to="/overdue-books" icon="⚠️" label="Overdue Books" />
            <NavItem to="/reports" icon="📊" label="Reports" />
          </>
        )}

        {isAdmin && (
          <>
            <SectionLabel text="Administration" />
            <NavItem to="/users" icon="👥" label="User Management" />
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-btn">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}