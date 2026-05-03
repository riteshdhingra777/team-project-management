import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Menu, X, Zap } from "lucide-react";
import { useAuth } from "../store/auth";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/my-tasks", label: "My Tasks", icon: ListTodo },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo" id="logo-link">
          <div className="logo-icon">
            <Zap size={20} />
          </div>
          <span className="logo-text">TeamTask</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
              className={`navbar-link ${isActive(link.to) ? "active" : ""}`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {user && (
            <div className="navbar-user">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
            </div>
          )}
          <button
            id="logout-btn"
            onClick={logout}
            className="navbar-logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu glass">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-mobile-link ${isActive(link.to) ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
