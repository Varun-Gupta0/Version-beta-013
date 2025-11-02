import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Activity } from 'lucide-react';

interface AiInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  timestamp: string;
  confidence?: number;
}

interface AiInsightsProps {
  userId?: string;
  limit?: number;
}

export default function AiInsights({ userId, limit = 10 }: AiInsightsProps) {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'alerts' | 'recommendations' | 'predictions'>('all');

  useEffect(() => {
    // Mock AI insights - in real app, this would come from AI service API
    const mockInsights: AiInsight[] = [
      {
        id: '1',
        type: 'alert',
        title: 'Blood Pressure Trend Alert',
        description: 'Your blood pressure readings have shown a gradual increase over the past 3 months. Consider scheduling a follow-up with your cardiologist.',
        severity: 'medium',
        category: 'Cardiovascular',
        actionable: true,
        timestamp: '2024-01-15T10:30:00Z',
        confidence: 0.85
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Preventive Care Suggestion',
        description: 'Based on your age and family history, consider getting screened for diabetes annually. Early detection can prevent complications.',
        severity: 'low',
        category: 'Preventive Care',
        actionable: true,
        timestamp: '2024-01-14T14:20:00Z',
        confidence: 0.92
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Medication Adherence Prediction',
        description: 'AI analysis suggests you may benefit from medication reminders. Your prescription refill pattern shows occasional delays.',
        severity: 'low',
        category: 'Medication Management',
        actionable: true,
        timestamp: '2024-01-13T09:15:00Z',
        confidence: 0.78
      },
      {
        id: '4',
        type: 'trend',
        title: 'Positive Health Trend',
        description: 'Great progress! Your exercise frequency has increased by 40% this month, correlating with improved sleep quality.',
        severity: 'low',
        category: 'Lifestyle',
        actionable: false,
        timestamp: '2024-01-12T16:45:00Z',
        confidence: 0.88
      },
      {
        id: '5',
        type: 'alert',
        title: 'Appointment Follow-up Needed',
        description: 'It\'s been 6 months since your last dental check-up. Regular dental care is important for overall health.',
        severity: 'medium',
        category: 'Preventive Care',
        actionable: true,
        timestamp: '2024-01-11T11:00:00Z',
        confidence: 0.95
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'prediction':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'trend':
        return <Activity className="w-5 h-5 text-green-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-red-200 dark:border-red-800';
      case 'recommendation':
        return 'border-blue-200 dark:border-blue-800';
      case 'prediction':
        return 'border-purple-200 dark:border-purple-800';
      case 'trend':
        return 'border-green-200 dark:border-green-800';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (filter === 'all') return true;
    if (filter === 'alerts') return insight.type === 'alert';
    if (filter === 'recommendations') return insight.type === 'recommendation';
    if (filter === 'predictions') return insight.type === 'prediction';
    return true;
  }).slice(0, limit);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            AI Health Insights
          </h2>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'alerts', label: 'Alerts' },
              { key: 'recommendations', label: 'Recommendations' },
              { key: 'predictions', label: 'Predictions' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 text-sm rounded ${
                  filter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No insights available for the selected filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className={`border-l-4 p-4 rounded-r-lg ${getTypeColor(insight.type)} bg-gray-50 dark:bg-gray-700/50`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(insight.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{insight.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </span>
                    {insight.confidence && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(insight.timestamp).toLocaleString()}
                  </div>
                  {insight.actionable && (
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {insights.length > limit && (
          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Load More Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
