// Global Types for Manasika.AI

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  dailyReminders: boolean;
  weeklyInsights: boolean;
  aiSuggestions: boolean;
  language: "en" | "hi";
  theme: "light" | "dark";
}

export interface AIProvider {
  name: "openai" | "huggingface" | "claude" | "fallback";
  apiKey?: string;
  model?: string;
}

export interface AppConfig {
  aiProvider: AIProvider;
  features: {
    enableFirebase: boolean;
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
  };
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  moodTrend: "improving" | "declining" | "stable";
  streak: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface NotificationType {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

// Mood scale constants
export const MOOD_SCALE = {
  VERY_LOW: 1,
  LOW: 2,
  NEUTRAL: 3,
  GOOD: 4,
  VERY_HIGH: 5,
} as const;

export const MOOD_LABELS = {
  [MOOD_SCALE.VERY_LOW]: "Very Low",
  [MOOD_SCALE.LOW]: "Low",
  [MOOD_SCALE.NEUTRAL]: "Neutral",
  [MOOD_SCALE.GOOD]: "Good",
  [MOOD_SCALE.VERY_HIGH]: "Very High",
} as const;

export const MOOD_EMOJIS = {
  [MOOD_SCALE.VERY_LOW]: "😢",
  [MOOD_SCALE.LOW]: "😕",
  [MOOD_SCALE.NEUTRAL]: "😐",
  [MOOD_SCALE.GOOD]: "🙂",
  [MOOD_SCALE.VERY_HIGH]: "😊",
} as const;

export type MoodValue = (typeof MOOD_SCALE)[keyof typeof MOOD_SCALE];
