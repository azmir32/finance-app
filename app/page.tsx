import AddNewRecord from './components/AddNewRecord';
import AIInsights from './components/AIInsights';
import ExpenseStats from './components/ExpenseStats';
import Guest from './components/Guest';
import RecordChart from './components/RecordChart';
import RecordHistory from './components/RecordHistory';
import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '../lib/checkUser';
import Image from 'next/image';
import { BarChart3, TrendingUp, History, Brain } from 'lucide-react';

// Force dynamic rendering since we use currentUser()
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    console.log('🏠 HomePage: Starting page load...');
    
    const user = await currentUser();
    if (!user) {
      console.log('👤 HomePage: No authenticated user, showing guest component');
      return <Guest />;
    }

    console.log(`✅ HomePage: User authenticated - ${user.firstName} ${user.lastName}`);

    // Sync user to database
    try {
      console.log('🔄 HomePage: Syncing user to database...');
      await checkUser();
      console.log('✅ HomePage: User successfully synced to database');
    } catch (syncError) {
      console.error('❌ HomePage: Failed to sync user to database:', syncError);
      // Continue rendering the page even if sync fails
    }

    console.log('🎨 HomePage: Rendering authenticated user interface...');

    return (
      <main className='bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-all duration-500'>
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%239C92AC%27%20fill-opacity%3D%270.05%27%3E%3Ccircle%20cx%3D%2730%27%20cy%3D%2730%27%20r%3D%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-50'></div>
        
        <div className='relative w-full px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto'>
          
          {/* Header with Welcome Message */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20 dark:border-gray-700/20'>
              <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-sm'>👋</span>
              </div>
              <h1 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                Welcome back, {user.firstName}!
              </h1>
            </div>
          </div>
          
          {/* User Detail Section - Enhanced Card */}
          <div className='mb-8'>
            <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]'>
              <div className='flex items-center gap-6'>
                <div className='relative'>
                  <Image
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={`${user.firstName}'s profile`}
                    width={80}
                    height={80}
                    className='w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-4 border-white dark:border-gray-600 shadow-xl'
                  />
                  <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center shadow-lg'>
                    <span className='text-white text-sm font-bold'>✓</span>
                  </div>
                </div>
                <div className='flex-1'>
                  <h2 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2'>
                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className='hidden lg:flex items-center gap-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>📊</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Expense Section - Enhanced */}
          <div className='mb-8'>
            <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 p-1 rounded-3xl'>
              <div className='bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500'>
                <AddNewRecord />
              </div>
            </div>
          </div>

          {/* Expense Statistic and Expense History - Enhanced Side by Side */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            <div className='group'>
              <div className='bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 p-1 rounded-3xl'>
                <div className='bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg'>
                      <TrendingUp className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                      Expense Statistics
                    </h3>
                  </div>
                  <ExpenseStats />
                </div>
              </div>
            </div>
            
            <div className='group'>
              <div className='bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 p-1 rounded-3xl'>
                <div className='bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg'>
                      <History className='w-10 h-10 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                      Recent Expenses
                    </h3>
                  </div>
                  <RecordHistory />
                </div>
              </div>
            </div>
          </div>

          {/* Expense Chart Section - Enhanced */}
          <div className='mb-8'>
            <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-1 rounded-3xl'>
              <div className='bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg'>
                    <BarChart3 className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    Expense Analytics
                  </h3>
                </div>
                <RecordChart />
              </div>
            </div>
          </div>

          {/* AI Insight Section - Enhanced */}
          <div className='mb-8'>
            <div className='bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 p-1 rounded-3xl'>
              <div className='bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg'>
                    <Brain className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    AI Insights
                  </h3>
                </div>
                <AIInsights />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('❌ HomePage: Critical error during page load:', error);
    
    // Return a fallback UI for critical errors
    return (
      <main className='bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-all duration-500'>
        <div className='w-full px-6 py-8 lg:px-12 lg:py-12 max-w-2xl mx-auto'>
          <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl'>
                <span className='text-3xl'>⚠️</span>
              </div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4'>
                Something went wrong
              </h1>
              <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
                We encountered an error while loading your dashboard. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className='bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}