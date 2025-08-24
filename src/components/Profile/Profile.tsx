import React, { useState, useEffect } from 'react';
import { UserProfile, UserPreferences } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../Common/Button';
import { useMood } from '../../contexts/MoodContext';
import Modal from '../Common/Modal';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'default-user',
    name: '',
    email: '',
    createdAt: new Date(),
    preferences: {
      dailyReminders: false,
      weeklyInsights: true,
      aiSuggestions: true,
      language: 'en',
      theme: 'light'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const { addNotification } = useNotification();
  const { state } = useMood();

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('manasikaProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          ...parsed,
          createdAt: new Date(parsed.createdAt)
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    // Validate required fields
    if (!profile.name.trim()) {
      addNotification({
        type: 'warning',
        message: 'Please enter your name'
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('manasikaProfile', JSON.stringify(profile));
    setIsEditing(false);

    addNotification({
      type: 'success',
      message: 'Profile updated successfully!'
    });
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const exportData = () => {
    const data = {
      profile,
      moodEntries: state.entries,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manasika-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      message: 'Data exported successfully!'
    });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('manasikaProfile');
      localStorage.removeItem('manasikaEntries');
      localStorage.removeItem('manasikaConversations');

      // Reset profile to defaults
      setProfile({
        id: 'default-user',
        name: '',
        email: '',
        createdAt: new Date(),
        preferences: {
          dailyReminders: false,
          weeklyInsights: true,
          aiSuggestions: true,
          language: 'en',
          theme: 'light'
        }
      });

      addNotification({
        type: 'info',
        message: 'All data cleared successfully'
      });

      // Refresh the page to reset all contexts
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Settings 👤</h1>
        <p>Manage your personal information and app preferences</p>
      </div>

      <div className="profile-layout">
        {/* Personal Information */}
        <div className="profile-section">
          <div className="section-card">
            <div className="section-header">
              <h3>Personal Information</h3>
              <Button
                variant="outline"
                size="small"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '✖️ Cancel' : '✏️ Edit'}
              </Button>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <Button variant="primary" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="profile-section">
          <div className="section-card">
            <h3>App Preferences</h3>

            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <strong>Daily Reminders</strong>
                  <p>Get reminded to check in with your mood daily</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profile.preferences.dailyReminders}
                    onChange={(e) => handlePreferenceChange('dailyReminders', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <strong>Weekly Insights</strong>
                  <p>Receive weekly summaries of your mood patterns</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profile.preferences.weeklyInsights}
                    onChange={(e) => handlePreferenceChange('weeklyInsights', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <strong>AI Suggestions</strong>
                  <p>Get personalized wellness tips from the AI coach</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profile.preferences.aiSuggestions}
                    onChange={(e) => handlePreferenceChange('aiSuggestions', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <strong>Language</strong>
                  <p>Choose your preferred language</p>
                </div>
                <select
                  value={profile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="preference-select"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <strong>Theme</strong>
                  <p>Choose your app appearance</p>
                </div>
                <select
                  value={profile.preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="preference-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="profile-section">
          <div className="section-card">
            <h3>Data & Privacy</h3>

            <div className="data-info">
              <div className="data-stats">
                <div className="data-stat">
                  <strong>{state.entries.length}</strong>
                  <span>Mood Entries</span>
                </div>
                <div className="data-stat">
                  <strong>{Math.round(state.stats.averageMood * 10) / 10}</strong>
                  <span>Average Mood</span>
                </div>
                <div className="data-stat">
                  <strong>Local</strong>
                  <span>Storage Only</span>
                </div>
              </div>

              <p className="privacy-note">
                🔒 <strong>Privacy First:</strong> All your data is stored locally on your device. 
                We don't collect, transmit, or store any personal information on external servers.
              </p>
            </div>

            <div className="data-actions">
              <Button
                variant="outline"
                onClick={() => setShowDataModal(true)}
              >
                📄 View Data Details
              </Button>

              <Button
                variant="outline"
                onClick={exportData}
              >
                📥 Export Data
              </Button>

              <Button
                variant="outline"
                onClick={clearAllData}
                style={{ color: '#dc3545', borderColor: '#dc3545' }}
              >
                🗑️ Clear All Data
              </Button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="profile-section">
          <div className="section-card">
            <h3>About Manasika.AI</h3>

            <div className="about-content">
              <div className="app-info">
                <div className="info-row">
                  <strong>Version:</strong> 1.0.0
                </div>
                <div className="info-row">
                  <strong>Created:</strong> {profile.createdAt.toLocaleDateString()}
                </div>
                <div className="info-row">
                  <strong>Purpose:</strong> AI-Powered Mental Wellness Companion
                </div>
              </div>

              <p className="about-description">
                Manasika.AI is designed to support your mental wellness journey through mood tracking, 
                AI-powered coaching, and personal insights. Remember, this app is a supportive tool 
                and not a replacement for professional mental health care.
              </p>

              <div className="crisis-resources">
                <h4>🚨 Crisis Resources</h4>
                <p>If you're in crisis, please contact:</p>
                <ul>
                  <li><strong>US:</strong> 988 (Suicide & Crisis Lifeline)</li>
                  <li><strong>UK:</strong> 116 123 (Samaritans)</li>
                  <li><strong>India:</strong> 9152987821 (AASRA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Details Modal */}
      <Modal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
        title="Your Data Overview"
        size="medium"
      >
        <div className="data-details">
          <div className="data-section">
            <h4>Storage Information</h4>
            <ul>
              <li><strong>Location:</strong> Local browser storage only</li>
              <li><strong>Encryption:</strong> Browser-level security</li>
              <li><strong>Sharing:</strong> Never shared with third parties</li>
              <li><strong>Backup:</strong> Manual export only</li>
            </ul>
          </div>

          <div className="data-section">
            <h4>Data Types Stored</h4>
            <ul>
              <li><strong>Profile:</strong> Name, email, preferences</li>
              <li><strong>Mood Entries:</strong> Date, mood level, notes</li>
              <li><strong>Chat History:</strong> Conversations with AI coach</li>
              <li><strong>Analytics:</strong> Computed statistics and trends</li>
            </ul>
          </div>

          <div className="data-section">
            <h4>Your Rights</h4>
            <ul>
              <li>View all your data anytime</li>
              <li>Export your data in JSON format</li>
              <li>Delete all data permanently</li>
              <li>Use the app without providing personal info</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
