
import React from 'react';
import { TrackedPostItem, SocialPlatform } from '../../types';
import Modal from '../common/Modal';
import { ChartBarIcon } from '../common/Icons'; // Or a more specific graph icon

interface PostPerformanceGraphModalProps {
  post: TrackedPostItem | null;
  platform?: SocialPlatform;
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export const PostPerformanceGraphModal: React.FC<PostPerformanceGraphModalProps> = ({ post, platform, isOpen, onClose, darkMode }) => {
  if (!post) return null;

  const metrics = [
    { name: 'Likes', value: post.metrics.likes, color: darkMode ? 'bg-blue-500' : 'bg-blue-400' },
    { name: 'Comments', value: post.metrics.comments, color: darkMode ? 'bg-green-500' : 'bg-green-400' },
    { name: 'Shares', value: post.metrics.shares, color: darkMode ? 'bg-purple-500' : 'bg-purple-400' },
    { name: 'Views', value: post.metrics.views || 0, color: darkMode ? 'bg-yellow-500' : 'bg-yellow-400' },
  ];

  const maxValue = Math.max(...metrics.map(m => m.value), 1); // Avoid division by zero, ensure at least 1 for scale

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Performance: ${post.postLinkOrIdentifier.substring(0, 30)}...`} darkMode={darkMode}>
      <div className="space-y-3">
        {platform && <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>Platform: {platform.name}</p>}
        {post.captionSummary && <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>"{post.captionSummary}"</p>}
        
        <div className="mt-4 space-y-2">
          {metrics.map(metric => (
            metric.value > 0 || metric.name === 'Views' ? // Always show views bar even if 0 for consistency if views are tracked
            <div key={metric.name} className="flex items-center">
              <div className={`w-20 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{metric.name}:</div>
              <div className="flex-grow h-5 bg-gray-200 dark:bg-slate-700 rounded overflow-hidden">
                <div 
                  className={`${metric.color} h-full transition-all duration-500 ease-out`} 
                  style={{ width: `${(metric.value / maxValue) * 100}%` }}
                  title={metric.value.toLocaleString()}
                ></div>
              </div>
              <div className={`w-12 text-right text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{metric.value.toLocaleString()}</div>
            </div>
            : null
          ))}
        </div>
         <p className={`text-xs text-center mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Last Updated: {new Date(post.metrics.lastUpdated).toLocaleString()}
        </p>
      </div>
    </Modal>
  );
};
