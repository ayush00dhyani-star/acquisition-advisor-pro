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
    const { query, industry, limit = 10 } = await req.json();
    const newsApiKey = Deno.env.get('NEWSDATA_API_KEY');

    if (!newsApiKey) {
      throw new Error('NewsData API key not configured');
    }

    console.log(`Searching companies via news for: ${query}`);

    // Use NewsData API to find companies mentioned in business news
    const params = new URLSearchParams({
      apikey: newsApiKey,
      language: 'en',
      size: String(Math.min(limit, 10)),
      category: 'business',
    });

    if (query) {
      // Search for company-related news (funding, acquisition, etc.)
      params.append('q', `"${query}" AND (funding OR acquisition OR "series a" OR "series b" OR investment OR startup)`);
    } else {
      params.append('q', 'funding OR acquisition OR "series a" OR "series b" OR startup investment');
    }

    const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsData API error:', errorText);
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.results?.length || 0} news articles for company extraction`);

    // Extract company information from news articles
    const companiesMap = new Map<string, any>();
    
    for (const article of (data.results || [])) {
      // Extract potential company names from title and description
      const extractedCompanies = extractCompanyMentions(article);
      
      for (const company of extractedCompanies) {
        if (!companiesMap.has(company.name.toLowerCase())) {
          companiesMap.set(company.name.toLowerCase(), {
            id: crypto.randomUUID(),
            companyName: company.name,
            industry: company.industry || inferIndustry(article.category, article.title),
            website: '',
            revenueEstimate: estimateRevenue(article.title, article.description),
            employeeCount: estimateEmployees(article.title, article.description),
            growthScore: calculateNewsScore(article),
            fundingStage: extractFundingStage(article.title, article.description),
            lastFundingDate: article.pubDate,
            aiSummary: article.description || article.title,
            whyFlagged: `Mentioned in: ${article.source_name || 'News'} - ${article.title?.substring(0, 100)}...`,
            location: article.country?.[0] || 'Unknown',
            newsSource: article.source_name,
            newsUrl: article.link,
          });
        }
      }
    }

    const companies = Array.from(companiesMap.values()).slice(0, limit);
    
    // If no companies extracted, return some from keywords in articles
    if (companies.length === 0 && query) {
      companies.push({
        id: crypto.randomUUID(),
        companyName: query,
        industry: 'Technology',
        website: '',
        revenueEstimate: 0,
        employeeCount: 0,
        growthScore: 50,
        fundingStage: 'Unknown',
        lastFundingDate: null,
        aiSummary: `Search results for "${query}" - No specific funding news found. Try a different company name.`,
        whyFlagged: 'Direct search query',
        location: 'Unknown',
      });
    }

    return new Response(JSON.stringify({ 
      companies, 
      total: companies.length,
      source: 'newsdata',
      note: 'Companies extracted from recent business news and funding announcements'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in search-companies:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractCompanyMentions(article: any): Array<{name: string, industry?: string}> {
  const companies: Array<{name: string, industry?: string}> = [];
  const text = `${article.title || ''} ${article.description || ''}`;
  
  // Common patterns for company mentions in funding news
  const patterns = [
    /([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)\s+(?:raises|raised|secures|secured|announces|announced|closes|closed)\s+\$[\d.]+[MBK]?/gi,
    /([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)\s+(?:Series\s+[A-Z]|seed|funding)/gi,
    /startup\s+([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)/gi,
    /([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)?)\s+(?:valued at|valuation)/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 2 && match[1].length < 50) {
        // Filter out common words
        const commonWords = ['The', 'This', 'That', 'Series', 'Company', 'Startup', 'Report', 'News'];
        if (!commonWords.includes(match[1])) {
          companies.push({ name: match[1].trim() });
        }
      }
    }
  }
  
  return companies;
}

function inferIndustry(categories: string[] | undefined, title: string): string {
  const text = `${(categories || []).join(' ')} ${title}`.toLowerCase();
  
  if (text.includes('tech') || text.includes('software') || text.includes('saas')) return 'Technology';
  if (text.includes('health') || text.includes('medical') || text.includes('biotech')) return 'Healthcare';
  if (text.includes('fintech') || text.includes('financial') || text.includes('banking')) return 'Fintech';
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) return 'AI/ML';
  if (text.includes('crypto') || text.includes('blockchain') || text.includes('web3')) return 'Crypto/Web3';
  if (text.includes('ecommerce') || text.includes('retail')) return 'E-commerce';
  if (text.includes('education') || text.includes('edtech')) return 'EdTech';
  if (text.includes('climate') || text.includes('clean') || text.includes('energy')) return 'CleanTech';
  
  return 'Technology';
}

function estimateRevenue(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  
  // Try to extract funding amount as revenue proxy
  const fundingMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(billion|million|m|b)/i);
  if (fundingMatch) {
    const amount = parseFloat(fundingMatch[1]);
    const multiplier = fundingMatch[2].toLowerCase().startsWith('b') ? 1000000000 : 1000000;
    // Estimate revenue as ~10x funding (rough VC valuation)
    return amount * multiplier * 0.1;
  }
  
  return 5000000; // Default $5M estimate
}

function estimateEmployees(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  
  const employeeMatch = text.match(/(\d+)\s*employees/i);
  if (employeeMatch) {
    return parseInt(employeeMatch[1]);
  }
  
  // Estimate based on funding stage
  if (text.includes('series c') || text.includes('series d')) return 250;
  if (text.includes('series b')) return 100;
  if (text.includes('series a')) return 50;
  if (text.includes('seed')) return 15;
  
  return 50; // Default
}

function calculateNewsScore(article: any): number {
  let score = 50;
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  // Boost for funding mentions
  if (text.includes('series c') || text.includes('series d')) score += 25;
  else if (text.includes('series b')) score += 20;
  else if (text.includes('series a')) score += 15;
  else if (text.includes('seed')) score += 10;
  
  // Boost for large amounts
  if (text.match(/\$\d+\s*billion/i)) score += 20;
  else if (text.match(/\$\d{2,3}\s*million/i)) score += 15;
  else if (text.match(/\$\d+\s*million/i)) score += 10;
  
  // Boost for growth signals
  if (text.includes('unicorn')) score += 15;
  if (text.includes('ipo')) score += 10;
  if (text.includes('acquisition')) score += 10;
  if (text.includes('expansion')) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function extractFundingStage(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('series d') || text.includes('series e')) return 'Series D+';
  if (text.includes('series c')) return 'Series C';
  if (text.includes('series b')) return 'Series B';
  if (text.includes('series a')) return 'Series A';
  if (text.includes('seed')) return 'Seed';
  if (text.includes('pre-seed')) return 'Pre-Seed';
  if (text.includes('ipo')) return 'IPO';
  
  return 'Unknown';
}
