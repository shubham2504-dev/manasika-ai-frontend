import React from 'react';
import { MoodStats } from '../../types';

interface StatsCardsProps {
  stats: MoodStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const getTrendEmoji = (trend: MoodStats['moodTrend']) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: MoodStats['moodTrend']) => {
    switch (trend) {
      case 'improving': return 'trend-improving';
      case 'declining': return 'trend-declining';
      default: return 'trend-stable';
    }
  };

  const cards = [
    {
      title: 'Average Mood',
      value: stats.averageMood > 0 ? stats.averageMood.toFixed(1) : 'N/A',
      subtitle: 'out of 5.0',
      icon: '💝',
      color: 'primary'
    },
    {
      title: 'Total Entries',
      value: stats.totalEntries.toString(),
      subtitle: 'mood logs',
      icon: '📊',
      color: 'secondary'
    },
    {
      title: 'Mood Trend',
      value: stats.moodTrend.charAt(0).toUpperCase() + stats.moodTrend.slice(1),
      subtitle: 'vs last week',
      icon: getTrendEmoji(stats.moodTrend),
      color: getTrendColor(stats.moodTrend)
    },
    {
      title: 'Streak',
      value: stats.streak.toString(),
      subtitle: 'good days',
      icon: '🔥',
      color: 'accent'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className={`stats-card stats-card-${card.color}`}>
          <div className="stats-card-icon">{card.icon}</div>
          <div className="stats-card-content">
            <div className="stats-card-value">{card.value}</div>
            <div className="stats-card-title">{card.title}</div>
            <div className="stats-card-subtitle">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
