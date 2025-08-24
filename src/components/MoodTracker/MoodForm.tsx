import React, { useState } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useNotification } from '../../contexts/NotificationContext';
import { MOOD_EMOJIS, MOOD_LABELS, MoodValue } from '../../types';
import Button from '../Common/Button';

const MoodForm: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addMoodEntry } = useMood();
  const { addNotification } = useNotification();

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMood) {
      addNotification({
        type: 'warning',
        message: 'Please select a mood level'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addMoodEntry(selectedMood, note.trim(), date);

      addNotification({
        type: 'success',
        message: `Mood entry saved! You felt ${MOOD_LABELS[selectedMood].toLowerCase()} on ${new Date(date).toLocaleDateString()}`
      });

      // Reset form
      setSelectedMood(null);
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save mood entry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="section-card mood-form">
      <h3>Log Your Mood</h3>
      <p className="form-subtitle">Take a moment to reflect on how you're feeling</p>

      <form onSubmit={handleSubmit}>
        {/* Date Input */}
        <div className="form-group">
          <label htmlFor="mood-date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="mood-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="form-input"
            required
          />
        </div>

        {/* Mood Scale */}
        <div className="form-group">
          <label className="form-label">How are you feeling?</label>
          <div className="mood-scale-large">
            {[1, 2, 3, 4, 5].map((mood) => (
              <button
                key={mood}
                type="button"
                className={`mood-option ${selectedMood === mood ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood as MoodValue)}
                aria-label={`Select mood: ${MOOD_LABELS[mood as MoodValue]}`}
              >
                <div className="mood-emoji">{MOOD_EMOJIS[mood as MoodValue]}</div>
                <div className="mood-label">{MOOD_LABELS[mood as MoodValue]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="mood-note" className="form-label">
            Notes (optional)
          </label>
          <textarea
            id="mood-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? Any thoughts about your mood today..."
            className="form-textarea"
            rows={4}
            maxLength={500}
          />
          <div className="char-count">
            {note.length}/500 characters
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!selectedMood || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </form>

      {/* Preview */}
      {selectedMood && (
        <div className="mood-preview">
          <div className="preview-header">Preview:</div>
          <div className="preview-content">
            <span className="preview-emoji">{MOOD_EMOJIS[selectedMood]}</span>
            <span className="preview-text">
              Feeling {MOOD_LABELS[selectedMood].toLowerCase()} on {new Date(date).toLocaleDateString()}
            </span>
            {note && (
              <div className="preview-note">
                "{note.substring(0, 50)}{note.length > 50 ? '...' : ''}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodForm;
