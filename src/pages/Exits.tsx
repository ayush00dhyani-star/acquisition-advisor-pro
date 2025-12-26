import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPortfolio } from '@/data/mockData';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Users,
} from 'lucide-react';
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

const valuationData = [
  { month: 'Jan', value: 180 },
  { month: 'Feb', value: 195 },
  { month: 'Mar', value: 210 },
  { month: 'Apr', value: 225 },
  { month: 'May', value: 240 },
  { month: 'Jun', value: 265 },
  { month: 'Jul', value: 280 },
  { month: 'Aug', value: 295 },
  { month: 'Sep', value: 310 },
  { month: 'Oct', value: 325 },
  { month: 'Nov', value: 340 },
  { month: 'Dec', value: 360 },
];

const exitCandidates = mockPortfolio.filter((c) => c.status === 'active' && c.revenueGrowth > 20);

const Exits = () => {
  return (
    <MainLayout title="Exit Optimizer" subtitle="Maximize returns with AI-powered exit timing">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase">Exit-Ready</span>
          </div>
          <p className="text-3xl font-bold text-primary">{exitCandidates.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Companies in optimal window</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs uppercase">Est. Exit Value</span>
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">$1.2B</p>
          <p className="text-xs text-primary mt-1">+45% vs entry</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs uppercase">Avg. Multiple</span>
          </div>
          <p className="text-3xl font-bold text-foreground">2.8x</p>
          <p className="text-xs text-muted-foreground mt-1">MOIC across portfolio</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase">Active Buyers</span>
          </div>
          <p className="text-3xl font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground mt-1">Matched strategic buyers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Valuation Chart */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio Valuation Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={valuationData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}M`}
                  />
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
                    dataKey="value"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Valuation"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exit Candidates */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Exit Candidates</h3>
              <Badge variant="secondary">{exitCandidates.length} companies</Badge>
            </div>
            <div className="space-y-4">
              {exitCandidates.map((company) => (
                <div
                  key={company.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-foreground">
                        {company.companyName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{company.companyName}</h4>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Exit Ready
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Entry Price</p>
                      <p className="font-mono text-foreground">
                        {formatCurrency(company.purchasePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Value</p>
                      <p className="font-mono text-primary">
                        {formatCurrency(company.purchasePrice * 2.5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MOIC</p>
                      <p className="font-bold text-foreground">2.5x</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="gap-2">
                      <ArrowUpRight className="w-4 h-4" />
                      View Buyers
                    </Button>
                    <Button variant="outline" size="sm">
                      Generate CIM
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Conditions */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Conditions</h3>
            <div className="space-y-4">
              {[
                { label: 'M&A Activity', status: 'High', color: 'text-primary' },
                { label: 'Valuations', status: 'Elevated', color: 'text-warning' },
                { label: 'Buyer Appetite', status: 'Strong', color: 'text-primary' },
                { label: 'Interest Rates', status: 'Stabilizing', color: 'text-muted-foreground' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">AI Recommendation</p>
              <p className="text-xs text-muted-foreground mt-1">
                Current market conditions favor exits. Consider accelerating timeline for top performers.
              </p>
            </div>
          </div>

          {/* Top Matched Buyers */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Matched Buyers</h3>
            <div className="space-y-3">
              {[
                { name: 'Vista Equity', type: 'PE', match: 94 },
                { name: 'Thoma Bravo', type: 'PE', match: 91 },
                { name: 'Microsoft', type: 'Strategic', match: 88 },
                { name: 'Salesforce', type: 'Strategic', match: 85 },
                { name: 'Silver Lake', type: 'PE', match: 82 },
              ].map((buyer) => (
                <div
                  key={buyer.name}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{buyer.name}</p>
                    <p className="text-xs text-muted-foreground">{buyer.type}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      buyer.match >= 90
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-secondary text-foreground'
                    }
                  >
                    {buyer.match}% match
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Exit Timeline */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Optimal Exit Window</h3>
            <div className="space-y-3">
              {[
                { label: 'Q1 2025', status: 'optimal', desc: 'Best market conditions' },
                { label: 'Q2 2025', status: 'good', desc: 'Strong buyer activity' },
                { label: 'Q3 2025', status: 'moderate', desc: 'Seasonal slowdown' },
                { label: 'Q4 2025', status: 'uncertain', desc: 'Election uncertainty' },
              ].map((window) => (
                <div key={window.label} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      window.status === 'optimal'
                        ? 'bg-primary'
                        : window.status === 'good'
                        ? 'bg-accent'
                        : window.status === 'moderate'
                        ? 'bg-warning'
                        : 'bg-muted-foreground'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{window.label}</p>
                    <p className="text-xs text-muted-foreground">{window.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Exits;
