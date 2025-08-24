import React from 'react';
import { MoodEntry, MOOD_EMOJIS } from '../../types';
import { formatRelativeDate } from '../../utils/helpers';

interface RecentEntriesProps {
  entries: MoodEntry[];
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="recent-entries-empty">
        <p>No recent entries yet.</p>
        <p>Start tracking your mood to see your history here! 📝</p>
      </div>
    );
  }

  return (
    <div className="recent-entries">
      {entries.map((entry) => (
        <div key={entry.id} className="recent-entry">
          <div className="entry-mood">
            <span className="entry-emoji">{MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]}</span>
          </div>
          <div className="entry-details">
            <div className="entry-date">
              {formatRelativeDate(entry.date)}
            </div>
            {entry.note && (
              <div className="entry-note">
                {entry.note.length > 50 
                  ? `${entry.note.substring(0, 50)}...`
                  : entry.note
                }
              </div>
            )}
          </div>
          <div className="entry-mood-level">
            {entry.mood}/5
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentEntries;
