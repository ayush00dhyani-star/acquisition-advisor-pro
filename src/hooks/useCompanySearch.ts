import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SearchedCompany {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  revenueEstimate: number;
  employeeCount: number;
  growthScore: number;
  fundingStage: string;
  lastFundingDate: string | null;
  aiSummary: string;
  whyFlagged: string;
  location: string;
  logoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  foundedYear?: number;
}

export function useCompanySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<SearchedCompany[]>([]);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const searchCompanies = async (query: string, industry?: string, limit = 10) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-companies', {
        body: { query, industry, limit },
      });

      if (error) throw error;

      setCompanies(data.companies || []);
      setTotal(data.total || 0);
      return data.companies;
    } catch (error: any) {
      console.error('Error searching companies:', error);
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search companies',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    companies,
    total,
    searchCompanies,
  };
}
