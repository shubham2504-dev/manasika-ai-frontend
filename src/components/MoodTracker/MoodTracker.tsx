import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import MoodForm from './MoodForm';
import MoodHistory from './MoodHistory';
import MoodAnalytics from './MoodAnalytics';

const MoodTracker: React.FC = () => {
  const { state } = useMood();

  return (
    <div className="mood-tracker">
      <div className="mood-tracker-header">
        <h1>Mood Tracker 📊</h1>
        <p>Track your daily emotional state and gain insights into your mental wellness journey</p>
      </div>

      <div className="mood-tracker-layout">
        {/* Mood Entry Form */}
        <div className="mood-tracker-section form-section">
          <MoodForm />
        </div>

        {/* Analytics */}
        <div className="mood-tracker-section analytics-section">
          <MoodAnalytics />
        </div>

        {/* History */}
        <div className="mood-tracker-section history-section">
          <MoodHistory entries={state.entries} />
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
