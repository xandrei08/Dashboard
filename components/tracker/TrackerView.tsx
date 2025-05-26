
import React, { useState, useCallback } from 'react';
import { TrackedAccount, SocialPlatform, ViewState, TrackedPostItem, AccountGoal } from '../../types';
import { TrackedItemForm } from './TrackedItemForm';
import { TrackedAccountCard } from './TrackedAccountCard';
import Modal from '../common/Modal';
import { PlusCircleIcon, ChartBarIcon, BarChartSquareIcon, ListChecksIcon, InformationCircleIcon } from '../common/Icons';
import { PostPerformanceGraphModal } from './PostPerformanceGraphModal';
import { ComparePostsModal } from './ComparePostsModal';
import Tooltip from '../common/Tooltip';

interface TrackerViewProps {
  trackedAccounts: TrackedAccount[];
  setTrackedAccounts: React.Dispatch<React.SetStateAction<TrackedAccount[]>>;
  platforms: SocialPlatform[];
  darkMode?: boolean;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ trackedAccounts, setTrackedAccounts, platforms, darkMode }) => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [editingAccount, setEditingAccount] = useState<TrackedAccount | null>(null);
  const [editingPost, setEditingPost] = useState<{account: TrackedAccount, post: TrackedPostItem | null} | null>(null);
  
  const [goalModalAccount, setGoalModalAccount] = useState<TrackedAccount | null>(null);
  const [currentGoal, setCurrentGoal] = useState<AccountGoal | undefined>(undefined);

  const [graphPost, setGraphPost] = useState<TrackedPostItem | null>(null);
  const [compareAccount, setCompareAccount] = useState<TrackedAccount | null>(null);


  const handleAddOrUpdateAccount = useCallback((accountData: Pick<TrackedAccount, 'platformId' | 'usernameOrProfileLink' | 'id' | 'goal'>) => {
    if (editingAccount) {
      setTrackedAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? { ...acc, ...accountData, goal: accountData.goal || acc.goal } : acc));
    } else {
      const newAccount: TrackedAccount = {
        ...accountData,
        id: Date.now().toString() + Math.random().toString(36).substring(2,9),
        posts: [],
        goal: accountData.goal,
      };
      setTrackedAccounts(prev => [...prev, newAccount]);
    }
    setViewState(ViewState.LIST);
    setEditingAccount(null);
    setGoalModalAccount(null); // Close goal modal if open
  }, [setTrackedAccounts, editingAccount]);
  
  const handleAddOrUpdatePost = useCallback((accountId: string, postData: TrackedPostItem) => {
    setTrackedAccounts(prevAccounts =>
      prevAccounts.map(acc => {
        if (acc.id === accountId) {
          const existingPostIndex = acc.posts.findIndex(p => p.id === postData.id);
          let updatedPosts: TrackedPostItem[];
          if (existingPostIndex > -1) {
            updatedPosts = acc.posts.map((p, index) => index === existingPostIndex ? postData : p);
          } else {
             const newPostWithId = { ...postData, id: Date.now().toString() + Math.random().toString(36).substring(2,9) };
            updatedPosts = [...acc.posts, newPostWithId];
          }
          return { ...acc, posts: updatedPosts.sort((a,b) => new Date(b.metrics.lastUpdated).getTime() - new Date(a.metrics.lastUpdated).getTime()) };
        }
        return acc;
      })
    );
    setViewState(ViewState.LIST);
    setEditingPost(null);
  }, [setTrackedAccounts]);

  const handleDeleteAccount = useCallback((accountId: string) => {
    if (window.confirm("Are you sure you want to delete this tracked account and all its posts?")) {
      setTrackedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  }, [setTrackedAccounts]);

  const handleDeletePost = useCallback((accountId: string, postId: string) => {
     if (window.confirm("Are you sure you want to delete this tracked post?")) {
        setTrackedAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
            return { ...acc, posts: acc.posts.filter(p => p.id !== postId) };
        }
        return acc;
        }));
     }
  }, [setTrackedAccounts]);
  
  const handleSaveGoal = (accountId: string, goal: AccountGoal) => {
    setTrackedAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, goal } : acc));
    setGoalModalAccount(null);
  };
  
  const openAddAccountForm = () => {
    setEditingAccount(null);
    setEditingPost(null);
    setViewState(ViewState.ADD);
  };

  const openEditAccountForm = (account: TrackedAccount) => {
    setEditingAccount(account);
    setEditingPost(null);
    setViewState(ViewState.ADD);
  };
  
  const openGoalModal = (account: TrackedAccount) => {
    setGoalModalAccount(account);
    setCurrentGoal(account.goal || { description: '', targetValue: 0, metricName: 'Followers' });
  };

  const openAddPostToAccountForm = (account: TrackedAccount) => {
    setEditingAccount(null);
    setEditingPost({account, post: null});
    setViewState(ViewState.ADD);
  };
  
  const openEditPostForm = (account: TrackedAccount, post: TrackedPostItem) => {
    setEditingAccount(null);
    setEditingPost({account, post});
    setViewState(ViewState.ADD);
  };

  const openGraphModal = (post: TrackedPostItem) => {
    setGraphPost(post);
  };

  const openCompareModal = (account: TrackedAccount) => {
    setCompareAccount(account);
  };

  const closeModal = () => {
    setViewState(ViewState.LIST);
    setEditingAccount(null);
    setEditingPost(null);
    setGoalModalAccount(null);
    setGraphPost(null);
    setCompareAccount(null);
  };
  
  const inputClasses = `${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm border rounded-md p-2 shadow-sm`;
  const labelClasses = `block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`;

  return (
    <div className={`${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-800'} p-4 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <ChartBarIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-accent-400' : 'text-primary-600'}`} />
          Performance Tracker
        </h2>
        {viewState === ViewState.LIST && (
          <button
            onClick={openAddAccountForm}
            className={`flex items-center ${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out`}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Track New Account/Post
          </button>
        )}
      </div>

      <Modal 
        isOpen={viewState === ViewState.ADD} 
        onClose={closeModal} 
        title={editingPost ? (editingPost.post ? "Edit Tracked Post" : "Add New Post to Track") : (editingAccount ? "Edit Tracked Account" : "Add Account/Post to Track")}
        darkMode={darkMode}
      >
        <TrackedItemForm
          platforms={platforms}
          onSaveAccount={handleAddOrUpdateAccount}
          onSavePost={handleAddOrUpdatePost}
          onCancel={closeModal}
          initialAccount={editingAccount}
          accountForPost={editingPost?.account} 
          initialPost={editingPost?.post}
          darkMode={darkMode}
        />
      </Modal>

      {goalModalAccount && currentGoal && (
        <Modal isOpen={!!goalModalAccount} onClose={closeModal} title={`Set Goal for ${goalModalAccount.usernameOrProfileLink}`} darkMode={darkMode}>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveGoal(goalModalAccount.id, currentGoal); }} className="space-y-3">
            <div>
                <label htmlFor="goalDescription" className={labelClasses}>Goal Description</label>
                <input type="text" id="goalDescription" value={currentGoal.description} onChange={e => setCurrentGoal({...currentGoal, description: e.target.value})} className={inputClasses} placeholder="e.g., Reach 10k Followers" required/>
            </div>
            <div>
                <label htmlFor="goalMetricName" className={labelClasses}>Metric Name</label>
                <input type="text" id="goalMetricName" value={currentGoal.metricName || ''} onChange={e => setCurrentGoal({...currentGoal, metricName: e.target.value})} className={inputClasses} placeholder="e.g., Followers, Subscribers"/>
            </div>
            <div>
                <label htmlFor="goalTargetValue" className={labelClasses}>Target Value</label>
                <input type="number" id="goalTargetValue" value={currentGoal.targetValue} onChange={e => setCurrentGoal({...currentGoal, targetValue: parseInt(e.target.value) || 0})} className={inputClasses} required/>
            </div>
            <div>
                <label htmlFor="goalCurrentValue" className={labelClasses}>Current Value (Optional)</label>
                <input type="number" id="goalCurrentValue" value={currentGoal.currentValue || ''} onChange={e => setCurrentGoal({...currentGoal, currentValue: parseInt(e.target.value) || undefined})} className={inputClasses}/>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={closeModal} className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1.5 rounded-md text-sm`}>Cancel</button>
                <button type="submit" className={`${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white px-3 py-1.5 rounded-md text-sm`}>Save Goal</button>
            </div>
          </form>
        </Modal>
      )}
      
      {graphPost && (
        <PostPerformanceGraphModal
          post={graphPost}
          platform={platforms.find(p => p.id === graphPost!.platformId)}
          isOpen={!!graphPost}
          onClose={closeModal}
          darkMode={darkMode}
        />
      )}

      {compareAccount && (
        <ComparePostsModal
          account={compareAccount}
          platform={platforms.find(p => p.id === compareAccount!.platformId)}
          isOpen={!!compareAccount}
          onClose={closeModal}
          darkMode={darkMode}
        />
      )}


      {viewState === ViewState.LIST && (
        <>
          {trackedAccounts.length === 0 ? (
            <div className={`text-center py-10 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <ChartBarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No accounts or posts being tracked.</p>
              <p>Click "Track New Account/Post" to add one.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {trackedAccounts.map(account => (
                <TrackedAccountCard
                  key={account.id}
                  account={account}
                  platforms={platforms}
                  onEditAccount={() => openEditAccountForm(account)}
                  onDeleteAccount={() => handleDeleteAccount(account.id)}
                  onAddPost={() => openAddPostToAccountForm(account)}
                  onEditPost={(post) => openEditPostForm(account, post)}
                  onDeletePost={(postId) => handleDeletePost(account.id, postId)}
                  onSetGoal={() => openGoalModal(account)}
                  onViewGraph={(post) => openGraphModal(post)}
                  onComparePosts={() => openCompareModal(account)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </>
      )}
       <div className={`mt-6 p-3 rounded-md text-sm ${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
          <InformationCircleIcon className={`w-5 h-5 inline mr-1 mb-0.5 ${darkMode ? 'text-blue-400':'text-blue-500'}`}/>
          <strong>Note:</strong> Social media data (likes, views, etc.) is not fetched automatically. Please input these metrics manually for each post. This tool helps organize and analyze the data you provide.
      </div>
    </div>
  );
};
