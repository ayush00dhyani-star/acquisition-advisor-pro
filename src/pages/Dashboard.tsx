import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TopTargetsTable } from '@/components/dashboard/TopTargetsTable';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RevenueChart, IndustryChart, ScoreDistributionChart } from '@/components/dashboard/Charts';
import {
  Target,
  TrendingUp,
  Briefcase,
  DollarSign,
  Zap,
  Bell,
  BarChart3,
} from 'lucide-react';
import {
  mockTargets,
  mockNotifications,
  mockDashboardMetrics,
  revenueChartData,
  industryDistribution,
  scoreDistribution,
} from '@/data/mockData';

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  }
  return `$${value}`;
}

const Dashboard = () => {
  const metrics = mockDashboardMetrics;

  return (
    <MainLayout title="Dashboard" subtitle="AI-Powered Deal Intelligence">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Targets"
          value={metrics.totalTargets}
          change={`+${metrics.newThisWeek} this week`}
          changeType="positive"
          icon={Target}
        />
        <MetricCard
          title="High-Score Targets"
          value={metrics.highScoreTargets}
          change="Score ≥ 75"
          changeType="neutral"
          icon={Zap}
          iconColor="bg-warning/10"
        />
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(metrics.portfolioValue)}
          change="+12.4% YTD"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Avg. Score"
          value={metrics.avgGrowthScore}
          change="↑ 3 pts vs last month"
          changeType="positive"
          icon={BarChart3}
          iconColor="bg-accent/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Table */}
        <div className="lg:col-span-2 space-y-6">
          <TopTargetsTable targets={mockTargets} />
          <RevenueChart data={revenueChartData} />
        </div>

        {/* Right Column - Activity & Distribution */}
        <div className="space-y-6">
          <RecentActivity notifications={mockNotifications} />
          <IndustryChart data={industryDistribution} />
          <ScoreDistributionChart data={scoreDistribution} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
