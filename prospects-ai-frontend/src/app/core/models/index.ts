export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LinkedInAccount {
  id: string;
  linkedinEmail: string;
  memberId?: string;
  fullName?: string;
  headline?: string;
  profilePictureUrl?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'WARMING_UP' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  dailyConnectionLimit: number;
  dailyMessageLimit: number;
  connectionsSentToday: number;
  messagesSentToday: number;
  proxyId?: string;
  proxyLabel?: string;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  linkedinUrl?: string;
  company?: string;
  title?: string;
  industry?: string;
  location?: string;
  summary?: string;
  status: string;
  source: string;
  leadListId?: string;
  leadListName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  totalEnrolled: number;
  totalConnected: number;
  totalReplied: number;
  linkedInAccountId?: string;
  linkedInAccountName?: string;
  steps: CampaignStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStep {
  id: string;
  stepOrder: number;
  stepType: string;
  messageTemplate?: string;
  aiPersonalize: boolean;
  delayDays: number;
  delayHours: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
