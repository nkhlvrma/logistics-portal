import React from "react";
import {
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  FileText,
  BookOpen,
  X,
} from "lucide-react";
import "./ProfilePopup.css";

interface ProfilePopupProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onClose?: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
  darkMode,
  onToggleDarkMode,
  onNavigate,
  onLogout,
  onClose,
}) => {
  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <button
          className="profile-popup-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <div className="profile-popup__header">
          <div className="profile-popup__avatar">LM</div>
          <div className="profile-popup__info">
            <div className="profile-popup__name">Logistics Manager</div>
            <div className="profile-popup__role">Admin</div>
          </div>
        </div>
        <div className="profile-popup__actions">
          <button className="profile-popup__action" onClick={onToggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            className="profile-popup__action"
            onClick={() => onNavigate("/settings")}
          >
            {" "}
            <Settings size={18} /> <span>Settings</span>{" "}
          </button>
          <button
            className="profile-popup__action"
            onClick={() => onNavigate("/faqs")}
          >
            {" "}
            <BookOpen size={18} /> <span>FAQs</span>{" "}
          </button>
          <button
            className="profile-popup__action"
            onClick={() => onNavigate("/help")}
          >
            {" "}
            <HelpCircle size={18} /> <span>Help</span>{" "}
          </button>
          <button
            className="profile-popup__action"
            onClick={() => onNavigate("/privacy")}
          >
            {" "}
            <ShieldCheck size={18} /> <span>Privacy Policy</span>{" "}
          </button>
          <button
            className="profile-popup__action"
            onClick={() => onNavigate("/terms")}
          >
            {" "}
            <FileText size={18} /> <span>Terms & Conditions</span>{" "}
          </button>
        </div>
        <div className="profile-popup__footer">
          <button className="profile-popup__logout" onClick={onLogout}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
