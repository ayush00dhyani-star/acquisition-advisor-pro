import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category, language = 'en', limit = 10 } = await req.json();
    const newsApiKey = Deno.env.get('NEWSDATA_API_KEY');

    if (!newsApiKey) {
      throw new Error('NewsData API key not configured');
    }

    console.log(`Fetching news for query: ${query}, category: ${category}`);

    // Build query params
    const params = new URLSearchParams({
      apikey: newsApiKey,
      language: language,
      size: String(limit),
    });

    if (query) {
      params.append('q', query);
    }

    if (category) {
      params.append('category', category);
    }

    // Default to business news for PE deal sourcing
    if (!query && !category) {
      params.append('category', 'business');
      params.append('q', 'acquisition OR funding OR "series a" OR "series b" OR merger OR investment');
    }

    const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsData API error:', errorText);
      throw new Error(`NewsData API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.results?.length || 0} news articles`);

    // Transform NewsData response to our format
    const news = (data.results || []).map((article: any) => ({
      id: article.article_id || crypto.randomUUID(),
      title: article.title,
      source: article.source_name || article.source_id,
      url: article.link,
      publishedDate: article.pubDate,
      description: article.description,
      content: article.content,
      imageUrl: article.image_url,
      category: article.category?.[0] || 'business',
      country: article.country?.[0] || 'unknown',
      sentimentScore: analyzeSentiment(article.title, article.description),
      aiSummary: article.description || '',
      keywords: article.keywords || [],
    }));

    return new Response(JSON.stringify({ news, nextPage: data.nextPage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in fetch-news:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeSentiment(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  
  const positiveWords = ['growth', 'success', 'profit', 'expansion', 'innovation', 'funding', 'investment', 'acquisition', 'partnership', 'launch', 'record', 'surge', 'boost', 'breakthrough'];
  const negativeWords = ['loss', 'decline', 'layoff', 'bankruptcy', 'failure', 'lawsuit', 'investigation', 'scandal', 'crash', 'downturn', 'cut', 'struggle', 'risk', 'crisis'];
  
  let score = 0.5; // Neutral
  
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 0.05;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 0.05;
  });
  
  return Math.min(1, Math.max(0, score));
}
