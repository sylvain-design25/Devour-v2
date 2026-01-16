'use client';

import { Story, Stage } from '../types';
import StoryCard from './StoryCard';
import { Plus } from 'lucide-react';

interface StoryColumnProps {
  stage: Stage;
  stories: Story[];
  onStoryClick: (story: Story) => void;
  onStoryUpdate: (id: string, updates: Partial<Story>) => void;
  onStoryDelete: (id: string) => void;
}

export default function StoryColumn({
  stage,
  stories,
  onStoryClick,
  onStoryUpdate,
  onStoryDelete
}: StoryColumnProps) {
  const handleQuickPass = (story: Story) => {
    onStoryUpdate(story.id, { stage: Stage.Pass });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-devour-border">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {stage}
          </h2>
          <span className="text-xs text-gray-500">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </span>
        </div>
        
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Add new submission to this stage"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Stories List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {stories.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No stories in this stage
          </div>
        ) : (
          stories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onStoryClick(story)}
              onQuickPass={() => handleQuickPass(story)}
              onTrash={() => onStoryDelete(story.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
