import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Menu, X, Zap, Sun, Moon } from "lucide-react";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/my-tasks", label: "My Tasks", icon: ListTodo },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo" id="logo-link">
          <div className="logo-icon">
            <Zap size={17} />
          </div>
          <span className="logo-text">TeamTask</span>
        </Link>

        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
              className={`navbar-link ${isActive(link.to) ? "active" : ""}`}
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

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
            className="icon-btn danger"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-mobile-link ${isActive(link.to) ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
