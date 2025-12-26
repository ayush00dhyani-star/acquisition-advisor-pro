import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  Building2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockPortfolio, revenueChartData } from '@/data/mockData';
import { PortfolioCompany } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function PortfolioCard({ company }: { company: PortfolioCompany }) {
  const statusConfig = {
    active: {
      color: 'bg-primary/20 text-primary border-primary/30',
      icon: CheckCircle2,
      label: 'Active',
    },
    'at-risk': {
      color: 'bg-destructive/20 text-destructive border-destructive/30',
      icon: AlertTriangle,
      label: 'At Risk',
    },
    exited: {
      color: 'bg-muted text-muted-foreground border-muted',
      icon: ArrowUpRight,
      label: 'Exited',
    },
  };

  const status = statusConfig[company.status];
  const StatusIcon = status.icon;

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-foreground">
            {company.companyName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{company.companyName}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={status.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Update Metrics</DropdownMenuItem>
              <DropdownMenuItem>Generate Report</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">Current Revenue</p>
          <p className="text-xl font-bold text-foreground font-mono">
            {formatCurrency(company.currentRevenue)}
          </p>
          <p
            className={`text-xs flex items-center gap-1 mt-1 ${
              company.revenueGrowth >= 0 ? 'text-primary' : 'text-destructive'
            }`}
          >
            {company.revenueGrowth >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {company.revenueGrowth >= 0 ? '+' : ''}
            {company.revenueGrowth}% YoY
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase mb-1">EBITDA</p>
          <p className="text-xl font-bold text-foreground font-mono">
            {formatCurrency(company.currentEbitda)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{company.ebitdaMargin}% margin</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {company.employeeCount}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Acquired {new Date(company.acquisitionDate).getFullYear()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Entry: {formatCurrency(company.purchasePrice)}
        </p>
      </div>
    </div>
  );
}

const Portfolio = () => {
  const totalValue = mockPortfolio.reduce((sum, c) => sum + c.currentRevenue * 5, 0); // Rough enterprise value estimate
  const totalRevenue = mockPortfolio.reduce((sum, c) => sum + c.currentRevenue, 0);
  const totalEbitda = mockPortfolio.reduce((sum, c) => sum + c.currentEbitda, 0);
  const avgGrowth =
    mockPortfolio.reduce((sum, c) => sum + c.revenueGrowth, 0) / mockPortfolio.length;

  return (
    <MainLayout title="Portfolio" subtitle="Monitor your portfolio company performance">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs uppercase">Portfolio Companies</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{mockPortfolio.length}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs uppercase">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs uppercase">Total EBITDA</span>
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">
            {formatCurrency(totalEbitda)}
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase">Avg. Growth</span>
          </div>
          <p className="text-3xl font-bold text-primary">+{avgGrowth.toFixed(1)}%</p>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="metric-card mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v}M`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 47%, 18%)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockPortfolio.map((company) => (
          <PortfolioCard key={company.id} company={company} />
        ))}
      </div>
    </MainLayout>
  );
};

export default Portfolio;
