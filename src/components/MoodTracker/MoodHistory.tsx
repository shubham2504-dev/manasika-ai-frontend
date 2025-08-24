import React, { useState } from 'react';
import { MoodEntry, MOOD_EMOJIS, MOOD_LABELS } from '../../types';
import { formatDate, formatRelativeDate } from '../../utils/helpers';
import { useMood } from '../../contexts/MoodContext';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'mood'>('date');
  const [filterMood, setFilterMood] = useState<number | 'all'>('all');
  const { deleteMoodEntry } = useMood();

  const handleViewEntry = (entry: MoodEntry) => {
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      deleteMoodEntry(entryId);
      setSelectedEntry(null);
    }
  };

  const filteredEntries = entries
    .filter(entry => filterMood === 'all' || entry.mood === filterMood)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.mood - a.mood;
      }
    });

  const exportData = () => {
    const csvContent = [
      'Date,Mood,Level,Note',
      ...entries.map(entry => 
        `${entry.date},${MOOD_LABELS[entry.mood as keyof typeof MOOD_LABELS]},${entry.mood},"${entry.note?.replace(/"/g, '""') || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="section-card mood-history">
      <div className="history-header">
        <h3>Mood History</h3>
        <div className="history-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'mood')}
            className="history-select"
          >
            <option value="date">Sort by Date</option>
            <option value="mood">Sort by Mood</option>
          </select>

          <select 
            value={filterMood} 
            onChange={(e) => setFilterMood(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="history-select"
          >
            <option value="all">All Moods</option>
            {[1, 2, 3, 4, 5].map(mood => (
              <option key={mood} value={mood}>
                {MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]} {MOOD_LABELS[mood as keyof typeof MOOD_LABELS]}
              </option>
            ))}
          </select>

          <Button variant="outline" size="small" onClick={exportData}>
            📥 Export
          </Button>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-item">
          <span className="stat-label">Total Entries:</span>
          <span className="stat-value">{entries.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered Results:</span>
          <span className="stat-value">{filteredEntries.length}</span>
        </div>
      </div>

      <div className="history-list">
        {filteredEntries.length === 0 ? (
          <div className="history-empty">
            <p>No entries match your current filter.</p>
            <p>Try adjusting the filters or add more mood entries! 📝</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="history-entry"
              onClick={() => handleViewEntry(entry)}
            >
              <div className="entry-mood">
                <div className="entry-emoji">{MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]}</div>
                <div className="entry-level">{entry.mood}/5</div>
              </div>

              <div className="entry-details">
                <div className="entry-date-row">
                  <span className="entry-date">{formatDate(entry.date)}</span>
                  <span className="entry-relative">{formatRelativeDate(entry.date)}</span>
                </div>
                {entry.note && (
                  <div className="entry-note-preview">
                    {entry.note.length > 80 
                      ? `${entry.note.substring(0, 80)}...`
                      : entry.note
                    }
                  </div>
                )}
              </div>

              <div className="entry-actions">
                <button 
                  className="entry-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewEntry(entry);
                  }}
                  aria-label="View entry details"
                >
                  👁️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Entry Detail Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title="Mood Entry Details"
        size="medium"
      >
        {selectedEntry && (
          <div className="entry-detail">
            <div className="detail-header">
              <div className="detail-mood">
                <span className="detail-emoji">{MOOD_EMOJIS[selectedEntry.mood as keyof typeof MOOD_EMOJIS]}</span>
                <div className="detail-mood-info">
                  <div className="detail-mood-label">{MOOD_LABELS[selectedEntry.mood as keyof typeof MOOD_LABELS]}</div>
                  <div className="detail-mood-level">{selectedEntry.mood} out of 5</div>
                </div>
              </div>
              <div className="detail-date">
                <div className="detail-date-main">{formatDate(selectedEntry.date)}</div>
                <div className="detail-date-relative">{formatRelativeDate(selectedEntry.date)}</div>
              </div>
            </div>

            {selectedEntry.note && (
              <div className="detail-note">
                <h4>Notes:</h4>
                <p>{selectedEntry.note}</p>
              </div>
            )}

            <div className="detail-meta">
              <p><strong>Created:</strong> {new Date(selectedEntry.createdAt).toLocaleString()}</p>
              {selectedEntry.updatedAt && selectedEntry.updatedAt !== selectedEntry.createdAt && (
                <p><strong>Updated:</strong> {new Date(selectedEntry.updatedAt).toLocaleString()}</p>
              )}
            </div>

            <div className="detail-actions">
              <Button
                variant="outline"
                onClick={() => setSelectedEntry(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteEntry(selectedEntry.id)}
                style={{ color: '#dc3545', borderColor: '#dc3545' }}
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MoodHistory;
