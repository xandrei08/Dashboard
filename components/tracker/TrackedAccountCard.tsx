
import React, { useState } from 'react';
import { TrackedAccount, SocialPlatform, TrackedPostItem, AccountGoal } from '../../types';
import { PencilIcon, TrashIcon, PlusCircleIcon, SparklesIcon, TargetIcon, BarChartSquareIcon, ListChecksIcon, InformationCircleIcon } from '../common/Icons';
import LoadingSpinner from '../common/LoadingSpinner';
import { analyzePostPerformance, isGeminiAvailable } from '../../services/geminiService';
import { GENERIC_AVATAR_URL } from '../../constants';
import Tooltip from '../common/Tooltip';

interface TrackedPostItemCardProps {
  post: TrackedPostItem;
  platform: SocialPlatform | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onViewGraph: (post: TrackedPostItem) => void;
  darkMode?: boolean;
}

const TrackedPostItemCard: React.FC<TrackedPostItemCardProps> = ({ post, platform, onEdit, onDelete, onViewGraph, darkMode }) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleGeminiAnalyze = async () => {
    if (!isGeminiAvailable() || !platform || !post.captionSummary) {
      setAnalysisError("Platform and caption summary are needed for analysis.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    
    const analysis = await analyzePostPerformance(platform.name, post.metrics, post.captionSummary);
    setIsAnalyzing(false);
    if (analysis) {
      setAnalysisResult(analysis);
    } else {
      setAnalysisError("Failed to get analysis from AI. Ensure API key is set and try again.");
    }
  };
  
  const cardBg = darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200';
  const textColor = darkMode ? 'text-slate-300' : 'text-gray-500';
  const valueColor = darkMode ? 'text-slate-100' : 'text-gray-700';

  return (
    <div className={`p-3 rounded-md border ${cardBg} shadow-sm`}>
      <div className="flex justify-between items-start mb-1">
        <a href={post.postLinkOrIdentifier.startsWith('http') ? post.postLinkOrIdentifier : undefined} target="_blank" rel="noopener noreferrer" 
           className={`font-medium truncate ${darkMode ? 'text-accent-400 hover:text-accent-300' : 'text-primary-600 hover:text-primary-700'}`}
           title={post.postLinkOrIdentifier}
        >
          Post: {post.postLinkOrIdentifier.length > 25 ? post.postLinkOrIdentifier.substring(0,22) + "..." : post.postLinkOrIdentifier}
        </a>
        <div className="flex space-x-1">
          <Tooltip text="View Performance Graph" darkMode={darkMode}>
            <button onClick={() => onViewGraph(post)} className={`p-1 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} text-teal-500`}>
              <BarChartSquareIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Edit Post Metrics" darkMode={darkMode}>
            <button onClick={onEdit} className={`p-1 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} text-blue-500`}>
              <PencilIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Delete Post" darkMode={darkMode}>
            <button onClick={onDelete} className={`p-1 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} text-red-500`}>
              <TrashIcon className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
      {post.captionSummary && <p className={`text-xs italic mb-2 ${textColor}`}>"{post.captionSummary}"</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1 text-xs mb-2">
        <div><span className={textColor}>Likes:</span> <span className={`font-semibold ${valueColor}`}>{post.metrics.likes.toLocaleString()}</span></div>
        <div><span className={textColor}>Comments:</span> <span className={`font-semibold ${valueColor}`}>{post.metrics.comments.toLocaleString()}</span></div>
        <div><span className={textColor}>Shares:</span> <span className={`font-semibold ${valueColor}`}>{post.metrics.shares.toLocaleString()}</span></div>
        <div><span className={textColor}>Views:</span> <span className={`font-semibold ${valueColor}`}>{post.metrics.views?.toLocaleString() || 'N/A'}</span></div>
      </div>
      <p className={`text-xs ${textColor}`}>Last Updated: {new Date(post.metrics.lastUpdated).toLocaleDateString()}</p>
      
      {isGeminiAvailable() && post.captionSummary && (
        <div className="mt-2">
          <Tooltip text="Get AI powered insights and suggestions for this post." darkMode={darkMode}>
          <button onClick={handleGeminiAnalyze} disabled={isAnalyzing} className={`w-full text-xs px-2 py-1 rounded-md flex items-center justify-center ${darkMode ? 'bg-accent-700 hover:bg-accent-600 disabled:bg-slate-500 text-white' : 'bg-primary-100 hover:bg-primary-200 disabled:bg-gray-200 text-primary-700'} transition`}>
            {isAnalyzing ? <LoadingSpinner size="sm" darkMode={!darkMode} /> : <SparklesIcon className="w-3 h-3 mr-1" />}
            Get AI Insights
          </button>
          </Tooltip>
          {isAnalyzing && <p className={`text-xs mt-1 text-center ${textColor}`}>Analyzing...</p>}
          {analysisError && <p className="text-xs text-red-500 mt-1">{analysisError}</p>}
          {analysisResult && <div className={`mt-1 p-1.5 rounded text-xs ${darkMode ? 'bg-slate-600 text-slate-200' : 'bg-green-50 text-green-700'}`}><strong>AI:</strong> {analysisResult}</div>}
        </div>
      )}
    </div>
  );
};

interface TrackedAccountCardProps {
  account: TrackedAccount;
  platforms: SocialPlatform[];
  onEditAccount: (account: TrackedAccount) => void;
  onDeleteAccount: (accountId: string) => void;
  onAddPost: (account: TrackedAccount) => void;
  onEditPost: (post: TrackedPostItem) => void;
  onDeletePost: (postId: string) => void;
  onSetGoal: (account: TrackedAccount) => void;
  onViewGraph: (post: TrackedPostItem) => void;
  onComparePosts: (account: TrackedAccount) => void;
  darkMode?: boolean;
}

export const TrackedAccountCard: React.FC<TrackedAccountCardProps> = ({
  account,
  platforms,
  onEditAccount,
  onDeleteAccount,
  onAddPost,
  onEditPost,
  onDeletePost,
  onSetGoal,
  onViewGraph,
  onComparePosts,
  darkMode
}) => {
  const platform = platforms.find(p => p.id === account.platformId);
  const cardBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const headerBg = darkMode ? 'bg-slate-750' : 'bg-gray-50';
  const textColor = darkMode ? 'text-slate-300' : 'text-gray-600';
  const titleColor = darkMode ? 'text-slate-100' : 'text-gray-800';

  const goalProgress = account.goal && account.goal.targetValue > 0 && account.goal.currentValue !== undefined
    ? Math.min((account.goal.currentValue / account.goal.targetValue) * 100, 100)
    : null;

  return (
    <div className={`rounded-lg shadow-lg border ${cardBg}`}>
      <div className={`flex flex-wrap justify-between items-center p-3 sm:p-4 rounded-t-lg border-b ${darkMode ? 'border-slate-700 '+headerBg : 'border-gray-200 '+headerBg}`}>
        <div className="flex items-center mb-2 sm:mb-0">
          <img src={GENERIC_AVATAR_URL + `?=${account.id}`} alt="Profile" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 border-2 border-gray-300 dark:border-slate-600" />
          <div>
            <div className="flex items-center">
              {platform?.icon && React.cloneElement(platform.icon, { className: `w-5 h-5 mr-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-500'}` })}
              <h3 className={`text-lg font-semibold ${titleColor}`}>{account.usernameOrProfileLink}</h3>
            </div>
            <p className={`text-sm ${textColor}`}>{platform?.name || 'Unknown Platform'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
           <Tooltip text="Set or Update Goal" darkMode={darkMode}>
            <button onClick={() => onSetGoal(account)} className={`p-1.5 sm:px-2 sm:py-1 text-xs rounded-md flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'} text-white transition`}>
              <TargetIcon className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Goal</span>
            </button>
          </Tooltip>
          {account.posts && account.posts.length > 1 && (
            <Tooltip text="Compare Multiple Posts" darkMode={darkMode}>
                <button onClick={() => onComparePosts(account)} className={`p-1.5 sm:px-2 sm:py-1 text-xs rounded-md flex items-center ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition`}>
                    <ListChecksIcon className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Compare</span>
                </button>
            </Tooltip>
          )}
          <Tooltip text="Add New Post to Track" darkMode={darkMode}>
            <button onClick={() => onAddPost(account)} className={`p-1.5 sm:px-2 sm:py-1 text-xs rounded-md flex items-center ${darkMode ? 'bg-accent-600 hover:bg-accent-500' : 'bg-primary-500 hover:bg-primary-600'} text-white transition`}>
              <PlusCircleIcon className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Add Post</span>
            </button>
          </Tooltip>
          <Tooltip text="Edit Account Details" darkMode={darkMode}>
            <button onClick={() => onEditAccount(account)} className={`p-1.5 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} text-blue-500`}>
              <PencilIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Delete Account" darkMode={darkMode}>
            <button onClick={() => onDeleteAccount(account.id)} className={`p-1.5 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} text-red-500`}>
              <TrashIcon className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {account.goal && (
        <div className={`px-3 sm:px-4 py-2 text-xs border-b ${darkMode ? 'border-slate-700 bg-slate-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-0.5">
                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <TargetIcon className="w-3.5 h-3.5 inline mr-1 mb-px"/>Goal: {account.goal.description} 
                    {account.goal.metricName && ` (${account.goal.metricName})`}
                </p>
                {account.goal.currentValue !== undefined && <p className={textColor}>{account.goal.currentValue.toLocaleString()} / {account.goal.targetValue.toLocaleString()}</p>}
            </div>
            {goalProgress !== null && (
                <div className={`w-full rounded-full h-1.5 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                    <div className={`h-1.5 rounded-full ${darkMode ? 'bg-green-500' : 'bg-green-500'}`} style={{ width: `${goalProgress}%` }}></div>
                </div>
            )}
        </div>
      )}

      <div className="p-3 sm:p-4">
        {account.posts.length === 0 ? (
          <p className={`text-center py-4 ${textColor}`}>No posts tracked for this account yet.</p>
        ) : (
          <div className="space-y-3">
            {account.posts.map(post => ( // Already sorted in TrackerView
              <TrackedPostItemCard
                key={post.id}
                post={post}
                platform={platform}
                onEdit={() => onEditPost(post)}
                onDelete={() => onDeletePost(post.id)}
                onViewGraph={onViewGraph}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
