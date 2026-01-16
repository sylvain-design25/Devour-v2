// Enums for stages and categories
export enum Stage {
  NewSubmission = "New Submission",
  Assigned = "Assigned",
  InReview = "In Review",
  Accepted = "Accepted",
  Scheduled = "Scheduled",
  Published = "Published",
  PassWithInterest = "Pass, with interest",
  Pass = "Pass",
  Withdrawn = "Withdrawn"
}

export enum Category {
  Journal = "Journal",
  Audiofile = "Audiofile"
}

export type CustomFieldType = 'text' | 'number' | 'date' | 'boolean' | 'longtext';

export interface CustomFieldDefinition {
  key: string;
  label: string;
  type: CustomFieldType;
}

export interface Annotation {
  id: string;
  text: string;
  createdAt: string;
  author: string;
  scrollPosition?: number;
  contextText?: string;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  email: string;
  fileUrl?: string;
  fileName?: string;
  description: string;
  submissionDate: string;
  notes: string;
  stage: Stage;
  tags?: string[];
  
  // Workflow fields
  assignee?: 'HK' | 'SK';
  responseSent?: boolean;
  
  // Bot Assisted Data
  wordCount?: number;
  genre?: string;
  logline?: string;
  authorBio?: string;

  // Scheduled / Published fields
  releaseDate?: string;
  issue?: string;
  category?: Category;
  
  // Scheduled only fields
  hasContract?: boolean;
  hasIllustrations?: boolean;
  hasSocials?: boolean;

  // Audiofile Workflow
  audioNarration?: boolean;
  audioScore?: boolean;
  audioSoundFX?: boolean;
  audioFinalMix?: boolean;
  audioVisuals?: boolean;

  // Custom User-Defined Fields
  customFields?: Record<string, any>;

  // Editorial Tools
  annotations?: Annotation[];

  // Deletion state
  deletedAt?: string | null;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export type TaskAssignee = 'HK' | 'SK';
export type TaskCategory = 'Journal' | 'Audiofile' | 'Submission';

export interface Task {
  id: string;
  title: string;
  assignee: TaskAssignee;
  category: TaskCategory;
  linkedStoryId?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  notes?: string;
}

export const STAGE_ORDER = [
  Stage.NewSubmission,
  Stage.Assigned,
  Stage.InReview,
  Stage.PassWithInterest,
  Stage.Pass,
  Stage.Withdrawn,
  Stage.Accepted,
  Stage.Scheduled,
  Stage.Published
];

// Database types (snake_case for Supabase)
export interface DbStory {
  id: string;
  title: string;
  author: string;
  email: string;
  file_url?: string;
  file_name?: string;
  description: string;
  submission_date: string;
  notes: string;
  stage: string;
  tags?: string[];
  assignee?: string;
  response_sent?: boolean;
  word_count?: number;
  genre?: string;
  logline?: string;
  author_bio?: string;
  release_date?: string;
  issue?: string;
  category?: string;
  has_contract?: boolean;
  has_illustrations?: boolean;
  has_socials?: boolean;
  audio_narration?: boolean;
  audio_score?: boolean;
  audio_sound_fx?: boolean;
  audio_final_mix?: boolean;
  audio_visuals?: boolean;
  custom_fields?: any;
  annotations?: any;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Conversion functions
export function dbStoryToStory(dbStory: DbStory): Story {
  return {
    id: dbStory.id,
    title: dbStory.title,
    author: dbStory.author,
    email: dbStory.email,
    fileUrl: dbStory.file_url,
    fileName: dbStory.file_name,
    description: dbStory.description,
    submissionDate: dbStory.submission_date,
    notes: dbStory.notes,
    stage: dbStory.stage as Stage,
    tags: dbStory.tags,
    assignee: dbStory.assignee as 'HK' | 'SK' | undefined,
    responseSent: dbStory.response_sent,
    wordCount: dbStory.word_count,
    genre: dbStory.genre,
    logline: dbStory.logline,
    authorBio: dbStory.author_bio,
    releaseDate: dbStory.release_date,
    issue: dbStory.issue,
    category: dbStory.category as Category | undefined,
    hasContract: dbStory.has_contract,
    hasIllustrations: dbStory.has_illustrations,
    hasSocials: dbStory.has_socials,
    audioNarration: dbStory.audio_narration,
    audioScore: dbStory.audio_score,
    audioSoundFX: dbStory.audio_sound_fx,
    audioFinalMix: dbStory.audio_final_mix,
    audioVisuals: dbStory.audio_visuals,
    customFields: dbStory.custom_fields,
    annotations: dbStory.annotations,
    deletedAt: dbStory.deleted_at,
    createdAt: dbStory.created_at,
    updatedAt: dbStory.updated_at
  };
}

export function storyToDbStory(story: Partial<Story>): Partial<DbStory> {
  return {
    id: story.id,
    title: story.title,
    author: story.author,
    email: story.email,
    file_url: story.fileUrl,
    file_name: story.fileName,
    description: story.description,
    submission_date: story.submissionDate,
    notes: story.notes,
    stage: story.stage,
    tags: story.tags,
    assignee: story.assignee,
    response_sent: story.responseSent,
    word_count: story.wordCount,
    genre: story.genre,
    logline: story.logline,
    author_bio: story.authorBio,
    release_date: story.releaseDate,
    issue: story.issue,
    category: story.category,
    has_contract: story.hasContract,
    has_illustrations: story.hasIllustrations,
    has_socials: story.hasSocials,
    audio_narration: story.audioNarration,
    audio_score: story.audioScore,
    audio_sound_fx: story.audioSoundFX,
    audio_final_mix: story.audioFinalMix,
    audio_visuals: story.audioVisuals,
    custom_fields: story.customFields,
    annotations: story.annotations,
    deleted_at: story.deletedAt
  };
}
