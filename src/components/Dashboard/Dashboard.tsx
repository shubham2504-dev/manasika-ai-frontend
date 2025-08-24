import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import QuickMood from './QuickMood';
import MoodChart from './MoodChart';
import RecentEntries from './RecentEntries';
import StatsCards from './StatsCards';
import { getMoodMessage } from '../../utils/moodUtils';

const Dashboard: React.FC = () => {
  const { state } = useMood();
  const { stats, entries, isLoading } = state;

  const motivationalMessage = getMoodMessage(stats.averageMood);

  if (isLoading) {
    return <div className="dashboard-loading">Loading your wellness dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <p className="dashboard-subtitle">
          {motivationalMessage}
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="dashboard-section stats-section">
          <StatsCards stats={stats} />
        </div>

        {/* Quick Mood Entry */}
        <div className="dashboard-section quick-mood-section">
          <QuickMood />
        </div>

        {/* Mood Chart */}
        <div className="dashboard-section chart-section">
          <div className="section-card">
            <h3>Your Mood Trend (Last 7 Days)</h3>
            <MoodChart />
          </div>
        </div>

        {/* Recent Entries */}
        <div className="dashboard-section recent-section">
          <div className="section-card">
            <h3>Recent Entries</h3>
            <RecentEntries entries={entries.slice(0, 5)} />
            {entries.length === 0 && (
              <div className="empty-state">
                <p>No entries yet. Start by tracking your mood above! 📝</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section actions-section">
          <div className="section-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="action-btn"
                onClick={() => window.location.href = '/chat'}
              >
                💬 Chat with AI Coach
              </button>
              <button 
                className="action-btn"
                onClick={() => window.location.href = '/mood-tracker'}
              >
                📊 View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
