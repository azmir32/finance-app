'use client';
import { useState } from 'react';
import { Record } from '../../types/Record';
import deleteRecord from '../actions/deleteRecord';

// Helper function to get category emoji
const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'Food':
      return '🍔';
    case 'Transportation':
      return '🚗';
    case 'Shopping':
      return '🛒';
    case 'Entertainment':
      return '🎬';
    case 'Bills':
      return '💡';
    case 'Healthcare':
      return '🏥';
    default:
      return '📦';
  }
};

const RecordItem = ({ record }: { record: Record }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRecord = async (recordId: string) => {
    try {
      console.log(`🗑️ RecordItem: Starting deletion of record ${recordId}...`);
      console.log(`📊 RecordItem: Record details - Amount: $${record.amount}, Category: ${record.category}, Text: "${record.text}"`);
      
      setIsLoading(true);
      setError(null);

      const result = await deleteRecord(recordId);
      
      if (result.error) {
        console.error('❌ RecordItem: Delete operation failed:', result.error);
        setError(result.error);
      } else {
        console.log('✅ RecordItem: Record deleted successfully');
      }
    } catch (error) {
      console.error('❌ RecordItem: Unexpected error during record deletion:', error);
      setError('Failed to delete record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine border color based on expense amount
  const getBorderColor = (amount: number) => {
    if (amount > 100) return 'border-red-500';
    if (amount > 50) return 'border-yellow-500';
    return 'border-green-500';
  };

  return (
    <div
      className={`bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-600/50 border-l-4 ${getBorderColor(
        record?.amount
      )} hover:bg-white/90 dark:hover:bg-gray-700/90 hover:shadow-xl relative min-h-[140px] flex flex-col justify-between overflow-visible group transition-all duration-300`}
    >
      {/* Delete button */}
      <button
        onClick={() => handleDeleteRecord(record.id)}
        className={`absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white dark:border-gray-700 backdrop-blur-sm transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
          isLoading ? 'cursor-not-allowed scale-100' : ''
        }`}
        aria-label='Delete record'
        disabled={isLoading}
        title='Delete expense record'
      >
        {isLoading ? (
          <div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin'></div>
        ) : (
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className='absolute -top-8 left-0 right-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 text-xs text-red-700 dark:text-red-300 z-10'>
          <div className='flex items-center gap-1'>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className='flex-1 flex flex-col justify-between'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              {new Date(record?.date).toLocaleDateString()}
            </span>
            <span className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              ${record?.amount.toFixed(2)}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-lg'>
              {getCategoryEmoji(record?.category)}
            </span>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {record?.category}
            </span>
          </div>
        </div>

        <div className='text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed'>
          {record?.text}
        </div>
      </div>
    </div>
  );
};

export default RecordItem;