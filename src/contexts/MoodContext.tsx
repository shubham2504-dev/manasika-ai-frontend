import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MoodEntry, MoodStats } from '../types';
import { generateId } from '../utils/helpers';
import { calculateMoodStats } from '../utils/moodUtils';

interface MoodState {
  entries: MoodEntry[];
  stats: MoodStats;
  isLoading: boolean;
  error: string | null;
}

type MoodAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ENTRIES'; payload: MoodEntry[] }
  | { type: 'ADD_ENTRY'; payload: MoodEntry }
  | { type: 'UPDATE_ENTRY'; payload: { id: string; updates: Partial<MoodEntry> } }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'UPDATE_STATS'; payload: MoodStats };

const initialState: MoodState = {
  entries: [],
  stats: {
    averageMood: 0,
    totalEntries: 0,
    moodTrend: 'stable',
    streak: 0
  },
  isLoading: false,
  error: null
};

const moodReducer = (state: MoodState, action: MoodAction): MoodState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.updates, updatedAt: new Date() }
            : entry
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

interface MoodContextType {
  state: MoodState;
  addMoodEntry: (mood: number, note?: string, date?: string) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  getEntriesForDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
  getMoodTrend: (days?: number) => MoodEntry[];
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('manasikaEntries');
    if (savedEntries) {
      try {
        const entries: MoodEntry[] = JSON.parse(savedEntries);
        // Convert date strings back to Date objects
        const parsedEntries = entries.map(entry => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt)
        }));
        dispatch({ type: 'SET_ENTRIES', payload: parsedEntries });
      } catch (error) {
        console.error('Error loading saved entries:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' });
      }
    } else {
      // Add sample data for first-time users
      const sampleEntries: MoodEntry[] = [
        {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          mood: 4,
          note: 'Feeling good today! Working on my mental health.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: generateId(),
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          mood: 3,
          note: 'Average day, some ups and downs.',
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000)
        }
      ];
      dispatch({ type: 'SET_ENTRIES', payload: sampleEntries });
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (state.entries.length > 0) {
      localStorage.setItem('manasikaEntries', JSON.stringify(state.entries));
    }
  }, [state.entries]);

  // Update stats whenever entries change
  useEffect(() => {
    const stats = calculateMoodStats(state.entries);
    dispatch({ type: 'UPDATE_STATS', payload: stats });
  }, [state.entries]);

  const addMoodEntry = (mood: number, note?: string, date?: string) => {
    const entry: MoodEntry = {
      id: generateId(),
      date: date || new Date().toISOString().split('T')[0],
      mood,
      note: note || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const updateMoodEntry = (id: string, updates: Partial<MoodEntry>) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, updates } });
  };

  const deleteMoodEntry = (id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const getEntriesForDateRange = (startDate: Date, endDate: Date): MoodEntry[] => {
    return state.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const getMoodTrend = (days: number = 7): MoodEntry[] => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return getEntriesForDateRange(startDate, endDate);
  };

  const contextValue: MoodContextType = {
    state,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getEntriesForDateRange,
    getMoodTrend
  };

  return (
    <MoodContext.Provider value={contextValue}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
