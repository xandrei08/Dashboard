
import React from 'react';
import { ScheduledPost, SocialPlatform } from '../../types';
import { PencilIcon, TrashIcon, SparklesIcon, ImagePlaceholderIcon } from '../common/Icons';

interface ScheduledPostItemProps {
  post: ScheduledPost;
  platforms: SocialPlatform[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (postId: string) => void;
  darkMode?: boolean;
}

export const ScheduledPostItem: React.FC<ScheduledPostItemProps> = ({ post, platforms, onEdit, onDelete, darkMode }) => {
  const platform = platforms.find(p => p.id === post.platformId);
  const scheduledDate = new Date(post.scheduledTime);
  const isPast = scheduledDate < new Date();

  const cardBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textColor = darkMode ? 'text-slate-300' : 'text-gray-600';
  const titleColor = darkMode ? 'text-slate-100' : 'text-gray-800';
  const accentColor = darkMode ? 'text-accent-400' : 'text-primary-600';

  return (
    <div className={`p-4 rounded-lg shadow-md border ${cardBg} ${isPast && post.status === 'scheduled' ? 'opacity-70 border-l-4 border-yellow-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            {/* Remove redundant cast as platform.icon type in SocialPlatform is now more specific */}
            {platform?.icon && <span className="mr-2 text-xl">{React.cloneElement(platform.icon, { className: `w-6 h-6 ${darkMode ? 'text-slate-300' : 'text-gray-500'}` })}</span>}
            <span className={`font-semibold ${titleColor}`}>{platform?.name || 'Unknown Platform'}</span>
            {/* Add title prop to SparklesIcon, IconProps in Icons.tsx updated to accept title */}
            {post.geminiGenerated && <SparklesIcon className={`w-4 h-4 ml-2 ${accentColor}`} title="AI-assisted content" />}
          </div>
          <p className={`${textColor} text-sm`}>To: <span className="font-medium">{post.usernameOrLink}</span></p>
          <p className={`${textColor} text-sm`}>
            Scheduled: <span className="font-medium">{scheduledDate.toLocaleString()}</span>
            {isPast && post.status === 'scheduled' && <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">(Past due)</span>}
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(post)} className={`p-1.5 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} text-blue-500`} title="Edit Post">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(post.id)} className={`p-1.5 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} text-red-500`} title="Delete Post">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
        <p className={`whitespace-pre-wrap text-sm ${textColor}`}>{post.content}</p>
        {post.mediaUrl && (
          <div className="mt-2">
            <p className={`text-xs font-medium ${textColor}`}>Media:</p>
            <img src={post.mediaUrl} alt="Scheduled media" className="mt-1 max-h-40 rounded object-cover" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.innerHTML = `<div class="w-20 h-20 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} flex items-center justify-center rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-gray-400'}"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></div>`;
                target.parentNode?.insertBefore(placeholder.firstChild!, target.nextSibling);
            }}/>
          </div>
        )}
      </div>

      <div className="mt-2">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${post.status === 'scheduled' ? (darkMode ? 'bg-blue-500 text-blue-100' : 'bg-blue-100 text-blue-700') : (post.status === 'posted' ? (darkMode ? 'bg-green-500 text-green-100' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-red-500 text-red-100' : 'bg-red-100 text-red-700'))}`}>
          Status: {post.status}
        </span>
      </div>
    </div>
  );
};