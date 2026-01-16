'use client';

import { Story } from '@/types';
import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
  onQuickPass: () => void;
  onTrash: () => void;
}

export default function StoryCard({ story, onClick, onQuickPass, onTrash }: StoryCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleQuickPass = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Quick pass "${story.title}"?`)) {
      onQuickPass();
    }
  };

  const handleTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Move "${story.title}" to trash?`)) {
      onTrash();
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="bg-white border border-devour-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all mb-3 relative"
    >
      {/* ID Badge */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 font-mono">#{story.id}</span>
        
        {/* Quick Actions (show on hover) */}
        {showActions && (
          <div className="flex gap-1">
            <button
              onClick={handleQuickPass}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Quick Pass"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleTrash}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              title="Move to Trash"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-base mb-1 text-gray-900 line-clamp-2">
        {story.title}
      </h3>

      {/* Author */}
      <p className="text-sm text-gray-600 mb-3">
        {story.author}
      </p>

      {/* Logline (if exists) */}
      {story.logline && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 italic">
          {story.logline}
        </p>
      )}

      {/* Category Badge */}
      {story.category && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded uppercase">
            {story.category}
          </span>
        </div>
      )}

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {story.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          {story.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{story.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Assignee Indicator */}
      {story.assignee && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            {story.assignee}
          </span>
        </div>
      )}
    </div>
  );
}
