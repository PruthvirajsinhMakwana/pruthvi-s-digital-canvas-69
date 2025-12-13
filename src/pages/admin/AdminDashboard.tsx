import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, MessageSquare, Eye, TrendingUp, Plus, Users, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  totalMessages: number;
  unreadMessages: number;
}

interface VisitorStats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  pageStats: Record<string, number>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    pageStats: {},
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog posts count
        const { count: totalPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        const { count: publishedPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Fetch messages count
        const { count: totalMessages } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        const { count: unreadMessages } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        // Fetch recent messages
        const { data: messages } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          totalMessages: totalMessages || 0,
          unreadMessages: unreadMessages || 0,
        });

        setRecentMessages(messages || []);

        // Fetch visitor stats
        await fetchVisitorStats();
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fetchVisitorStats = async () => {
    try {
      const today = new Date();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);

      // Get total views
      const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Get today's views
      const { count: todayViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      // Get views in last 7 days
      const { count: weekViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', last7Days.toISOString());

      // Get views in last 30 days
      const { count: monthViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', last30Days.toISOString());

      // Get page-wise breakdown
      const { data: pageBreakdown } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', last30Days.toISOString());

      const pageStats: Record<string, number> = {};
      pageBreakdown?.forEach((view) => {
        pageStats[view.page_path] = (pageStats[view.page_path] || 0) + 1;
      });

      setVisitorStats({
        totalViews: totalViews || 0,
        todayViews: todayViews || 0,
        weekViews: weekViews || 0,
        monthViews: monthViews || 0,
        pageStats,
      });
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
    }
  };

  const statCards = [
    { 
      label: 'Total Posts', 
      value: stats.totalPosts, 
      icon: FileText, 
      color: 'bg-blue-500',
      href: '/admin/blog'
    },
    { 
      label: 'Published', 
      value: stats.publishedPosts, 
      icon: Eye, 
      color: 'bg-green-500',
      href: '/admin/blog'
    },
    { 
      label: 'Messages', 
      value: stats.totalMessages, 
      icon: MessageSquare, 
      color: 'bg-purple-500',
      href: '/admin/messages'
    },
    { 
      label: 'Unread', 
      value: stats.unreadMessages, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      href: '/admin/messages'
    },
  ];

  const visitorCards = [
    { 
      label: 'Total Views', 
      value: visitorStats.totalViews, 
      icon: Users, 
      color: 'bg-cyan-500',
    },
    { 
      label: 'Today', 
      value: visitorStats.todayViews, 
      icon: Calendar, 
      color: 'bg-emerald-500',
    },
    { 
      label: 'This Week', 
      value: visitorStats.weekViews, 
      icon: BarChart3, 
      color: 'bg-pink-500',
    },
    { 
      label: 'This Month', 
      value: visitorStats.monthViews, 
      icon: TrendingUp, 
      color: 'bg-amber-500',
    },
  ];

  // Get top pages sorted by views
  const topPages = Object.entries(visitorStats.pageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="font-heading text-xl sm:text-2xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your portfolio, blog posts, and messages from here.</p>
      </div>

      {/* Content Stats Grid */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-3 text-muted-foreground">Content Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.href}
              className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Visitor Stats Grid */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-3 text-muted-foreground">Visitor Statistics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {visitorCards.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-bold text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions, Recent Messages & Top Pages */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/blog/new" className="block">
              <Button className="w-full justify-start h-11 sm:h-12">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create New Blog Post
              </Button>
            </Link>
            <Link to="/admin/messages" className="block">
              <Button variant="outline" className="w-full justify-start h-11 sm:h-12">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                View Messages {stats.unreadMessages > 0 && `(${stats.unreadMessages} new)`}
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-4">Recent Messages</h3>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.slice(0, 3).map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "p-3 rounded-lg sm:rounded-xl bg-muted/50 border",
                    !message.is_read ? "border-primary/50" : "border-border/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate mr-2">{message.name}</span>
                    {!message.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{message.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No messages yet.</p>
          )}
        </div>

        {/* Top Pages */}
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-4">Top Pages (30 days)</h3>
          {topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.map(([page, views], index) => (
                <div 
                  key={page} 
                  className="flex items-center justify-between p-3 rounded-lg sm:rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm truncate max-w-[120px]">{page === '/' ? 'Home' : page}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No page views yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
