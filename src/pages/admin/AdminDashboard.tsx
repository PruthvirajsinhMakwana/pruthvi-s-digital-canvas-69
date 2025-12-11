import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, MessageSquare, Eye, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  totalMessages: number;
  unreadMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalMessages: 0,
    unreadMessages: 0,
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
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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

      {/* Stats Grid */}
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

      {/* Quick Actions & Recent Messages */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
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
      </div>
    </div>
  );
};

export default AdminDashboard;