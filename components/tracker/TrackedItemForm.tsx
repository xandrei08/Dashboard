
import React, { useState, useEffect, useCallback } from 'react';
import { SocialPlatform, TrackedAccount, TrackedPostItem, TrackedPostMetrics } from '../../types';
import { SparklesIcon } from '../common/Icons';
import LoadingSpinner from '../common/LoadingSpinner';
import { analyzePostPerformance, isGeminiAvailable } from '../../services/geminiService';

interface TrackedItemFormProps {
  platforms: SocialPlatform[];
  onSaveAccount: (accountData: Pick<TrackedAccount, 'platformId' | 'usernameOrProfileLink' | 'id'>) => void;
  onSavePost: (accountId: string, postData: TrackedPostItem) => void;
  onCancel: () => void;
  initialAccount?: TrackedAccount | null; // For editing account details or context for new post
  accountForPost?: TrackedAccount | null; // Explicit account context when adding/editing a post
  initialPost?: TrackedPostItem | null;   // For editing a specific post
  darkMode?: boolean;
}

export const TrackedItemForm: React.FC<TrackedItemFormProps> = ({
  platforms,
  onSaveAccount,
  onSavePost,
  onCancel,
  initialAccount,
  accountForPost,
  initialPost,
  darkMode
}) => {
  // Determine if we are editing a post or an account, or adding new
  const isEditingPost = !!initialPost;
  const isEditingAccount = !!initialAccount && !initialPost; // Editing account details itself
  const targetAccount = accountForPost || initialAccount; // Account context for post operations

  // Account fields
  const [platformId, setPlatformId] = useState<string>(initialPost?.platformId || targetAccount?.platformId || (platforms.length > 0 ? platforms[0].id : ''));
  const [usernameOrProfileLink, setUsernameOrProfileLink] = useState<string>(targetAccount?.usernameOrProfileLink || '');
  
  // Post fields
  const [postLinkOrIdentifier, setPostLinkOrIdentifier] = useState<string>(initialPost?.postLinkOrIdentifier || '');
  const [captionSummary, setCaptionSummary] = useState<string>(initialPost?.captionSummary || '');
  const [metrics, setMetrics] = useState<TrackedPostMetrics>(
    initialPost?.metrics || { likes: 0, views: 0, shares: 0, comments: 0, lastUpdated: new Date().toISOString() }
  );

  const [formMode, setFormMode] = useState<'account' | 'post'>(initialPost || accountForPost ? 'post' : 'account');

  // Gemini analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialPost) { // Editing existing post
      setFormMode('post');
      setPlatformId(initialPost.platformId);
      if (targetAccount) setUsernameOrProfileLink(targetAccount.usernameOrProfileLink); // Keep account context
      setPostLinkOrIdentifier(initialPost.postLinkOrIdentifier);
      setCaptionSummary(initialPost.captionSummary || '');
      setMetrics(initialPost.metrics);
    } else if (accountForPost) { // Adding new post to existing account
      setFormMode('post');
      setPlatformId(accountForPost.platformId);
      setUsernameOrProfileLink(accountForPost.usernameOrProfileLink);
      // Reset post-specific fields for new post
      setPostLinkOrIdentifier('');
      setCaptionSummary('');
      setMetrics({ likes: 0, views: 0, shares: 0, comments: 0, lastUpdated: new Date().toISOString() });
    } else if (initialAccount) { // Editing existing account details
      setFormMode('account');
      setPlatformId(initialAccount.platformId);
      setUsernameOrProfileLink(initialAccount.usernameOrProfileLink);
    } else { // Adding new account (default)
      setFormMode('account');
      setPlatformId(platforms.length > 0 ? platforms[0].id : '');
      setUsernameOrProfileLink('');
    }
  }, [initialAccount, initialPost, accountForPost, platforms]);


  const handleMetricChange = (field: keyof Omit<TrackedPostMetrics, 'lastUpdated'>, value: string) => {
    setMetrics(prev => ({ ...prev, [field]: parseInt(value, 10) || 0, lastUpdated: new Date().toISOString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'account') {
      if (!platformId || !usernameOrProfileLink) {
        alert("Platform and Username/Profile Link are required for tracking an account.");
        return;
      }
      onSaveAccount({
        id: initialAccount?.id || Date.now().toString() + Math.random().toString(36).substring(2,9), // Use existing ID if editing
        platformId,
        usernameOrProfileLink,
      });
    } else { // formMode === 'post'
      if (!targetAccount || !targetAccount.id) {
        alert("Account context is missing. Cannot save post.");
        return;
      }
      if (!platformId || !postLinkOrIdentifier) {
        alert("Platform and Post Link/Identifier are required for tracking a post.");
        return;
      }
      onSavePost(targetAccount.id, {
        id: initialPost?.id || Date.now().toString() + Math.random().toString(36).substring(2,9), // Use existing ID if editing
        platformId,
        postLinkOrIdentifier,
        captionSummary,
        metrics,
        notes: initialPost?.notes // Preserve notes if any
      });
    }
  };

  const handleGeminiAnalyze = useCallback(async () => {
    if (!isGeminiAvailable() || !platformId || !captionSummary || !postLinkOrIdentifier) {
      setAnalysisError("Platform, caption summary, and post identifier are needed for analysis.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    const selectedPlatform = platforms.find(p => p.id === platformId);
    if (!selectedPlatform) {
      setAnalysisError("Invalid platform selected.");
      setIsAnalyzing(false);
      return;
    }

    const analysis = await analyzePostPerformance(selectedPlatform.name, metrics, captionSummary);
    setIsAnalyzing(false);
    if (analysis) {
      setAnalysisResult(analysis);
    } else {
      setAnalysisError("Failed to get analysis from AI. Please check API key and try again.");
    }
  }, [platformId, metrics, captionSummary, postLinkOrIdentifier, platforms]);

  const inputClasses = `${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm border rounded-md p-2 shadow-sm`;
  const labelClasses = `block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`;
  const buttonBase = `py-2 px-4 rounded-md font-medium transition`;
  const primaryButton = `${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white shadow-sm`;
  const secondaryButton = `${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`;

  // Determine if form is for adding a new account or adding/editing a post.
  // If initialAccount is set AND NOT initialPost AND NOT accountForPost, it's purely editing account details.
  // If accountForPost is set OR initialPost is set, it's about a post.
  // Otherwise, it's adding a new account.

  const isPostOperation = !!(initialPost || accountForPost);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Show these fields if adding/editing an account, or if adding/editing a post (as context) */}
      {(isEditingAccount || !isPostOperation || isPostOperation) && (
        <>
          <div>
            <label htmlFor="platformId" className={labelClasses}>Platform</label>
            <select id="platformId" value={platformId} onChange={e => setPlatformId(e.target.value)} className={inputClasses} required disabled={isPostOperation && !!accountForPost}>
              {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="usernameOrProfileLink" className={labelClasses}>Account Username / Profile Link</label>
            <input type="text" id="usernameOrProfileLink" value={usernameOrProfileLink} onChange={e => setUsernameOrProfileLink(e.target.value)} className={inputClasses} required placeholder="e.g., @yourhandle or profile URL" disabled={isPostOperation && !!accountForPost} />
          </div>
        </>
      )}

      {/* Show radio buttons to switch mode only if adding a new item (neither initialAccount nor initialPost is set) */}
      {!initialAccount && !initialPost && !accountForPost && (
         <div className="my-4">
            <span className={labelClasses}>What do you want to track?</span>
            <div className="flex space-x-4 mt-1">
                <label className="flex items-center space-x-2">
                    <input type="radio" name="formMode" value="account" checked={formMode === 'account'} onChange={() => setFormMode('account')} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"/>
                    <span className={darkMode ? 'text-slate-200' : 'text-gray-700'}>A Social Media Account</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input type="radio" name="formMode" value="post" checked={formMode === 'post'} onChange={() => setFormMode('post')} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"/>
                    <span className={darkMode ? 'text-slate-200' : 'text-gray-700'}>A Specific Post</span>
                </label>
            </div>
            {formMode === 'post' && !targetAccount?.id && <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>You'll first define the account, then the post details.</p>}
         </div>
      )}


      {/* Post specific fields - only show if formMode is 'post' OR if we are editing an existing post */}
      {(formMode === 'post' || isEditingPost) && (
        <>
          <hr className={`${darkMode ? 'border-slate-700' : 'border-gray-200'} my-4`} />
          <h3 className={`text-lg font-medium ${darkMode ? 'text-accent-400' : 'text-primary-700'}`}>Post Details</h3>
          <div>
            <label htmlFor="postLinkOrIdentifier" className={labelClasses}>Post Link / Identifier</label>
            <input type="text" id="postLinkOrIdentifier" value={postLinkOrIdentifier} onChange={e => setPostLinkOrIdentifier(e.target.value)} className={inputClasses} required placeholder="e.g., URL to post or unique video ID" />
          </div>
          <div>
            <label htmlFor="captionSummary" className={labelClasses}>Caption Summary (for AI Analysis)</label>
            <textarea id="captionSummary" value={captionSummary} onChange={e => setCaptionSummary(e.target.value)} rows={2} className={inputClasses} placeholder="Brief summary of the post content."></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="likes" className={labelClasses}>Likes</label>
              <input type="number" id="likes" value={metrics.likes} onChange={e => handleMetricChange('likes', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="comments" className={labelClasses}>Comments</label>
              <input type="number" id="comments" value={metrics.comments} onChange={e => handleMetricChange('comments', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="shares" className={labelClasses}>Shares</label>
              <input type="number" id="shares" value={metrics.shares} onChange={e => handleMetricChange('shares', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="views" className={labelClasses}>Views (Optional)</label>
              <input type="number" id="views" value={metrics.views} onChange={e => handleMetricChange('views', e.target.value)} className={inputClasses} />
            </div>
          </div>

          {isGeminiAvailable() && (postLinkOrIdentifier || captionSummary) && (
            <div className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-slate-700' : 'border border-slate-600'}`}>
              <button type="button" onClick={handleGeminiAnalyze} disabled={isAnalyzing}
                className={`w-full px-3 py-1.5 text-sm font-medium rounded-md flex items-center justify-center ${darkMode ? 'bg-accent-600 hover:bg-accent-700 disabled:bg-slate-500' : 'bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400'} text-white transition`}
              >
                {isAnalyzing ? <LoadingSpinner size="sm" darkMode={!darkMode}/> : <SparklesIcon className="w-4 h-4 mr-2" />}
                Analyze Performance with AI
              </button>
              {isAnalyzing && <p className={`text-xs mt-1 text-center ${darkMode ? 'text-slate-400':'text-gray-500'}`}>Analyzing...</p>}
              {analysisError && <p className="text-xs text-red-500 mt-1">{analysisError}</p>}
              {analysisResult && <div className={`mt-2 p-2 rounded text-sm ${darkMode ? 'bg-slate-600 text-slate-200' : 'bg-green-50 text-green-700'}`}><strong>AI Analysis:</strong> {analysisResult}</div>}
            </div>
          )}
        </>
      )}
      
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className={`${buttonBase} ${secondaryButton}`}>
          Cancel
        </button>
        <button type="submit" className={`${buttonBase} ${primaryButton}`}>
          {isEditingPost || (formMode === 'post' && targetAccount?.id) ? 'Save Post' : (isEditingAccount ? 'Save Account Changes' : 'Save Account')}
        </button>
      </div>
    </form>
  );
};
