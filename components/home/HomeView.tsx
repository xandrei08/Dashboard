

import React from 'react';
import { Link } from 'react-router-dom';
import { ScheduledPost, TrackedAccount, MonetizationEntry, ExpenseItem, PlannerSummary, TrackerSummary, MonetizationSummaryData } from '../../types';
// Fix: Import PlusCircleIcon
import { CalendarIcon, ChartBarIcon, CurrencyDollarIcon, SparklesIcon, LightbulbIcon, BrainIcon, CheckCircleIcon, FileTextIcon, WalletIcon, PlusCircleIcon } from '../common/Icons';
import { isGeminiAvailable, identifyTrendsAI } from '../../services/geminiService';
import LoadingSpinner from '../common/LoadingSpinner';
import Tooltip from '../common/Tooltip';

interface HomeViewProps {
  scheduledPosts: ScheduledPost[];
  trackedAccounts: TrackedAccount[];
  monetizationEntries: MonetizationEntry[];
  expenses: ExpenseItem[];
  darkMode?: boolean;
}

const QuickActionCard: React.FC<{title: string, to: string, icon: React.ReactNode, description: string, darkMode?: boolean}> = ({ title, to, icon, description, darkMode }) => (
    <Link to={to} className={`block p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'}`}>
        <div className="flex items-center mb-2">
            {icon}
            <h3 className={`ml-2 text-lg font-semibold ${darkMode ? 'text-accent-400' : 'text-primary-600'}`}>{title}</h3>
        </div>
        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{description}</p>
    </Link>
);

export const HomeView: React.FC<HomeViewProps> = ({ scheduledPosts, trackedAccounts, monetizationEntries, expenses, darkMode }) => {
    const [trendingTopics, setTrendingTopics] = React.useState<string[]>([]);
    const [trendsLoading, setTrendsLoading] = React.useState(false);
    const [trendsError, setTrendsError] = React.useState<string | null>(null);
    const [nicheForTrends, setNicheForTrends] = React.useState<string>("");

    const plannerSummary: PlannerSummary = {
        upcomingPosts: scheduledPosts.filter(p => new Date(p.scheduledTime) >= new Date() && p.status === 'scheduled').length,
        pastDuePosts: scheduledPosts.filter(p => new Date(p.scheduledTime) < new Date() && p.status === 'scheduled').length,
    };

    const trackerSummary: TrackerSummary = {
        trackedAccounts: trackedAccounts.length,
        totalTrackedPosts: trackedAccounts.reduce((sum, acc) => sum + acc.posts.length, 0),
    };
    
    const totalEarnings = monetizationEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monetizationSummary: MonetizationSummaryData = {
        totalEarnings,
        totalExpenses,
        netProfit: totalEarnings - totalExpenses,
        entryCount: monetizationEntries.length + expenses.length // Combined entries for activity
    };

    const fetchTrends = async () => {
        if (!nicheForTrends.trim() || !isGeminiAvailable()) {
            setTrendsError("Please enter your niche to get trends.");
            return;
        }
        setTrendsLoading(true);
        setTrendsError(null);
        const trends = await identifyTrendsAI(nicheForTrends);
        setTrendsLoading(false);
        if (trends) {
            setTrendingTopics(trends.map(t => `${t.trendName}: ${t.description.substring(0,100)}...`));
        } else {
            setTrendsError("Could not fetch trending topics from AI.");
        }
    };
    
    const summaryCardClass = darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-700';
    const labelClass = darkMode ? 'text-slate-400' : 'text-gray-500';
    const valueClass = `text-3xl font-bold ${darkMode ? 'text-accent-400' : 'text-primary-600'}`;

  return (
    <div className={`p-1 ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome to your Social Media Suite!</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className={`${summaryCardClass} p-5 rounded-lg shadow-lg`}>
          <div className="flex items-center mb-2">
            <CalendarIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-xl font-semibold">Planner Overview</h2>
          </div>
          <p className={labelClass}>Upcoming Posts: <span className={valueClass}>{plannerSummary.upcomingPosts}</span></p>
          {plannerSummary.pastDuePosts > 0 && <p className={`${labelClass} text-yellow-500 dark:text-yellow-400`}>Past Due: <span className={`${valueClass} text-yellow-500 dark:text-yellow-400`}>{plannerSummary.pastDuePosts}</span></p>}
           <Link to="/planner" className={`mt-3 inline-block text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Go to Planner &rarr;</Link>
        </div>

        <div className={`${summaryCardClass} p-5 rounded-lg shadow-lg`}>
          <div className="flex items-center mb-2">
            <ChartBarIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h2 className="text-xl font-semibold">Tracker Snapshot</h2>
          </div>
          <p className={labelClass}>Tracked Accounts: <span className={valueClass}>{trackerSummary.trackedAccounts}</span></p>
          <p className={labelClass}>Total Tracked Posts: <span className={valueClass}>{trackerSummary.totalTrackedPosts}</span></p>
           <Link to="/tracker" className={`mt-3 inline-block text-sm ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>Go to Tracker &rarr;</Link>
        </div>

        <div className={`${summaryCardClass} p-5 rounded-lg shadow-lg`}>
          <div className="flex items-center mb-2">
            <CurrencyDollarIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h2 className="text-xl font-semibold">Financials</h2>
          </div>
          <p className={labelClass}>Net Profit: 
            <span className={`${valueClass} ${monetizationSummary.netProfit >= 0 ? (darkMode ? 'text-sky-400':'text-sky-600') : (darkMode? 'text-orange-400':'text-orange-500')}`}>
                 ${monetizationSummary.netProfit.toFixed(2)}
            </span>
          </p>
          <p className={labelClass}>Total Earnings: <span className={`${valueClass} text-base ${darkMode ? 'text-green-400' : 'text-green-500'}`}>${monetizationSummary.totalEarnings.toFixed(2)}</span></p>
          <p className={labelClass}>Total Expenses: <span className={`${valueClass} text-base ${darkMode ? 'text-red-400' : 'text-red-500'}`}>${monetizationSummary.totalExpenses.toFixed(2)}</span></p>
          <Link to="/monetization" className={`mt-3 inline-block text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>Go to Monetization &rarr;</Link>
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard title="Schedule a Post" to="/planner" icon={<PlusCircleIcon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />} description="Go directly to the content planner to schedule new posts." darkMode={darkMode} />
            <QuickActionCard title="Track New Account" to="/tracker" icon={<ChartBarIcon className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />} description="Start tracking performance for a new social media account or specific posts." darkMode={darkMode}/>
            <QuickActionCard title="Add Earning/Expense" to="/monetization" icon={<WalletIcon className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />} description="Log your latest income or business expenses to keep finances up to date." darkMode={darkMode}/>
        </div>
      </div>


      {/* AI Powered Insights Section */}
      {isGeminiAvailable() && (
        <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'} mb-6`}>
            <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <BrainIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-500'}`}/>
                AI-Powered Insights
            </h2>
            <div className="mb-4">
                <label htmlFor="nicheForTrends" className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`}>Your Content Niche:</label>
                <div className="flex space-x-2">
                    <input 
                        type="text"
                        id="nicheForTrends" 
                        value={nicheForTrends} 
                        onChange={(e) => setNicheForTrends(e.target.value)}
                        placeholder="e.g., Sustainable Living, Indie Gaming"
                        className={`${darkMode ? 'bg-slate-700 border-slate-600 focus:ring-teal-500 focus:border-teal-500' : 'bg-white border-gray-300 focus:ring-primary-500 focus:border-primary-500'} flex-grow sm:text-sm border rounded-md p-2 shadow-sm`}
                    />
                    <Tooltip text="Get current content trends for your niche using AI." darkMode={darkMode}>
                    <button 
                        onClick={fetchTrends} 
                        disabled={trendsLoading || !nicheForTrends.trim()}
                        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center justify-center ${darkMode ? 'bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600' : 'bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300'} text-white transition`}
                    >
                        {trendsLoading ? <LoadingSpinner size="sm" darkMode={!darkMode} /> : <LightbulbIcon className="w-4 h-4 mr-1.5"/>}
                        Get Trends
                    </button>
                    </Tooltip>
                </div>
            </div>
            {trendsError && <p className="text-sm text-red-500 mt-1">{trendsError}</p>}
            {trendingTopics.length > 0 && (
                <div>
                    <h3 className={`text-md font-semibold mb-1 ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>Trending Topics Suggested by AI:</h3>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {trendingTopics.map((topic, index) => <li key={index}>{topic}</li>)}
                    </ul>
                </div>
            )}
            {!isGeminiAvailable() && <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>AI features are disabled. Please set API_KEY.</p>}
        </div>
      )}
      
      {/* Tips/Guide Section - placeholder */}
      <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'} `}>
        <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
        <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            <li className="flex items-start"><CheckCircleIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} /> <span>Use the <strong className={darkMode ? 'text-sky-300' : 'text-sky-700'}>Planner</strong> to schedule your upcoming social media posts and visualize them on a calendar.</span></li>
            <li className="flex items-start"><CheckCircleIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} /> <span>Head to the <strong className={darkMode ? 'text-sky-300' : 'text-sky-700'}>Tracker</strong> to monitor the performance of your accounts and posts. Set goals and get AI insights!</span></li>
            <li className="flex items-start"><CheckCircleIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} /> <span>Manage your income and expenses in the <strong className={darkMode ? 'text-sky-300' : 'text-sky-700'}>Monetization</strong> hub. Leverage AI for monetization tips and new revenue ideas.</span></li>
            <li className="flex items-start"><FileTextIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> <span>Remember to manually input performance data in the Tracker, as direct API integration is not yet available.</span></li>
            <li className="flex items-start"><SparklesIcon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} /> <span>Explore AI features by ensuring your Gemini API key is set up in your environment variables.</span></li>
        </ul>
      </div>

    </div>
  );
};