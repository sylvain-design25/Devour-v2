import { supabase } from './supabase';
import { Story, DbStory, dbStoryToStory, storyToDbStory, Stage } from '../types';

export class DatabaseService {
  // Get all active stories (not deleted)
  static async getStories(): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .is('deleted_at', null)
      .order('submission_date', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }

    return (data as DbStory[]).map(dbStoryToStory);
  }

  // Get single story by ID
  static async getStory(id: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching story:', error);
      return null;
    }

    return data ? dbStoryToStory(data as DbStory) : null;
  }

  // Create new story
  static async createStory(story: Partial<Story>): Promise<Story | null> {
    const dbStory = storyToDbStory(story);
    
    const { data, error } = await supabase
      .from('stories')
      .insert(dbStory)
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      throw error;
    }

    return data ? dbStoryToStory(data as DbStory) : null;
  }

  // Update story
  static async updateStory(id: string, updates: Partial<Story>): Promise<Story | null> {
    const dbUpdates = storyToDbStory(updates);
    
    const { data, error } = await supabase
      .from('stories')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating story:', error);
      throw error;
    }

    return data ? dbStoryToStory(data as DbStory) : null;
  }

  // Soft delete story
  static async deleteStory(id: string): Promise<void> {
    const { error } = await supabase
      .from('stories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  // Get stories by stage
  static async getStoriesByStage(stage: Stage): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('stage', stage)
      .is('deleted_at', null)
      .order('submission_date', { ascending: false });

    if (error) {
      console.error('Error fetching stories by stage:', error);
      throw error;
    }

    return (data as DbStory[]).map(dbStoryToStory);
  }

  // Get stories by assignee
  static async getStoriesByAssignee(assignee: 'HK' | 'SK' | 'Unassigned'): Promise<Story[]> {
    let query = supabase
      .from('stories')
      .select('*')
      .is('deleted_at', null);

    if (assignee === 'Unassigned') {
      query = query.is('assignee', null);
    } else {
      query = query.eq('assignee', assignee);
    }

    const { data, error } = await query.order('submission_date', { ascending: false });

    if (error) {
      console.error('Error fetching stories by assignee:', error);
      throw error;
    }

    return (data as DbStory[]).map(dbStoryToStory);
  }

  // Search stories
  static async searchStories(query: string): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,genre.ilike.%${query}%`)
      .order('submission_date', { ascending: false });

    if (error) {
      console.error('Error searching stories:', error);
      throw error;
    }

    return (data as DbStory[]).map(dbStoryToStory);
  }

  // Subscribe to real-time changes
  static subscribeToStories(callback: (payload: any) => void) {
    const channel = supabase
      .channel('stories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories'
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from real-time changes
  static unsubscribeFromStories(channel: any) {
    supabase.removeChannel(channel);
  }

  // Generate unique ID for new story
  static generateStoryId(): string {
    const chars = '0123456789ABCDEF';
    let id = '';
    for (let i = 0; i < 4; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }

  // Upload file to Supabase storage
  static async uploadFile(file: File, storyId: string): Promise<string | null> {
    const fileName = `${storyId}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('manuscripts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('manuscripts')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Get file URL
  static getFileUrl(fileName: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('manuscripts')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
}
