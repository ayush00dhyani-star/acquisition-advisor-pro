import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Building2,
  Bell,
  Key,
  Palette,
  Shield,
  Webhook,
  Mail,
  Slack,
  Target,
  DollarSign,
  Globe,
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    highScoreAlerts: true,
    portfolioAlerts: true,
    weeklyDigest: true,
    exitSignals: false,
  });

  return (
    <MainLayout title="Settings" subtitle="Configure your DealFlow AI preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="investment" className="gap-2">
            <Target className="w-4 h-4" />
            Investment Thesis
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Webhook className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="metric-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@peventures.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="partner">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="associate">Associate</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            </div>

            <div className="metric-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Firm Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input id="firmName" defaultValue="PE Ventures Capital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aum">AUM</Label>
                  <Select defaultValue="500m-1b">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<100m">&lt; $100M</SelectItem>
                      <SelectItem value="100-500m">$100M - $500M</SelectItem>
                      <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                      <SelectItem value="1-5b">$1B - $5B</SelectItem>
                      <SelectItem value=">5b">&gt; $5B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subscription</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary">Enterprise</Badge>
                    <span className="text-sm text-muted-foreground">$15,000/month</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Investment Thesis */}
        <TabsContent value="investment">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Investment Criteria
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configure your investment thesis to improve AI-powered deal recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Industries</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Enterprise SaaS', 'FinTech', 'Healthcare Tech', 'Cybersecurity'].map(
                      (industry) => (
                        <Badge key={industry} variant="secondary" className="cursor-pointer">
                          {industry} ×
                        </Badge>
                      )
                    )}
                    <Button variant="outline" size="sm">
                      + Add
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Revenue Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Min</span>
                      <Input defaultValue="$10M" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Max</span>
                      <Input defaultValue="$100M" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deal Size Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Min</span>
                      <Input defaultValue="$50M" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Max</span>
                      <Input defaultValue="$500M" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Geographic Focus</Label>
                  <div className="flex flex-wrap gap-2">
                    {['North America', 'Europe'].map((geo) => (
                      <Badge key={geo} variant="secondary" className="cursor-pointer">
                        {geo} ×
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      + Add
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Growth Rate</Label>
                  <Select defaultValue="20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% YoY</SelectItem>
                      <SelectItem value="20">20% YoY</SelectItem>
                      <SelectItem value="30">30% YoY</SelectItem>
                      <SelectItem value="50">50% YoY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Funding Stages</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Series B', 'Series C', 'Series D'].map((stage) => (
                      <Badge key={stage} variant="secondary" className="cursor-pointer">
                        {stage} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <Button>Save Investment Thesis</Button>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Channels</h4>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">john@peventures.com</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Slack className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Slack Notifications</p>
                      <p className="text-sm text-muted-foreground">#dealflow-alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.slack}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, slack: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Alert Types</h4>
                {[
                  {
                    key: 'highScoreAlerts',
                    title: 'High-Score Target Alerts',
                    desc: 'Notify when a target scores 75+',
                  },
                  {
                    key: 'portfolioAlerts',
                    title: 'Portfolio Alerts',
                    desc: 'Performance warnings and updates',
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Digest',
                    desc: 'Summary of top targets each week',
                  },
                  {
                    key: 'exitSignals',
                    title: 'Exit Signals',
                    desc: 'Market timing and buyer matching alerts',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Slack', desc: 'Send alerts to Slack channels', connected: true, icon: '💬' },
              { name: 'Salesforce', desc: 'Sync deals to your CRM', connected: false, icon: '☁️' },
              { name: 'HubSpot', desc: 'Marketing and sales sync', connected: false, icon: '🔶' },
              { name: 'Airtable', desc: 'Spreadsheet integrations', connected: true, icon: '📊' },
              { name: 'Notion', desc: 'Knowledge base sync', connected: false, icon: '📝' },
              { name: 'Zapier', desc: 'Connect to 5000+ apps', connected: false, icon: '⚡' },
            ].map((integration) => (
              <div key={integration.name} className="metric-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.desc}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant={integration.connected ? 'outline' : 'default'}
                  className="w-full"
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Access
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Use API keys to integrate DealFlow AI with your internal systems.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">Production API Key</p>
                  <Badge>Active</Badge>
                </div>
                <code className="text-sm text-muted-foreground font-mono">
                  sk-prod-••••••••••••••••••••
                </code>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">Test API Key</p>
                  <Badge variant="secondary">Test Mode</Badge>
                </div>
                <code className="text-sm text-muted-foreground font-mono">
                  sk-test-••••••••••••••••••••
                </code>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Rate Limits</h4>
              <p className="text-sm text-muted-foreground">
                Your Enterprise plan includes 10,000 API requests per day.
              </p>
              <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/4" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">2,450 / 10,000 requests today</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
