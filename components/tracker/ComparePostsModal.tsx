
import React, { useState, useEffect } from 'react';
import { TrackedAccount, TrackedPostItem, SocialPlatform } from '../../types';
import Modal from '../common/Modal';
import { ListChecksIcon } from '../common/Icons'; // Or a more specific comparison icon

interface ComparePostsModalProps {
  account: TrackedAccount | null;
  platform?: SocialPlatform;
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export const ComparePostsModal: React.FC<ComparePostsModalProps> = ({ account, platform, isOpen, onClose, darkMode }) => {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    // Pre-select up to 3 latest posts by default if account changes
    if (account && account.posts.length > 0) {
      const latestPosts = account.posts
        .sort((a, b) => new Date(b.metrics.lastUpdated).getTime() - new Date(a.metrics.lastUpdated).getTime())
        .slice(0, 3)
        .map(p => p.id);
      setSelectedPosts(latestPosts);
    } else {
      setSelectedPosts([]);
    }
  }, [account]);

  if (!account) return null;

  const handleTogglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const postsToCompare = account.posts.filter(p => selectedPosts.includes(p.id));
  const sortedAccountPosts = [...account.posts].sort((a,b) => new Date(b.metrics.lastUpdated).getTime() - new Date(a.metrics.lastUpdated).getTime());


  const thClasses = `p-2 text-left text-xs font-medium ${darkMode ? 'text-slate-300 bg-slate-700' : 'text-gray-500 bg-gray-100'} uppercase tracking-wider`;
  const tdClasses = `p-2 whitespace-nowrap text-sm ${darkMode ? 'text-slate-200 border-slate-700' : 'text-gray-700 border-gray-200'} border-b`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Compare Posts for ${account.usernameOrProfileLink}`} darkMode={darkMode}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>Select posts to compare (max 5 recommended):</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border rounded-md ${darkMode ? 'border-slate-600' : 'border-gray-300'}">
            {sortedAccountPosts.map(post => (
              <label key={post.id} className={`flex items-center space-x-2 p-1.5 rounded-md text-xs cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} ${selectedPosts.includes(post.id) ? (darkMode? 'bg-slate-600' : 'bg-blue-50'): ''}`}>
                <input 
                  type="checkbox" 
                  checked={selectedPosts.includes(post.id)} 
                  onChange={() => handleTogglePostSelection(post.id)}
                  className={`form-checkbox h-3.5 w-3.5 rounded ${darkMode ? 'text-accent-500 bg-slate-700 border-slate-500 focus:ring-accent-500' : 'text-primary-600 border-gray-300 focus:ring-primary-500'}`}
                />
                <span className="truncate" title={post.postLinkOrIdentifier}>{post.postLinkOrIdentifier.length > 25 ? post.postLinkOrIdentifier.substring(0,22) + "..." : post.postLinkOrIdentifier}</span>
              </label>
            ))}
          </div>
        </div>

        {postsToCompare.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead>
                <tr>
                  <th className={thClasses}>Metric</th>
                  {postsToCompare.map(post => (
                    <th key={post.id} className={`${thClasses} truncate`} title={post.postLinkOrIdentifier}>
                      {post.postLinkOrIdentifier.length > 15 ? post.postLinkOrIdentifier.substring(0,12) + "..." : post.postLinkOrIdentifier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'}`}>
                {(['Likes', 'Comments', 'Shares', 'Views'] as const).map(metricKey => (
                  <tr key={metricKey}>
                    <td className={tdClasses}>{metricKey}</td>
                    {postsToCompare.map(post => (
                      <td key={post.id} className={tdClasses}>
                        {metricKey === 'Likes' ? post.metrics.likes.toLocaleString() :
                         metricKey === 'Comments' ? post.metrics.comments.toLocaleString() :
                         metricKey === 'Shares' ? post.metrics.shares.toLocaleString() :
                         metricKey === 'Views' ? (post.metrics.views !== undefined ? post.metrics.views.toLocaleString() : 'N/A') : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
                 <tr>
                    <td className={tdClasses}>Last Updated</td>
                    {postsToCompare.map(post => (
                      <td key={post.id} className={tdClasses}>
                        {new Date(post.metrics.lastUpdated).toLocaleDateString()}
                      </td>
                    ))}
                  </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-center py-4 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Select at least one post to compare.</p>
        )}
      </div>
    </Modal>
  );
};
