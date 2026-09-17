export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  isVerified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  description?: string;
}

export interface Interest {
  id: string;
  category: string;
  subcategory: string;
  skill?: string;
  level?: string;
}

export interface SeekerProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  skills: Skill[];
  education: Education[];
  interests: Interest[];
  workExperience?: WorkExperience[];
  languages?: Language[];
  certifications?: Certification[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  avatar?: string;
  profileVisibility?: 'PUBLIC' | 'ORGANIZATIONS_ONLY' | 'PRIVATE';
  notificationPreference?: 'ALL' | 'IMPORTANT_ONLY' | 'NONE';
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface OrganizationProfile {
  id: string;
  userId: string;
  organizationName: string;
  slug: string;
  description: string;
  mission: string;
  websiteUrl?: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  logo?: string;
  coverImage?: string;
  location: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocumentUrl?: string;
  verifiedAt?: string;
  phone?: string;
  socialLinks?: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ProfileUpdateData {
  headline?: string;
  summary?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

export interface OrganizationUpdateData {
  organizationName?: string;
  description?: string;
  mission?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  location?: string;
  phone?: string;
  websiteUrl?: string;
}
