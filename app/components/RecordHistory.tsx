import getRecords from '../actions/getRecords';
import RecordItem from './RecordItem';
import { Record } from '../../types/Record';

const RecordHistory = async () => {
  const { records, error } = await getRecords();

  if (error) {
    return (
      <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>📝</span>
          </div>
          <div>
            <h3 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
              Expense History
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Your spending timeline
            </p>
          </div>
        </div>
        <div className='bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-l-red-500 p-4 rounded-xl'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-8 h-8 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center'>
              <span className='text-lg'>⚠️</span>
            </div>
            <h4 className='font-bold text-red-800 dark:text-red-300'>
              Error loading expense history
            </h4>
          </div>
          <p className='text-red-700 dark:text-red-400 ml-11 text-sm'>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>📝</span>
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense History
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Your spending timeline
            </p>
          </div>
        </div>
        <div className='text-center py-12'>
          <div className='w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6'>
            <span className='text-3xl'>📊</span>
          </div>
          <h4 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-3'>
            No Expense Records Found
          </h4>
          <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed'>
            Start tracking your expenses to see your spending history and
            patterns here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-lg'>📝</span>
        </div>
        <div>
          <h3 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
            Expense History
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Your spending timeline
          </p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {records.slice(0, 6).map((record: Record) => (
          <RecordItem key={record.id} record={record} />
        ))}
      </div>
      
      {records.length > 6 && (
        <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Showing 6 of {records.length} records
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordHistory;