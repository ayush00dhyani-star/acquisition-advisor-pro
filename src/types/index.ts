// PE DealFlow AI Type Definitions

export interface TargetCompany {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  revenueEstimate: number;
  employeeCount: number;
  growthScore: number;
  fundingStage: string;
  lastFundingDate: string;
  aiSummary: string;
  whyFlagged: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  lastNewsDate?: string;
}

export interface PortfolioCompany {
  id: string;
  companyName: string;
  acquisitionDate: string;
  purchasePrice: number;
  currentRevenue: number;
  currentEbitda: number;
  employeeCount: number;
  lastUpdated: string;
  industry: string;
  status: 'active' | 'exited' | 'at-risk';
  revenueGrowth: number;
  ebitdaMargin: number;
}

export interface NewsMention {
  id: string;
  companyId: string;
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  sentimentScore: number;
  aiSummary: string;
}

export interface Notification {
  id: string;
  type: 'new_target' | 'portfolio_alert' | 'exit_signal' | 'news_alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetId?: string;
}

export interface DashboardMetrics {
  totalTargets: number;
  newThisWeek: number;
  highScoreTargets: number;
  portfolioValue: number;
  portfolioCompanies: number;
  avgGrowthScore: number;
  pendingAlerts: number;
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise';
  createdAt: string;
}
