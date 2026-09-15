export type OpportunityType = 'internship' | 'full-time' | 'part-time' | 'freelance' | 'volunteer' | 'apprenticeship';
export type OpportunityStatus = 'open' | 'closed' | 'draft' | 'filled' | 'expired' | 'verified' | 'pending' | 'rejected';
export type ApplicationSort = 'newest' | 'oldest' | 'status';

export interface OpportunityFilter {
  search?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  dateFrom?: string;
  dateTo?: string;
  experience?: string;
  skills?: string[];
  category?: string;
  educationLevel?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: ApplicationSort;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  companyId: string;
  type: OpportunityType;
  status: OpportunityStatus;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceLevel: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  tags: string[];
  applicationDeadline: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  applicationsCount: number;
  images?: string[];
  category: string;
  educationLevel: string;
}

export interface OpportunityCreate {
  title: string;
  description: string;
  type: OpportunityType;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceLevel: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  tags: string[];
  applicationDeadline: string;
  category: string;
  educationLevel: string;
  isFeatured?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type { PaginatedApiResponse } from './api';
