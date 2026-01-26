import React from 'react';
import { Layers, Settings, Sun, Moon } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, theme, onToggleTheme }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brandLogo" title="Purge Digital">
        <img className="brandLogoImage" src="https://i.imgur.com/QjjDjuU.png" alt="Purge Digital logo" />
      </div>
      <div className="brandTitle">
        <span className="brandTitleStrong">Purge</span>
        <span className="brandTitleLight">Digital</span>
      </div>
    </div>

    <div className="nav">
      <div className="navSection">Platform</div>

      <button
        className={`navItem ${activeTab === 'dashboard' ? 'navItemActive' : ''}`}
        type="button"
        onClick={() => onTabChange('dashboard')}
      >
        <Layers className="navIcon" />
        <span className="navLabel">Filtration System</span>
      </button>

      <button
        className={`navItem ${activeTab === 'settings' ? 'navItemActive' : ''}`}
        type="button"
        onClick={() => onTabChange('settings')}
      >
        <Settings className="navIcon" />
        <span className="navLabel">Settings</span>
      </button>
    </div>

    <div className="sidebarFooter">
      <div className="profileCard">
        <div className="avatar">PL</div>
        <div className="profileMeta">
          <div className="profileName">Local Pipeline</div>
          <div className="profileSub">End-to-end workflow</div>
        </div>
        <button
          className="themeBtn"
          type="button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  </aside>
);

export default Sidebar;
