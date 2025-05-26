
import React, { useState, useEffect, useCallback } from 'react';
import { ScheduledPost, SocialPlatform, GeminiContentSuggestion, RepurposeSuggestion } from '../../types';
import { SparklesIcon, ImagePlaceholderIcon, BrainIcon, InformationCircleIcon } from '../common/Icons';
import LoadingSpinner from '../common/LoadingSpinner';
import { generateContentIdea, isGeminiAvailable, repurposeContentAI } from '../../services/geminiService';
import Tooltip from '../common/Tooltip';

interface PostSchedulerFormProps {
  platforms: SocialPlatform[];
  onSave: (post: ScheduledPost) => void;
  onCancel: () => void;
  initialPost?: ScheduledPost | null;
  darkMode?: boolean;
}

export const PostSchedulerForm: React.FC<PostSchedulerFormProps> = ({
  platforms,
  onSave,
  onCancel,
  initialPost,
  darkMode
}) => {
  const [platformId, setPlatformId] = useState<string>(initialPost?.platformId || (platforms.length > 0 ? platforms[0].id : ''));
  const [usernameOrLink, setUsernameOrLink] = useState<string>(initialPost?.usernameOrLink || '');
  const [content, setContent] = useState<string>(initialPost?.content || '');
  const [scheduledTime, setScheduledTime] = useState<string>(
    initialPost?.scheduledTime ? new Date(initialPost.scheduledTime).toISOString().substring(0, 16) : new Date(Date.now() + 3600 * 1000).toISOString().substring(0, 16)
  );
  const [mediaUrl, setMediaUrl] = useState<string>(initialPost?.mediaUrl || '');
  const [geminiTopic, setGeminiTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiGenerated, setGeminiGenerated] = useState<boolean>(initialPost?.geminiGenerated || false);

  const [isRepurposing, setIsRepurposing] = useState<boolean>(false);
  const [repurposeError, setRepurposeError] = useState<string | null>(null);
  const [repurposeTargetPlatform, setRepurposeTargetPlatform] = useState<string> (platforms.length > 1 ? platforms.find(p=>p.id !== platformId)?.id || platforms[1].id : '');
  const [showRepurposeResult, setShowRepurposeResult] = useState<RepurposeSuggestion | null>(null);


  useEffect(() => {
    if (initialPost) {
      setPlatformId(initialPost.platformId);
      setUsernameOrLink(initialPost.usernameOrLink);
      setContent(initialPost.content);
      setScheduledTime(new Date(initialPost.scheduledTime).toISOString().substring(0, 16));
      setMediaUrl(initialPost.mediaUrl || '');
      setGeminiGenerated(initialPost.geminiGenerated || false);
    } else {
      setPlatformId(platforms.length > 0 ? platforms[0].id : '');
      setUsernameOrLink('');
      setContent('');
      setScheduledTime(new Date(Date.now() + 3600 * 1000).toISOString().substring(0, 16));
      setMediaUrl('');
      setGeminiGenerated(false);
    }
  }, [initialPost, platforms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformId || !usernameOrLink || !content || !scheduledTime) {
        alert("Please fill in all required fields: Platform, Username/Link, Content, and Scheduled Time.");
        return;
    }
    onSave({
      id: initialPost?.id || Date.now().toString(),
      platformId,
      usernameOrLink,
      content,
      scheduledTime: new Date(scheduledTime).toISOString(),
      status: initialPost?.status || 'scheduled',
      mediaUrl: mediaUrl || undefined,
      geminiGenerated
    });
  };

  const handleGeminiSuggest = useCallback(async () => {
    if (!geminiTopic.trim() || !platformId) {
      setGeminiError("Please enter a topic and select a platform.");
      return;
    }
    setIsGenerating(true);
    setGeminiError(null);
    const selectedPlatform = platforms.find(p => p.id === platformId);
    if (!selectedPlatform) {
        setGeminiError("Invalid platform selected.");
        setIsGenerating(false);
        return;
    }

    const suggestion = await generateContentIdea(selectedPlatform.name, geminiTopic);
    setIsGenerating(false);
    if (suggestion) {
      setContent(suggestion.caption + "\n\n" + suggestion.hashtags.join(' '));
      setGeminiGenerated(true);
    } else {
      setGeminiError("Failed to generate content. Ensure API key is set and try again.");
    }
  }, [geminiTopic, platformId, platforms]);

  const handleRepurposeContent = async () => {
    if (!content.trim() || !platformId || !repurposeTargetPlatform) {
        setRepurposeError("Current content, original platform, and target platform for repurposing are required.");
        return;
    }
    setIsRepurposing(true);
    setRepurposeError(null);
    setShowRepurposeResult(null);

    const originalPlatformName = platforms.find(p => p.id === platformId)?.name || "current platform";
    const targetPlatformName = platforms.find(p => p.id === repurposeTargetPlatform)?.name || "target platform";

    const result = await repurposeContentAI(content, originalPlatformName, targetPlatformName);
    setIsRepurposing(false);
    if (result) {
        setShowRepurposeResult(result);
    } else {
        setRepurposeError("Failed to repurpose content with AI. Ensure API key is set and try again.");
    }
  };
  
  const inputClasses = `${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm border rounded-md p-2 shadow-sm`;
  const labelClasses = `block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      <div>
        <label htmlFor="platformId" className={labelClasses}>Platform</label>
        <select id="platformId" value={platformId} onChange={e => setPlatformId(e.target.value)} className={inputClasses} required>
          {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="usernameOrLink" className={labelClasses}>Username / Link</label>
        <input type="text" id="usernameOrLink" value={usernameOrLink} onChange={e => setUsernameOrLink(e.target.value)} className={inputClasses} required placeholder="e.g., @yourhandle or profile URL" />
      </div>
      
      {isGeminiAvailable() && (
        <div className={`p-3 rounded-md ${darkMode ? 'bg-slate-700' : 'bg-gray-50 border border-gray-200'}`}>
          <h3 className={`text-sm font-medium flex items-center ${darkMode ? 'text-accent-400' : 'text-primary-600'} mb-2`}>
            <SparklesIcon className="w-5 h-5 mr-2" />
            AI Content Assistant
          </h3>
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <label htmlFor="geminiTopic" className={`${labelClasses} text-xs`}>Topic for AI</label>
              <input type="text" id="geminiTopic" value={geminiTopic} onChange={e => setGeminiTopic(e.target.value)} className={`${inputClasses} text-xs py-1`} placeholder="e.g., 'healthy breakfast ideas'" />
            </div>
            <button type="button" onClick={handleGeminiSuggest} disabled={isGenerating || !geminiTopic.trim()}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center justify-center ${darkMode ? 'bg-accent-500 hover:bg-accent-600 disabled:bg-slate-600' : 'bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300'} text-white transition`}
            >
              {isGenerating ? <LoadingSpinner size="sm" darkMode={!darkMode} /> : <SparklesIcon className="w-4 h-4 mr-1" />}
              Suggest
            </button>
          </div>
          {isGenerating && <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400':'text-gray-500'}`}>Generating content...</p>}
          {geminiError && <p className="text-xs text-red-500 mt-1">{geminiError}</p>}
        </div>
      )}

      <div>
        <label htmlFor="content" className={labelClasses}>Content</label>
        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} className={inputClasses} required placeholder="Write your post content here..."></textarea>
        {geminiGenerated && <p className={`text-xs mt-1 ${darkMode ? 'text-accent-300': 'text-primary-700'}`}>Content assisted by AI ✨</p>}
      </div>

      {isGeminiAvailable() && content.trim() && platforms.length > 1 && (
        <div className={`p-3 mt-2 rounded-md ${darkMode ? 'bg-slate-700' : 'bg-gray-50 border border-gray-200'}`}>
             <h3 className={`text-sm font-medium flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-600'} mb-2`}>
                <BrainIcon className="w-5 h-5 mr-2" />
                AI Content Repurposing
            </h3>
            <div className="flex items-end space-x-2">
                <div className="flex-grow">
                    <label htmlFor="repurposeTargetPlatform" className={`${labelClasses} text-xs`}>Repurpose for</label>
                    <select 
                        id="repurposeTargetPlatform" 
                        value={repurposeTargetPlatform} 
                        onChange={e => setRepurposeTargetPlatform(e.target.value)} 
                        className={`${inputClasses} text-xs py-1`}
                        disabled={platforms.filter(p => p.id !== platformId).length === 0}
                    >
                        {platforms.filter(p => p.id !== platformId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <button type="button" onClick={handleRepurposeContent} disabled={isRepurposing || !content.trim() || !repurposeTargetPlatform || platforms.filter(p => p.id !== platformId).length === 0}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center justify-center ${darkMode ? 'bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600' : 'bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300'} text-white transition`}
                >
                    {isRepurposing ? <LoadingSpinner size="sm" darkMode={!darkMode} /> : <BrainIcon className="w-4 h-4 mr-1" />}
                    Repurpose
                </button>
            </div>
            {isRepurposing && <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400':'text-gray-500'}`}>AI is thinking...</p>}
            {repurposeError && <p className="text-xs text-red-500 mt-1">{repurposeError}</p>}
            {showRepurposeResult && (
                <div className={`mt-2 p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-purple-50'}`}>
                    <p className={`text-xs font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>AI Suggestion for {showRepurposeResult.platformName}:</p>
                    <p className={`text-xs whitespace-pre-wrap ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{showRepurposeResult.repurposedContent}</p>
                    {showRepurposeResult.notes && <p className={`text-xs mt-1 italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Notes: {showRepurposeResult.notes}</p>}
                    <button 
                        type="button" 
                        onClick={() => {setContent(showRepurposeResult.repurposedContent); setPlatformId(repurposeTargetPlatform); setGeminiGenerated(true); setShowRepurposeResult(null);}}
                        className={`mt-1 text-xs px-2 py-1 rounded ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-200 hover:bg-purple-300 text-purple-800'}`}
                    >
                        Use this content & switch platform
                    </button>
                </div>
            )}
        </div>
      )}


      <div>
        <label htmlFor="scheduledTime" className={labelClasses}>Scheduled Time</label>
        <input type="datetime-local" id="scheduledTime" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="mediaUrl" className={labelClasses}>Media URL (Optional)</label>
        <div className="flex items-center space-x-2">
          <input type="text" id="mediaUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className={inputClasses} placeholder="https://example.com/image.jpg" />
          {mediaUrl ? <img src={mediaUrl} alt="Preview" className="w-10 h-10 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} /> : <ImagePlaceholderIcon className={`w-10 h-10 ${darkMode ? 'text-slate-500' : 'text-gray-300'}`} />}
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-md font-medium transition`}>
          Cancel
        </button>
        <button type="submit" className={`${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white py-2 px-4 rounded-md font-medium transition shadow-sm`}>
          {initialPost ? 'Save Changes' : 'Schedule Post'}
        </button>
      </div>
    </form>
  );
};
