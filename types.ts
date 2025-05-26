export interface SocialPlatform {
  id: string;
  name: string;
  icon?: React.ReactElement<{ className?: string, title?: string }>;
  color?: string;
}

export interface ScheduledPost {
  id: string;
  platformId: string;
  usernameOrLink: string;
  content: string;
  scheduledTime: string; // ISO string for date-time
  status: 'scheduled' | 'posted' | 'failed';
  mediaUrl?: string;
  geminiGenerated?: boolean;
}

export interface TrackedPostMetrics {
  likes: number;
  views: number;
  shares: number;
  comments: number;
  lastUpdated: string; // ISO string
}

export interface TrackedPostItem {
  id: string;
  postLinkOrIdentifier: string;
  platformId: string;
  captionSummary?: string;
  metrics: TrackedPostMetrics;
  notes?: string;
}

export interface AccountGoal {
  description: string; // e.g., "Reach 10k Followers"
  targetValue: number;
  currentValue?: number; // User might update this periodically
  metricName?: string; // e.g., "Followers"
}

export interface TrackedAccount {
  id: string;
  platformId: string;
  usernameOrProfileLink: string;
  posts: TrackedPostItem[];
  overallMetrics?: {
    followers?: number;
    engagementRate?: number;
  };
  goal?: AccountGoal;
}

export interface ExpenseItem {
  id: string;
  description: string;
  category: string; // e.g., 'Software', 'Equipment', 'Advertising'
  amount: number;
  date: string; // ISO string
}

export interface MonetizationEntry {
  id:string;
  source: string;
  postId?: string;
  platformId?: string;
  amount: number;
  date: string; // ISO string
  notes?: string;
}

export interface GeminiContentSuggestion {
  idea: string;
  caption: string;
  hashtags: string[];
}

export interface PlannerSummary {
  upcomingPosts: number;
  pastDuePosts: number;
}

export interface TrackerSummary {
  trackedAccounts: number;
  totalTrackedPosts: number;
  // Potentially add average engagement rate later if calculable
}

export interface MonetizationSummaryData {
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  entryCount: number;
}

// Enum for view states in components
export enum ViewState {
  LIST,
  ADD,
  EDIT,
  DETAIL,
  CALENDAR, // For planner
  GRAPH,    // For tracker post graph
  COMPARE   // For tracker post comparison
}

// For Calendar View
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource?: any; // Can hold the ScheduledPost object
  platformColor?: string;
}

// AI Stub types
export interface RepurposeSuggestion {
  platformName: string;
  repurposedContent: string;
  notes?: string;
}

export interface RevenueIdea {
  idea: string;
  description: string;
  potential?: 'Low' | 'Medium' | 'High';
}

export interface TrendReport {
    trendName: string;
    description: string;
    relevance: string;
}

export interface TitleVariation {
    variation: string;
    strength?: string;
}