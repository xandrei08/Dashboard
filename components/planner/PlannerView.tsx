
import React, { useState, useCallback } from 'react';
import { ScheduledPost, SocialPlatform, ViewState, CalendarEvent } from '../../types';
import { PostSchedulerForm } from './PostSchedulerForm';
import { ScheduledPostItem } from './ScheduledPostItem';
import { CalendarView } from './CalendarView'; // New component
import { PlusCircleIcon, CalendarIcon, ListChecksIcon, DownloadIcon, InformationCircleIcon } from '../common/Icons';
import Modal from '../common/Modal';
import { exportToCSV } from '../../services/exportService'; // New service
import Tooltip from '../common/Tooltip';


interface PlannerViewProps {
  scheduledPosts: ScheduledPost[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<ScheduledPost[]>>;
  platforms: SocialPlatform[];
  darkMode?: boolean;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ scheduledPosts, setScheduledPosts, platforms, darkMode }) => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LIST); // LIST or CALENDAR
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  const handleAddPost = useCallback((post: ScheduledPost) => {
    setScheduledPosts(prev => [...prev, { ...post, id: Date.now().toString() + Math.random().toString(36).substring(2,9) }]);
    setShowFormModal(false);
  }, [setScheduledPosts]);

  const handleUpdatePost = useCallback((updatedPost: ScheduledPost) => {
    setScheduledPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setShowFormModal(false);
    setEditingPost(null);
  }, [setScheduledPosts]);

  const handleDeletePost = useCallback((postId: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled post?")) {
      setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    }
  }, [setScheduledPosts]);

  const handleEditPost = useCallback((post: ScheduledPost) => {
    setEditingPost(post);
    setShowFormModal(true);
  }, []);
  
  const openSchedulerForm = () => {
    setEditingPost(null);
    setShowFormModal(true);
  };
  
  const closeSchedulerForm = () => {
    setShowFormModal(false);
    setEditingPost(null);
  };

  const handleExport = () => {
    exportToCSV(scheduledPosts.map(p => {
      const platformName = platforms.find(pl => pl.id === p.platformId)?.name || p.platformId;
      return {
        ID: p.id,
        Platform: platformName,
        UsernameOrLink: p.usernameOrLink,
        Content: p.content,
        ScheduledTime: new Date(p.scheduledTime).toLocaleString(),
        Status: p.status,
        MediaURL: p.mediaUrl || '',
        AIAssisted: p.geminiGenerated ? 'Yes' : 'No',
      };
    }), "scheduled_posts.csv");
  };

  const sortedPosts = [...scheduledPosts].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  
  const calendarEvents: CalendarEvent[] = sortedPosts.map(post => {
    const platform = platforms.find(p => p.id === post.platformId);
    return {
      id: post.id,
      title: `${platform?.name || 'Post'}: ${post.content.substring(0, 20)}...`,
      start: new Date(post.scheduledTime),
      end: new Date(new Date(post.scheduledTime).getTime() + 60 * 60 * 1000), // Assume 1 hour duration
      allDay: false,
      resource: post,
      platformColor: platform?.color
    };
  });


  return (
    <div className={`${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-800'} p-4 rounded-lg shadow-lg`}>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <CalendarIcon className={`w-7 h-7 mr-2 ${darkMode ? 'text-accent-400' : 'text-primary-600'}`} />
          Content Planner
        </h2>
        <div className="flex items-center space-x-2">
          <Tooltip text={currentView === ViewState.LIST ? "Switch to Calendar View" : "Switch to List View"} darkMode={darkMode}>
            <button
                onClick={() => setCurrentView(currentView === ViewState.LIST ? ViewState.CALENDAR : ViewState.LIST)}
                className={`p-2 rounded-md ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
            >
                {currentView === ViewState.LIST ? <CalendarIcon className="w-5 h-5" /> : <ListChecksIcon className="w-5 h-5" />}
            </button>
          </Tooltip>
          <Tooltip text="Export Scheduled Posts to CSV" darkMode={darkMode}>
            <button
                onClick={handleExport}
                className={`p-2 rounded-md ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
            >
                <DownloadIcon className="w-5 h-5" />
            </button>
          </Tooltip>
          <button
            onClick={openSchedulerForm}
            className={`flex items-center ${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out`}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Schedule Post
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showFormModal} 
        onClose={closeSchedulerForm} 
        title={editingPost ? "Edit Scheduled Post" : "Schedule New Post"}
        darkMode={darkMode}
      >
        <PostSchedulerForm
          platforms={platforms}
          onSave={editingPost ? handleUpdatePost : handleAddPost}
          onCancel={closeSchedulerForm}
          initialPost={editingPost}
          darkMode={darkMode}
        />
      </Modal>

      {currentView === ViewState.LIST && (
        <>
          {sortedPosts.length === 0 ? (
            <div className={`text-center py-10 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No posts scheduled yet.</p>
              <p>Click "Schedule Post" to get started or switch to Calendar View!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <ScheduledPostItem
                  key={post.id}
                  post={post}
                  platforms={platforms}
                  onEdit={() => handleEditPost(post)}
                  onDelete={() => handleDeletePost(post.id)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </>
      )}

      {currentView === ViewState.CALENDAR && (
         <CalendarView 
            events={calendarEvents} 
            onEventClick={(eventInfo) => handleEditPost(eventInfo.event.extendedProps.resource as ScheduledPost)}
            darkMode={darkMode}
          />
      )}
    </div>
  );
};
