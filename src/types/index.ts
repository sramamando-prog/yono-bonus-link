export type AppType = 
  | 'Earning App'
  | 'Reward App'
  | 'Gaming App'
  | 'Rummy / Real-Money Gaming'
  | 'Other';

export interface AppItem {
  id?: string;
  name: string;
  slug: string;
  logoUrl: string;
  imageUrl?: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  appType: AppType;
  bonusText?: string;
  howItWorks?: string;
  officialUrl: string;
  telegramUrl?: string;
  status: 'draft' | 'live';
  isNew: boolean;
  isFeatured: boolean;
  ageNotice?: string;
  legalNotice?: string;
  displayOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
  createdAt: number;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  telegramUrl?: string;
  contactEmail?: string;
  responsibleGamingNotice?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  updatedAt?: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read?: boolean;
}
