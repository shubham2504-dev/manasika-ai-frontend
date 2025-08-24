import { MoodEntry, MoodStats, ChartDataPoint } from '../types';
import { getDateRange } from './helpers';

export const calculateMoodStats = (entries: MoodEntry[]): MoodStats => {
  if (entries.length === 0) {
    return {
      averageMood: 0,
      totalEntries: 0,
      moodTrend: 'stable',
      streak: 0
    };
  }

  const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
  const averageMood = Number((totalMood / entries.length).toFixed(1));

  // Calculate trend (comparing last 7 days to previous 7 days)
  const last7Days = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entryDate >= sevenDaysAgo;
  });

  const previous7Days = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entryDate >= fourteenDaysAgo && entryDate < sevenDaysAgo;
  });

  let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (last7Days.length > 0 && previous7Days.length > 0) {
    const recentAvg = last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length;
    const previousAvg = previous7Days.reduce((sum, e) => sum + e.mood, 0) / previous7Days.length;
    const difference = recentAvg - previousAvg;

    if (difference > 0.2) moodTrend = 'improving';
    else if (difference < -0.2) moodTrend = 'declining';
  }

  // Calculate streak (consecutive days with mood >= 4)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  for (const entry of sortedEntries) {
    if (entry.mood >= 4) {
      streak++;
    } else {
      break;
    }
  }

  return {
    averageMood,
    totalEntries: entries.length,
    moodTrend,
    streak
  };
};

export const getMoodChartData = (entries: MoodEntry[], days: number = 7): ChartDataPoint[] => {
  const { start, end } = getDateRange(days);
  const chartData: ChartDataPoint[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === dateStr);

    chartData.push({
      label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: entry ? entry.mood : 0
    });
  }

  return chartData;
};

export const getMoodDistribution = (entries: MoodEntry[]): Record<number, number> => {
  const distribution: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  };

  entries.forEach(entry => {
    distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
  });

  return distribution;
};

export const getTopMoodTriggers = (entries: MoodEntry[]): string[] => {
  const lowMoodEntries = entries.filter(e => e.mood <= 2 && e.note);
  const triggers = new Map<string, number>();

  // Simple keyword extraction (in a real app, you'd use NLP)
  const commonTriggerWords = [
    'work', 'stress', 'tired', 'anxious', 'worried', 'overwhelmed',
    'sad', 'angry', 'frustrated', 'lonely', 'sleep', 'health'
  ];

  lowMoodEntries.forEach(entry => {
    if (entry.note) {
      const words = entry.note.toLowerCase().split(/\W+/);
      words.forEach(word => {
        if (commonTriggerWords.includes(word)) {
          triggers.set(word, (triggers.get(word) || 0) + 1);
        }
      });
    }
  });

  return Array.from(triggers.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([trigger]) => trigger);
};

export const getMoodColor = (mood: number): string => {
  const colors = {
    1: '#ff4757', // red
    2: '#ff6b81', // light red
    3: '#ffa502', // orange
    4: '#26de81', // light green
    5: '#2ed573'  // green
  };
  return colors[mood as keyof typeof colors] || '#777';
};

export const getMoodMessage = (averageMood: number): string => {
  if (averageMood >= 4.5) return "You're doing amazing! Keep up the great work! 🌟";
  if (averageMood >= 3.5) return "You're on a positive track! 🌱";
  if (averageMood >= 2.5) return "Some ups and downs - that's completely normal. 💙";
  if (averageMood >= 1.5) return "Going through a tough time? Remember, it's okay to seek support. 🤗";
  return "You're being so brave by tracking your feelings. Every small step counts. 💪";
};
