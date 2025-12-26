import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScoreBadge } from '@/components/dashboard/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Newspaper,
  FileText,
  Star,
  Bookmark,
  Share2,
  AlertCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { mockTargets, mockNews } from '@/data/mockData';

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

const TargetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const target = mockTargets.find((t) => t.id === id);
  const companyNews = mockNews.filter((n) => n.companyId === id);

  if (!target) {
    return (
      <MainLayout title="Target Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Target not found</h2>
          <p className="text-muted-foreground mb-4">The company you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/targets')}>Back to Targets</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={target.companyName} subtitle={target.industry}>
      {/* Back Button */}
      <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate('/targets')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Targets
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Header Card */}
          <div className="metric-card">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-2xl font-bold text-foreground">
                  {target.companyName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{target.companyName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{target.industry}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {target.location}
                    </span>
                  </div>
                </div>
              </div>
              <ScoreBadge score={target.growthScore} size="lg" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs uppercase">Revenue Est.</span>
                </div>
                <p className="text-xl font-bold text-foreground font-mono">
                  {formatCurrency(target.revenueEstimate)}
                </p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs uppercase">Employees</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {target.employeeCount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs uppercase">Funding</span>
                </div>
                <p className="text-xl font-bold text-foreground">{target.fundingStage}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase">Last Funding</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {new Date(target.lastFundingDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                Visit Website
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          <div className="metric-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI Investment Thesis</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{target.aiSummary}</p>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Why This Company Was Flagged</h4>
              <p className="text-sm text-muted-foreground">{target.whyFlagged}</p>
            </div>
          </div>

          {/* News Mentions */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Newspaper className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Recent News</h3>
              </div>
              <Badge variant="secondary">{companyNews.length} mentions</Badge>
            </div>
            <div className="space-y-4">
              {companyNews.length > 0 ? (
                companyNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{news.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{news.aiSummary}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>
                            {new Date(news.publishedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={news.sentimentScore > 0.7 ? 'default' : 'secondary'}
                        className={news.sentimentScore > 0.7 ? 'bg-primary/20 text-primary' : ''}
                      >
                        {news.sentimentScore > 0.7 ? 'Positive' : 'Neutral'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent news mentions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Growth Trajectory', score: 92, max: 100 },
                { label: 'Market Position', score: 88, max: 100 },
                { label: 'Financial Health', score: 85, max: 100 },
                { label: 'Strategic Fit', score: 90, max: 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.score}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Generate IC Memo
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="w-4 h-4" />
                Add to Pipeline
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" />
                Find Similar Companies
              </Button>
            </div>
          </div>

          {/* Investment Checklist */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Due Diligence Checklist</h3>
            <div className="space-y-3">
              {[
                { label: 'Initial Screening', completed: true },
                { label: 'Financial Review', completed: true },
                { label: 'Management Meeting', completed: false },
                { label: 'Market Analysis', completed: false },
                { label: 'Legal Review', completed: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span
                    className={
                      item.completed ? 'text-foreground' : 'text-muted-foreground'
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TargetDetail;
