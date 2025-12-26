import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  description: string;
  content: string;
  imageUrl?: string;
  category: string;
  country: string;
  sentimentScore: number;
  aiSummary: string;
  keywords: string[];
}

export function useNews() {
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const { toast } = useToast();

  const fetchNews = async (query?: string, category?: string, limit = 10) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { query, category, limit },
      });

      if (error) throw error;

      setNews(data.news || []);
      return data.news;
    } catch (error: any) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Failed to load news',
        description: error.message || 'Could not fetch latest news',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyNews = async (companyName: string, limit = 5) => {
    return fetchNews(companyName, undefined, limit);
  };

  return {
    isLoading,
    news,
    fetchNews,
    fetchCompanyNews,
  };
}
