'use client';

import { useState, useEffect } from 'react';
import { Story, Stage, STAGE_ORDER } from '../types';
import { DatabaseService } from '../lib/database';
import Sidebar from '../components/Sidebar';
import StoryColumn from '../components/StoryColumn';
import StoryDetailPanel from '../components/StoryDetailPanel';
import NewStoryModal from '../components/NewStoryModal';
import { Plus, Search } from 'lucide-react';

export default function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string | 'all'>('all');

  // Load stories from database
  useEffect(() => {
    loadStories();
    
    // Subscribe to real-time updates
    const channel = DatabaseService.subscribeToStories((payload) => {
      console.log('Real-time update:', payload);
      loadStories(); // Reload on any change
    });

    return () => {
      DatabaseService.unsubscribeFromStories(channel);
    };
  }, []);

  async function loadStories() {
    try {
      const data = await DatabaseService.getStories();
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter stories
  const filteredStories = stories.filter(story => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        (story.genre?.toLowerCase() || '').includes(query);
      if (!matchesSearch) return false;
    }

    // Stage filter
    if (filterStage !== 'all' && story.stage !== filterStage) {
      return false;
    }

    // Tag filter
    if (filterTag !== 'all' && (!story.tags || !story.tags.includes(filterTag))) {
      return false;
    }

    return true;
  });

  // Group stories by stage
  const storiesByStage: Record<Stage, Story[]> = {} as any;
  STAGE_ORDER.forEach(stage => {
    storiesByStage[stage] = filteredStories.filter(s => s.stage === stage);
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(stories.flatMap(s => s.tags || []))
  ).sort();

  const handleStoryUpdate = async (storyId: string, updates: Partial<Story>) => {
    try {
      await DatabaseService.updateStory(storyId, updates);
      await loadStories();
      
      // Update selected story if it's the one being updated
      if (selectedStory?.id === storyId) {
        setSelectedStory({ ...selectedStory, ...updates });
      }
    } catch (error) {
      console.error('Failed to update story:', error);
    }
  };

  const handleStoryCreate = async (story: Partial<Story>) => {
    try {
      await DatabaseService.createStory(story);
      await loadStories();
      setShowNewStoryModal(false);
    } catch (error) {
      console.error('Failed to create story:', error);
    }
  };

  const handleStoryDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to move this story to trash?')) return;
    
    try {
      await DatabaseService.deleteStory(storyId);
      await loadStories();
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  // Columns to display (showing only the main workflow stages)
  const displayStages: Stage[] = [
    Stage.NewSubmission,
    Stage.Assigned,
    Stage.InReview,
  ];

  const processedStages: Stage[] = [
    Stage.Accepted,
    Stage.PassWithInterest,
    Stage.Pass,
    Stage.Withdrawn,
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeView="dashboard" 
        storiesCount={stories.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-devour-border p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif">Editorial Board</h1>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-devour-border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-devour-accent"
                />
              </div>

              {/* New Entry Button */}
              <button
                onClick={() => setShowNewStoryModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-devour-accent text-white rounded-lg hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                NEW ENTRY
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-600">FILTERS:</span>
            
            {/* Tag Filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value as any)}
              className="px-3 py-1 border border-devour-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-devour-accent"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Stage Filter */}
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="px-3 py-1 border border-devour-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-devour-accent"
            >
              <option value="all">All Stages</option>
              {STAGE_ORDER.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto bg-devour-bg">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
              {displayStages.map(stage => (
                <StoryColumn
                  key={stage}
                  stage={stage}
                  stories={storiesByStage[stage]}
                  onStoryClick={setSelectedStory}
                  onStoryUpdate={handleStoryUpdate}
                  onStoryDelete={handleStoryDelete}
                />
              ))}
            </div>

            {/* Processed Section */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide text-gray-700">
                Processed
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {processedStages.map(stage => {
                  const count = storiesByStage[stage].length;
                  return (
                    <button
                      key={stage}
                      onClick={() => setFilterStage(stage)}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <div className="text-sm font-medium text-gray-600 uppercase">
                        {stage}
                      </div>
                      <div className="text-2xl font-bold mt-2">{count}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Detail Panel */}
      {selectedStory && (
        <StoryDetailPanel
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onUpdate={(updates) => handleStoryUpdate(selectedStory.id, updates)}
          onDelete={() => handleStoryDelete(selectedStory.id)}
        />
      )}

      {/* New Story Modal */}
      {showNewStoryModal && (
        <NewStoryModal
          onClose={() => setShowNewStoryModal(false)}
          onCreate={handleStoryCreate}
        />
      )}
    </div>
  );
}
