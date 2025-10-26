import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  PackageCheck,
  MapPin,
  ClipboardList,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { ProfilePopup } from "./ProfilePopup";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode-override");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode-override");
    }
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleProfileClick = () => {
    setShowProfilePopup((prev) => !prev);
  };

  const handleProfileNavigate = (path: string) => {
    setShowProfilePopup(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowProfilePopup(false);
    // Add logout logic here (clear session, redirect, etc.)
    navigate("/");
  };

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="mobile-header__logo">
          <Truck size={24} />
          <span>LogisticsHub</span>
        </div>
        <button
          className="dark-mode-toggle"
          onClick={handleToggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <Truck size={32} className="sidebar__logo-icon" />
            <div className="sidebar__logo-text">
              <h2>LogisticsHub</h2>
              <p>Agri-Business Portal</p>
            </div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item--active" : ""}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/fleet"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item--active" : ""}`
            }
          >
            <Truck size={20} />
            <span>Fleet Management</span>
          </NavLink>

          <NavLink
            to="/assign"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item--active" : ""}`
            }
          >
            <ClipboardList size={20} />
            <span>Vehicle Assignment</span>
          </NavLink>

          <NavLink
            to="/deliveries"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item--active" : ""}`
            }
          >
            <MapPin size={20} />
            <span>Active Deliveries</span>
          </NavLink>

          <NavLink
            to="/loads"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item--active" : ""}`
            }
          >
            <PackageCheck size={20} />
            <span>Load Management</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <div className="user-profile" onClick={handleProfileClick}>
            <div className="user-profile__avatar">LM</div>
            <div className="user-profile__info">
              <p className="user-profile__name">Logistics Manager</p>
              <p className="user-profile__role">Admin</p>
            </div>
          </div>
          {showProfilePopup && (
            <ProfilePopup
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onNavigate={handleProfileNavigate}
              onLogout={handleLogout}
              onClose={() => setShowProfilePopup(false)}
            />
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">{children}</main>
    </div>
  );
};
