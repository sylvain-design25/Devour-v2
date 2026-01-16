'use client';

import { useState } from 'react';
import { Story, Stage, Category } from '../types';
import { DatabaseService } from '../lib/database';
import { X, Upload } from 'lucide-react';

interface NewStoryModalProps {
  onClose: () => void;
  onCreate: (story: Partial<Story>) => void;
}

export default function NewStoryModal({ onClose, onCreate }: NewStoryModalProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    email: '',
    stage: Stage.NewSubmission as Stage,
    assignee: undefined as 'HK' | 'SK' | undefined,
    genre: '',
    wordCount: 0,
    logline: '',
    notes: '',
    category: Category.Journal as Category,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Auto-fill word count if it's a text file (approximate)
      const file = e.target.files[0];
      if (file.type.includes('text') || file.name.endsWith('.docx')) {
        // Rough estimate: 1 page = 250 words, 1 KB ≈ 150 words
        const estimatedWords = Math.round((file.size / 1024) * 150);
        setFormData(prev => ({ ...prev, wordCount: estimatedWords }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.email) {
      alert('Please fill in all required fields (Title, Author, Email)');
      return;
    }

    setUploading(true);

    try {
      const storyId = DatabaseService.generateStoryId();
      
      // Upload file if provided
      let fileUrl = undefined;
      let fileName = undefined;
      
      if (file) {
        fileUrl = await DatabaseService.uploadFile(file, storyId);
        fileName = file.name;
      }

      // Create story object
      const newStory: Partial<Story> = {
        id: storyId,
        title: formData.title,
        author: formData.author,
        email: formData.email,
        stage: formData.stage,
        assignee: formData.assignee,
        genre: formData.genre || undefined,
        wordCount: formData.wordCount || undefined,
        logline: formData.logline || undefined,
        notes: formData.notes || '',
        category: formData.category,
        fileUrl,
        fileName,
        submissionDate: new Date().toISOString(),
        description: formData.logline || '',
        tags: [],
        responseSent: false,
      };

      onCreate(newStory);
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-devour-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">New Entry</h2>
            <span className="text-sm text-gray-500">DRAFT</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                1. Upload Manuscript
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-devour-accent transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-devour-accent" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drop PDF or DOCX Here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                2. Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Jane Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Story Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                3. Story Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Title of the Story"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="author@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">4. Status</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Stage })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              >
                <option value={Stage.NewSubmission}>New Submission</option>
                <option value={Stage.Assigned}>Assigned</option>
                <option value={Stage.InReview}>In Review</option>
                <option value={Stage.Accepted}>Accepted</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              >
                <option value={Category.Journal}>Journal</option>
                <option value={Category.Audiofile}>Audiofile</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium mb-2">Assignee</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignee: undefined })}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    !formData.assignee
                      ? 'bg-gray-200 border-gray-400'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Unassigned
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignee: 'HK' })}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    formData.assignee === 'HK'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  HK
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignee: 'SK' })}
                  className={`flex-1 px-4 py-2 border rounded transition-colors ${
                    formData.assignee === 'SK'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  SK
                </button>
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="e.g. Gothic Horror"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Word Count */}
            <div>
              <label className="block text-sm font-medium mb-2">Word Count</label>
              <input
                type="number"
                value={formData.wordCount}
                onChange={(e) => setFormData({ ...formData, wordCount: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Logline */}
            <div>
              <label className="block text-sm font-medium mb-2">Logline / Concept</label>
              <textarea
                value={formData.logline}
                onChange={(e) => setFormData({ ...formData, logline: e.target.value })}
                placeholder="A concise, high-concept summary of the story."
                className="w-full px-3 py-2 border border-gray-300 rounded h-20 focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Editorial Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Initial thoughts..."
                className="w-full px-3 py-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-devour-accent"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-devour-border p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-6 py-2 bg-devour-accent text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? 'Creating...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
