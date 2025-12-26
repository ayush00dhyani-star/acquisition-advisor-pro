import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  Building2,
  TrendingUp,
  Loader2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Research = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI research assistant. I can help you:\n\n• **Research companies** - Find detailed information about any company\n• **Discover targets** - \"Find SaaS companies in healthcare with $20M+ revenue\"\n• **Generate memos** - Create investment committee documents\n• **Analyze trends** - Get insights on market dynamics\n\nWhat would you like to explore today?",
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your query about "${query}", I've analyzed our database and external sources.\n\n**Key Findings:**\n\n1. **Market Overview**: The sector shows strong fundamentals with 25% YoY growth\n2. **Top Candidates**: Found 12 companies matching your criteria\n3. **Recommendation**: Focus on companies with 80+ growth scores\n\nWould you like me to generate a detailed report or explore any specific company?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const quickPrompts = [
    { label: 'Find B2B SaaS targets', icon: Building2 },
    { label: 'Generate IC memo for TechFlow', icon: FileText },
    { label: 'Analyze cybersecurity market', icon: TrendingUp },
    { label: 'Compare top 5 targets', icon: Search },
  ];

  return (
    <MainLayout title="AI Research" subtitle="Natural language company research and analysis">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col metric-card">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-primary' : 'bg-accent/20'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/20">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about companies, markets, or generate reports..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Quick Prompts
            </h3>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.label}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setQuery(prompt.label)}
                >
                  <prompt.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Capabilities</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Company research & analysis</p>
              <p>• Market trend identification</p>
              <p>• IC memo generation</p>
              <p>• Competitor analysis</p>
              <p>• Financial modeling assistance</p>
              <p>• Deal screening automation</p>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {['HealthTech M&A trends', 'CyberShield Pro analysis', 'SaaS market multiples'].map(
                (search) => (
                  <Button
                    key={search}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setQuery(search)}
                  >
                    <Search className="w-3 h-3 mr-2" />
                    {search}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Research;
