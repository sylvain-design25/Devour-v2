'use client';

import { Story, Stage, STAGE_ORDER, Category } from '@/types';
import { X, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StoryDetailPanelProps {
  story: Story;
  onClose: () => void;
  onUpdate: (updates: Partial<Story>) => void;
  onDelete: () => void;
}

export default function StoryDetailPanel({
  story,
  onClose,
  onUpdate,
  onDelete
}: StoryDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'email'>('details');
  const [editedStory, setEditedStory] = useState<Story>(story);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedStory(story);
    setHasChanges(false);
  }, [story]);

  const handleChange = (field: keyof Story, value: any) => {
    setEditedStory(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(editedStory);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedStory(story);
    setHasChanges(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${story.title}"? This will move it to trash.`)) {
      onDelete();
      onClose();
    }
  };

  const copyReceiptEmail = () => {
    const template = "Thank you for your submission! We look forward to digging in.";
    navigator.clipboard.writeText(template);
    alert('Email template copied!');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-devour-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{story.title}</h2>
            <p className="text-sm text-gray-600">ID: #{story.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-devour-accent border-b-2 border-devour-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            DETAILS
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'email'
                ? 'text-devour-accent border-b-2 border-devour-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EMAIL
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Manuscript File */}
            {story.fileName && (
              <div>
                <label className="block text-sm font-medium mb-2">1. UPLOAD MANUSCRIPT</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm flex-1">{story.fileName}</span>
                  {story.fileUrl && (
                    <a
                      href={story.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-devour-accent hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium mb-2">2. AUTHOR NAME</label>
              <input
                type="text"
                value={editedStory.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Story Title */}
            <div>
              <label className="block text-sm font-medium mb-2">3. STORY TITLE</label>
              <input
                type="text"
                value={editedStory.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">4. STATUS</label>
              <select
                value={editedStory.stage}
                onChange={(e) => handleChange('stage', e.target.value as Stage)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              >
                {STAGE_ORDER.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium mb-2">ASSIGNEE</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChange('assignee', undefined)}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    !editedStory.assignee
                      ? 'bg-gray-200 border-gray-400'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Unassigned
                </button>
                <button
                  onClick={() => handleChange('assignee', 'HK')}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    editedStory.assignee === 'HK'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  HK
                </button>
                <button
                  onClick={() => handleChange('assignee', 'SK')}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    editedStory.assignee === 'SK'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  SK
                </button>
              </div>
            </div>

            {/* Receipt Response Sent */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedStory.responseSent || false}
                  onChange={(e) => handleChange('responseSent', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Receipt Response Sent</span>
              </label>
              {!editedStory.responseSent && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-600 mb-2">
                    Thank you for your submission! We look forward to digging in.
                  </p>
                  <button
                    onClick={copyReceiptEmail}
                    className="flex items-center gap-2 text-devour-accent hover:underline"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              )}
            </div>

            {/* Logline */}
            <div>
              <label className="block text-sm font-medium mb-2">LOGLINE / CONCEPT</label>
              <textarea
                value={editedStory.logline || ''}
                onChange={(e) => handleChange('logline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded h-20 focus:outline-none focus:ring-2 focus:ring-devour-accent"
                placeholder="A concise, high-concept summary of the story."
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">EMAIL</label>
              <input
                type="email"
                value={editedStory.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Date Submitted */}
            <div>
              <label className="block text-sm font-medium mb-2">DATE SUBMITTED</label>
              <input
                type="date"
                value={editedStory.submissionDate?.split('T')[0] || ''}
                onChange={(e) => handleChange('submissionDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Word Count */}
            <div>
              <label className="block text-sm font-medium mb-2">WORD COUNT</label>
              <input
                type="number"
                value={editedStory.wordCount || 0}
                onChange={(e) => handleChange('wordCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">GENRE</label>
              <input
                type="text"
                value={editedStory.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
                placeholder="e.g. Gothic Horror"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Author Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">AUTHOR BIO / PUBLICATIONS</label>
              <textarea
                value={editedStory.authorBio || ''}
                onChange={(e) => handleChange('authorBio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-devour-accent"
                placeholder="Bio and former publications..."
              />
            </div>

            {/* Keywords/Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">KEYWORDS</label>
              <input
                type="text"
                value={editedStory.tags?.join(', ') || ''}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                placeholder="horror, psychological, gothic (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Editorial Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">EDITORIAL NOTES</label>
              <textarea
                value={editedStory.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-devour-accent"
                placeholder="Editor feedback..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Email templates and communication history will go here.
            </p>
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium mb-2">Receipt Email Template:</p>
              <p className="text-sm text-gray-700">
                Thank you for your submission! We look forward to digging in.
              </p>
              <button
                onClick={copyReceiptEmail}
                className="mt-3 flex items-center gap-2 text-devour-accent hover:underline text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy Template
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-devour-border p-6 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-2 bg-devour-accent text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}
