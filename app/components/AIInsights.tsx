'use client';

import { useState, useEffect } from 'react';
import { getAIInsights } from '../actions/getAiInsight';
import { generateInsightAnswer } from '../actions/generateInsightAnswer';

interface InsightData {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence?: number;
}

interface AIAnswer {
  insightId: string;
  answer: string;
  isLoading: boolean;
}

const AIInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiAnswers, setAiAnswers] = useState<AIAnswer[]>([]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const newInsights = await getAIInsights();
      setInsights(newInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ AIInsights: Failed to load AI insights:', error);
      // Fallback to mock data if AI fails
      setInsights([
        {
          id: 'fallback-1',
          type: 'info',
          title: 'AI Analysis Unavailable',
          message: 'Unable to analyze your expenses at the moment. Please try again later.',
          action: 'Retry analysis',
        },
        {
          id: 'fallback-2',
          type: 'tip',
          title: 'Manual Tracking',
          message: 'Continue tracking your expenses manually. We\'ll analyze them when the AI is available.',
          action: 'Keep tracking',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = async (insight: InsightData) => {
    if (!insight.action) return;

    // Check if answer is already loading or exists
    const existingAnswer = aiAnswers.find((a) => a.insightId === insight.id);
    if (existingAnswer) {
      // Remove the answer if it already exists (toggle functionality)
      setAiAnswers((prev) => prev.filter((a) => a.insightId !== insight.id));
      return;
    }

    // Add loading state
    setAiAnswers((prev) => [
      ...prev,
      {
        insightId: insight.id,
        answer: '',
        isLoading: true,
      },
    ]);

    try {
      // Generate question based on insight title and action
      const question = `${insight.title}: ${insight.action}`;

      // Use server action to generate AI answer
      const answer = await generateInsightAnswer(question);

      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id ? { ...a, answer, isLoading: false } : a
        )
      );
    } catch (error) {
      console.error('❌ Failed to generate AI answer:', error);
      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id
            ? {
                ...a,
                answer:
                  'Sorry, I was unable to generate a detailed answer. Please try again.',
                isLoading: false,
              }
            : a
        )
      );
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'tip':
        return '💡';
      case 'info':
        return 'ℹ️';
      default:
        return '🤖';
    }
  };

  const getInsightColors = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'tip':
        return 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getButtonColors = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200';
      case 'success':
        return 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200';
      case 'tip':
        return 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200';
      case 'info':
        return 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200';
      default:
        return 'text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200';
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Loading...';

    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return lastUpdated.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>🤖</span>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              AI Insights
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Analyzing your spending patterns
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin'></div>
            <span className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>
              Analyzing...
            </span>
          </div>
        </div>

        <div className='space-y-4'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='animate-pulse bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-600'
            >
              <div className='flex items-start gap-4'>
                <div className='w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg'></div>
                <div className='flex-1 space-y-3'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-full'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-2/3'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center'>
          <div className='flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <div className='w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse'></div>
            <span className='text-sm'>
              AI is analyzing your financial patterns...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>🤖</span>
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              AI Insights
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              AI financial analysis
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium'>
            <span className='w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full'></span>
            <span>{formatLastUpdated()}</span>
          </div>
          <button
            onClick={loadInsights}
            className='w-8 h-8 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200'
            disabled={isLoading}
          >
            <span className='text-sm'>🔄</span>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {insights.map((insight) => {
          const currentAnswer = aiAnswers.find(
            (a) => a.insightId === insight.id
          );

          return (
            <div
              key={insight.id}
              className={`relative overflow-hidden rounded-xl p-4 border-l-4 hover:shadow-lg transition-all duration-200 ${getInsightColors(
                insight.type
              )}`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        insight.type === 'warning'
                          ? 'bg-yellow-100 dark:bg-yellow-900/50'
                          : insight.type === 'success'
                          ? 'bg-green-100 dark:bg-green-900/50'
                          : insight.type === 'tip'
                          ? 'bg-emerald-100 dark:bg-emerald-900/50'
                          : 'bg-blue-100 dark:bg-blue-900/50'
                      }`}
                    >
                      <span className='text-lg'>
                        {getInsightIcon(insight.type)}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-gray-900 dark:text-gray-100 mb-1'>
                        {insight.title}
                      </h4>
                      {insight.confidence && insight.confidence < 0.8 && (
                        <span className='inline-block px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium'>
                          Preliminary
                        </span>
                      )}
                    </div>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4'>
                    {insight.message}
                  </p>
                  {insight.action && (
                    <div className='text-left'>
                      <span
                        onClick={() => handleActionClick(insight)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ${getButtonColors(
                          insight.type
                        )} hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                          currentAnswer ? 'bg-white/50 dark:bg-gray-700/50' : ''
                        }`}
                      >
                        <span>{insight.action}</span>
                        {currentAnswer?.isLoading ? (
                          <div className='w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <span className='text-xs'>
                            {currentAnswer ? '↑' : '→'}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* AI Answer Display */}
                  {currentAnswer && (
                    <div className='mt-4 p-3 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-600'>
                      <div className='flex items-start gap-3'>
                        <div className='w-6 h-6 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                          <span className='text-white text-xs'>🤖</span>
                        </div>
                        <div className='flex-1'>
                          <h5 className='font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2'>
                            AI Answer:
                          </h5>
                          {currentAnswer.isLoading ? (
                            <div className='space-y-2'>
                              <div className='animate-pulse bg-gray-200 dark:bg-gray-600 h-2 rounded-lg w-full'></div>
                              <div className='animate-pulse bg-gray-200 dark:bg-gray-600 h-2 rounded-lg w-3/4'></div>
                              <div className='animate-pulse bg-gray-200 dark:bg-gray-600 h-2 rounded-lg w-1/2'></div>
                            </div>
                          ) : (
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
                              {currentAnswer.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
            <div className='w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center'>
              <span className='text-sm'>🧠</span>
            </div>
            <span className='font-medium text-sm'>Powered by AI analysis</span>
          </div>
          <button
            onClick={loadInsights}
            className='px-4 py-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200'
          >
            <span className='sm:hidden'>Refresh</span>
            <span className='hidden sm:inline'>Refresh Insights →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
