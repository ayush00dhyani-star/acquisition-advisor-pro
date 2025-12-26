import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScoreBadge } from '@/components/dashboard/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { mockTargets } from '@/data/mockData';
import { TargetCompany } from '@/types';
import { useNavigate } from 'react-router-dom';

type SortField = 'growthScore' | 'revenueEstimate' | 'employeeCount' | 'createdAt';
type SortDirection = 'asc' | 'desc';

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

const Targets = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('growthScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const industries = useMemo(() => {
    const unique = [...new Set(mockTargets.map((t) => t.industry))];
    return unique.sort();
  }, []);

  const filteredAndSortedTargets = useMemo(() => {
    let result = [...mockTargets];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.companyName.toLowerCase().includes(query) ||
          t.industry.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query)
      );
    }

    // Apply industry filter
    if (industryFilter !== 'all') {
      result = result.filter((t) => t.industry === industryFilter);
    }

    // Apply score filter
    if (scoreFilter !== 'all') {
      const [min, max] = scoreFilter.split('-').map(Number);
      result = result.filter((t) => t.growthScore >= min && t.growthScore <= (max || 100));
    }

    // Apply sorting
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

    return result;
  }, [searchQuery, industryFilter, scoreFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 text-muted-foreground" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-primary" />
    );
  };

  return (
    <MainLayout title="Deal Sourcing" subtitle="AI-powered acquisition target discovery">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, industries, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Score Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90-100">90-100 (Hot)</SelectItem>
              <SelectItem value="75-89">75-89 (High)</SelectItem>
              <SelectItem value="50-74">50-74 (Medium)</SelectItem>
              <SelectItem value="0-49">0-49 (Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Scanning Status */}
      <div className="flex items-center gap-3 p-4 mb-6 bg-secondary/50 rounded-lg border border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">AI Deal Sourcing Active</p>
          <p className="text-xs text-muted-foreground">
            Scanning 500+ sources • Last updated: 2 hours ago • Next scan in 4 hours
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Run Now
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredAndSortedTargets.length}</span>{' '}
          targets
        </p>
      </div>

      {/* Targets Table */}
      <div className="metric-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Industry
                </th>
                <th
                  className="text-center py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('growthScore')}
                >
                  <div className="flex items-center justify-center">
                    Score
                    <SortIcon field="growthScore" />
                  </div>
                </th>
                <th
                  className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('revenueEstimate')}
                >
                  <div className="flex items-center justify-end">
                    Revenue
                    <SortIcon field="revenueEstimate" />
                  </div>
                </th>
                <th
                  className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('employeeCount')}
                >
                  <div className="flex items-center justify-end">
                    Employees
                    <SortIcon field="employeeCount" />
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Funding
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Signal
                </th>
                <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTargets.map((target) => (
                <tr
                  key={target.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/targets/${target.id}`)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                        {target.companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{target.companyName}</p>
                        <p className="text-xs text-muted-foreground">{target.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">{target.industry}</Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ScoreBadge score={target.growthScore} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-foreground">
                      {formatCurrency(target.revenueEstimate)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-muted-foreground">
                    {target.employeeCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">{target.fundingStage}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                      {target.whyFlagged}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/targets/${target.id}`);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Targets;
