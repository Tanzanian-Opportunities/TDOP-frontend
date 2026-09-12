export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  seekerId: string;
  seekerName: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  status: ApplicationStatus;
  changedAt: string;
  note?: string;
}

export interface ApplicationCreate {
  opportunityId: string;
  coverLetter?: string;
  resumeUrl: string;
}

export interface ApplicationUpdate {
  status?: ApplicationStatus;
  note?: string;
}

export interface ApplicationsList {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}
