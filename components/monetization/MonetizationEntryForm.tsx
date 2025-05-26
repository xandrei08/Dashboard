
import React, { useState, useEffect } from 'react';
import { MonetizationEntry, TrackedPostItem, SocialPlatform } from '../../types';

interface MonetizationEntryFormProps {
  onSave: (entry: MonetizationEntry) => void;
  onCancel: () => void;
  initialEntry?: MonetizationEntry | null;
  trackedPosts: TrackedPostItem[];
  platforms: SocialPlatform[];
  darkMode?: boolean;
}

export const MonetizationEntryForm: React.FC<MonetizationEntryFormProps> = ({
  onSave,
  onCancel,
  initialEntry,
  trackedPosts,
  platforms,
  darkMode
}) => {
  const [source, setSource] = useState<string>(initialEntry?.source || '');
  const [amount, setAmount] = useState<number>(initialEntry?.amount || 0);
  const [date, setDate] = useState<string>(
    initialEntry?.date ? new Date(initialEntry.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [postId, setPostId] = useState<string>(initialEntry?.postId || '');
  const [platformId, setPlatformId] = useState<string>(initialEntry?.platformId || '');
  const [notes, setNotes] = useState<string>(initialEntry?.notes || '');

  useEffect(() => {
    if (initialEntry) {
      setSource(initialEntry.source);
      setAmount(initialEntry.amount);
      setDate(new Date(initialEntry.date).toISOString().substring(0, 10));
      setPostId(initialEntry.postId || '');
      setPlatformId(initialEntry.platformId || '');
      setNotes(initialEntry.notes || '');
    } else {
      // Reset for new entry
      setSource('');
      setAmount(0);
      setDate(new Date().toISOString().substring(0, 10));
      setPostId('');
      setPlatformId('');
      setNotes('');
    }
  }, [initialEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || amount <= 0 || !date) {
        alert("Please fill in Source, Amount (greater than 0), and Date.");
        return;
    }
    onSave({
      id: initialEntry?.id || Date.now().toString(),
      source,
      amount,
      date: new Date(date).toISOString(),
      postId: postId || undefined,
      platformId: platformId || undefined,
      notes: notes || undefined,
    });
  };

  const inputClasses = `${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm border rounded-md p-2 shadow-sm`;
  const labelClasses = `block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="source" className={labelClasses}>Source of Income</label>
        <input type="text" id="source" value={source} onChange={e => setSource(e.target.value)} className={inputClasses} required placeholder="e.g., Brand Deal, Ad Revenue" />
      </div>
      <div>
        <label htmlFor="amount" className={labelClasses}>Amount ($)</label>
        <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} min="0.01" step="0.01" className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="date" className={labelClasses}>Date</label>
        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="platformId" className={labelClasses}>Platform (Optional)</label>
        <select id="platformId" value={platformId} onChange={e => setPlatformId(e.target.value)} className={inputClasses}>
          <option value="">Select Platform</option>
          {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {/* 
      // Feature to link to specific post - can be complex if many posts
      // For simplicity, keeping it optional or could be enhanced later.
      {trackedPosts.length > 0 && (
        <div>
          <label htmlFor="postId" className={labelClasses}>Link to Tracked Post (Optional)</label>
          <select id="postId" value={postId} onChange={e => setPostId(e.target.value)} className={inputClasses}>
            <option value="">None</option>
            {trackedPosts.map(post => (
              <option key={post.id} value={post.id}>
                {platforms.find(p => p.id === post.platformId)?.name} - {post.postLinkOrIdentifier.substring(0,30)}...
              </option>
            ))}
          </select>
        </div>
      )}
      */}
      <div>
        <label htmlFor="notes" className={labelClasses}>Notes (Optional)</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputClasses} placeholder="Any additional details..."></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-md font-medium transition`}>
          Cancel
        </button>
        <button type="submit" className={`${darkMode ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'} text-white py-2 px-4 rounded-md font-medium transition shadow-sm`}>
          {initialEntry ? 'Save Changes' : 'Add Earning'}
        </button>
      </div>
    </form>
  );
};
