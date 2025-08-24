import React, { useState } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useNotification } from '../../contexts/NotificationContext';
import { MOOD_EMOJIS, MOOD_LABELS, MoodValue } from '../../types';
import Button from '../Common/Button';

const QuickMood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const { addMoodEntry } = useMood();
  const { addNotification } = useNotification();

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      addNotification({
        type: 'warning',
        message: 'Please select a mood level first'
      });
      return;
    }

    addMoodEntry(selectedMood, 'Quick mood entry');
    addNotification({
      type: 'success',
      message: `Mood saved! You're feeling ${MOOD_LABELS[selectedMood].toLowerCase()} today. 😊`
    });
    setSelectedMood(null);
  };

  return (
    <div className="section-card quick-mood">
      <h3>How are you feeling today?</h3>
      <p className="quick-mood-subtitle">Take a moment to check in with yourself</p>

      <div className="mood-scale">
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            className={`mood-btn ${selectedMood === mood ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(mood as MoodValue)}
            title={MOOD_LABELS[mood as MoodValue]}
            aria-label={`Select mood: ${MOOD_LABELS[mood as MoodValue]}`}
          >
            <div className="mood-emoji">{MOOD_EMOJIS[mood as MoodValue]}</div>
            <div className="mood-label">{MOOD_LABELS[mood as MoodValue]}</div>
          </button>
        ))}
      </div>

      <div className="quick-mood-actions">
        <Button
          onClick={handleSaveMood}
          disabled={!selectedMood}
          variant="primary"
          size="medium"
        >
          Save Mood Entry
        </Button>
      </div>

      {selectedMood && (
        <div className="mood-preview">
          <p>You're feeling <strong>{MOOD_LABELS[selectedMood].toLowerCase()}</strong> today</p>
        </div>
      )}
    </div>
  );
};

export default QuickMood;
