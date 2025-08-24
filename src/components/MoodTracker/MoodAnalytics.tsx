import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import { getMoodDistribution, getTopMoodTriggers } from '../../utils/moodUtils';
import { MOOD_EMOJIS, MOOD_LABELS } from '../../types';

const MoodAnalytics: React.FC = () => {
  const { state } = useMood();
  const { entries, stats } = state;

  const moodDistribution = getMoodDistribution(entries);
  const triggers = getTopMoodTriggers(entries);

  const totalEntries = entries.length;

  return (
    <div className="section-card mood-analytics">
      <h3>Your Mood Analytics</h3>
      <p className="analytics-subtitle">Insights from your mood tracking journey</p>

      {totalEntries === 0 ? (
        <div className="analytics-empty">
          <p>📊 No data to analyze yet.</p>
          <p>Start tracking your mood to see insightful analytics!</p>
        </div>
      ) : (
        <div className="analytics-content">
          {/* Key Stats */}
          <div className="analytics-section">
            <h4>Key Statistics</h4>
            <div className="key-stats">
              <div className="key-stat">
                <div className="stat-value">{stats.averageMood.toFixed(1)}</div>
                <div className="stat-label">Average Mood</div>
              </div>
              <div className="key-stat">
                <div className="stat-value">{stats.streak}</div>
                <div className="stat-label">Good Days Streak</div>
              </div>
              <div className="key-stat">
                <div className="stat-value">{totalEntries}</div>
                <div className="stat-label">Total Entries</div>
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="analytics-section">
            <h4>Mood Distribution</h4>
            <div className="mood-distribution">
              {[1, 2, 3, 4, 5].map(mood => {
                const count = moodDistribution[mood] || 0;
                const percentage = totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(1) : '0';

                return (
                  <div key={mood} className="distribution-item">
                    <div className="distribution-mood">
                      <span className="distribution-emoji">{MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]}</span>
                      <span className="distribution-label">{MOOD_LABELS[mood as keyof typeof MOOD_LABELS]}</span>
                    </div>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="distribution-stats">
                      <span className="distribution-count">{count}</span>
                      <span className="distribution-percentage">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Trend */}
          <div className="analytics-section">
            <h4>Recent Trend</h4>
            <div className={`trend-indicator trend-${stats.moodTrend}`}>
              <div className="trend-icon">
                {stats.moodTrend === 'improving' && '📈'}
                {stats.moodTrend === 'declining' && '📉'}
                {stats.moodTrend === 'stable' && '➡️'}
              </div>
              <div className="trend-text">
                Your mood has been <strong>{stats.moodTrend}</strong> compared to last week
              </div>
            </div>
          </div>

          {/* Common Triggers */}
          {triggers.length > 0 && (
            <div className="analytics-section">
              <h4>Common Patterns</h4>
              <p className="section-subtitle">
                Words frequently mentioned during lower mood periods:
              </p>
              <div className="triggers-list">
                {triggers.map((trigger, index) => (
                  <span key={index} className="trigger-tag">
                    {trigger}
                  </span>
                ))}
              </div>
              <p className="triggers-note">
                💡 Consider discussing these patterns with a mental health professional for personalized insights.
              </p>
            </div>
          )}

          {/* Insights */}
          <div className="analytics-section">
            <h4>Insights & Recommendations</h4>
            <div className="insights-list">
              {stats.averageMood >= 4 && (
                <div className="insight insight-positive">
                  🌟 You're maintaining a positive mood! Keep up the great work with whatever you're doing.
                </div>
              )}

              {stats.averageMood < 3 && (
                <div className="insight insight-supportive">
                  💙 You've been going through a challenging time. Remember that it's okay to seek support.
                </div>
              )}

              {stats.streak >= 7 && (
                <div className="insight insight-celebration">
                  🎉 Amazing! You've had {stats.streak} consecutive good days. That's fantastic progress!
                </div>
              )}

              {entries.length >= 30 && (
                <div className="insight insight-milestone">
                  🏆 You've been consistently tracking your mood for a month! This self-awareness is powerful.
                </div>
              )}

              <div className="insight insight-general">
                📝 Regular mood tracking helps build emotional awareness and resilience over time.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalytics;
