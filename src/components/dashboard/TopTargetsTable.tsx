import { TargetCompany } from '@/types';
import { ScoreBadge } from './ScoreBadge';
import { ExternalLink, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TopTargetsTableProps {
  targets: TargetCompany[];
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function TopTargetsTable({ targets }: TopTargetsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Acquisition Targets</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/targets')}>
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Company
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Industry
              </th>
              <th className="text-center py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Score
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Revenue
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Employees
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Signal
              </th>
            </tr>
          </thead>
          <tbody>
            {targets.slice(0, 8).map((target, index) => (
              <tr
                key={target.id}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/targets/${target.id}`)}
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                      {target.companyName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{target.companyName}</p>
                      <p className="text-xs text-muted-foreground">{target.location}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-muted-foreground">{target.industry}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <ScoreBadge score={target.growthScore} size="sm" />
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm font-mono text-foreground">
                    {formatCurrency(target.revenueEstimate)}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-muted-foreground">{target.employeeCount}</span>
                </td>
                <td className="py-3 px-2">
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                    {target.whyFlagged}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
