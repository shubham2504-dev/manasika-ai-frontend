import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand">
          <h1 className="brand-title">🧠 Manasika.AI</h1>
          <p className="brand-subtitle">Your AI-Powered Mental Wellness Companion</p>
        </div>

        <div className="header-actions">
          <button className="header-btn" title="Notifications">
            🔔
          </button>
          <button className="header-btn" title="Settings">
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
