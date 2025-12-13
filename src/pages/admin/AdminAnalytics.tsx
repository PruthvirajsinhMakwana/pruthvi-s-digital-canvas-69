import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVisitorStats } from '@/hooks/useVisitorTracking';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Eye, Users, TrendingUp, Clock, Calendar, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DailyData {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface HourlyData {
  hour: string;
  views: number;
  uniqueVisitors: number;
}

interface Stats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  uniqueVisitors: number;
  todayUniqueVisitors: number;
  pageStats: Record<string, number>;
}

const AdminAnalytics = () => {
  const { fetchStats, fetchDailyStats, fetchHourlyStats } = useVisitorStats();
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, daily, hourly] = await Promise.all([
          fetchStats(),
          fetchDailyStats(30),
          fetchHourlyStats(),
        ]);
        setStats(statsData);
        setDailyData(daily);
        setHourlyData(hourly);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Views', 
      value: stats?.totalViews || 0, 
      icon: Eye, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10' 
    },
    { 
      title: 'Unique Visitors', 
      value: stats?.uniqueVisitors || 0, 
      icon: Users, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10' 
    },
    { 
      title: "Today's Views", 
      value: stats?.todayViews || 0, 
      icon: Activity, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10' 
    },
    { 
      title: "Today's Unique", 
      value: stats?.todayUniqueVisitors || 0, 
      icon: TrendingUp, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10' 
    },
    { 
      title: 'This Week', 
      value: stats?.weekViews || 0, 
      icon: Calendar, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10' 
    },
    { 
      title: 'This Month', 
      value: stats?.monthViews || 0, 
      icon: Clock, 
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10' 
    },
  ];

  const topPages = Object.entries(stats?.pageStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your website traffic and visitor insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Last 30 Days</TabsTrigger>
          <TabsTrigger value="hourly">Today's Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Line Chart - Daily Views */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Traffic Trend</CardTitle>
              <CardDescription>Page views and unique visitors over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      name="Page Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uniqueVisitors" 
                      stroke="hsl(142, 76%, 36%)" 
                      fillOpacity={1}
                      fill="url(#colorUnique)"
                      name="Unique Visitors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Daily Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Views vs Unique Visitors</CardTitle>
              <CardDescription>Compare total views with unique visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary))" name="Page Views" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="uniqueVisitors" fill="hsl(142, 76%, 36%)" name="Unique Visitors" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          {/* Hourly Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Hourly Traffic</CardTitle>
              <CardDescription>Traffic distribution throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Page Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="uniqueVisitors" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(142, 76%, 36%)' }}
                      name="Unique Visitors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hourly Distribution</CardTitle>
              <CardDescription>Peak traffic hours today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary))" name="Page Views" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Pages (Last 30 Days)</CardTitle>
          <CardDescription>Most visited pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          {topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.map(([path, count], index) => (
                <div key={path} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">{path}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No page data available yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;