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
    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');

    if (!apolloApiKey) {
      throw new Error('Apollo API key not configured');
    }

    console.log(`Searching companies with query: ${query}, industry: ${industry}`);

    // Search for companies using Apollo API
    const response = await fetch('https://api.apollo.io/v1/mixed_companies/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apolloApiKey,
      },
      body: JSON.stringify({
        q_organization_name: query || undefined,
        organization_industry_tag_ids: industry ? [industry] : undefined,
        per_page: limit,
        page: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apollo API error:', errorText);
      throw new Error(`Apollo API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.organizations?.length || 0} companies`);

    // Transform Apollo data to our format
    const companies = (data.organizations || []).map((org: any) => ({
      id: org.id,
      companyName: org.name,
      industry: org.industry || 'Unknown',
      website: org.website_url || '',
      revenueEstimate: parseRevenueString(org.estimated_num_employees),
      employeeCount: org.estimated_num_employees || 0,
      growthScore: calculateGrowthScore(org),
      fundingStage: org.funding_stage || 'Unknown',
      lastFundingDate: org.last_funding_at || null,
      aiSummary: org.short_description || '',
      whyFlagged: generateWhyFlagged(org),
      location: `${org.city || ''}, ${org.state || ''}, ${org.country || ''}`.replace(/^, |, $/g, ''),
      logoUrl: org.logo_url,
      linkedinUrl: org.linkedin_url,
      twitterUrl: org.twitter_url,
      foundedYear: org.founded_year,
    }));

    return new Response(JSON.stringify({ companies, total: data.pagination?.total_entries || 0 }), {
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

function parseRevenueString(employees: number): number {
  // Estimate revenue based on employee count (rough B2B SaaS estimate)
  if (!employees) return 0;
  return employees * 150000; // ~$150k revenue per employee average
}

function calculateGrowthScore(org: any): number {
  let score = 50; // Base score
  
  // Boost for recent funding
  if (org.last_funding_at) {
    const fundingDate = new Date(org.last_funding_at);
    const monthsAgo = (Date.now() - fundingDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo < 6) score += 20;
    else if (monthsAgo < 12) score += 15;
    else if (monthsAgo < 24) score += 10;
  }
  
  // Boost for employee count (scale indicator)
  if (org.estimated_num_employees > 500) score += 10;
  else if (org.estimated_num_employees > 100) score += 5;
  
  // Boost for later funding stages
  const stage = org.funding_stage?.toLowerCase() || '';
  if (stage.includes('series c') || stage.includes('series d')) score += 15;
  else if (stage.includes('series b')) score += 10;
  else if (stage.includes('series a')) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function generateWhyFlagged(org: any): string {
  const reasons = [];
  
  if (org.last_funding_at) {
    const fundingDate = new Date(org.last_funding_at);
    const monthsAgo = Math.floor((Date.now() - fundingDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (monthsAgo < 12) {
      reasons.push(`Recent funding activity (${monthsAgo} months ago)`);
    }
  }
  
  if (org.estimated_num_employees > 100) {
    reasons.push(`Significant scale (${org.estimated_num_employees} employees)`);
  }
  
  if (org.funding_stage) {
    reasons.push(`${org.funding_stage} stage company`);
  }
  
  return reasons.length > 0 ? reasons.join('. ') : 'Matches search criteria';
}
