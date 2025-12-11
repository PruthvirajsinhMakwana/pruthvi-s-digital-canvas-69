import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, MessageSquare, Eye, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      color: 'from-primary to-secondary',
      href: '/admin/blog'
    },
    { 
      label: 'Published', 
      value: stats.publishedPosts, 
      icon: Eye, 
      color: 'from-secondary to-accent',
      href: '/admin/blog'
    },
    { 
      label: 'Total Messages', 
      value: stats.totalMessages, 
      icon: MessageSquare, 
      color: 'from-accent to-primary',
      href: '/admin/messages'
    },
    { 
      label: 'Unread', 
      value: stats.unreadMessages, 
      icon: TrendingUp, 
      color: 'from-primary to-neon-blue',
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6 neon-border">
        <h2 className="font-heading text-2xl font-bold mb-2">Welcome to Admin Panel</h2>
        <p className="text-muted-foreground">Manage your portfolio, blog posts, and messages from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.href}
            className="glass-card rounded-2xl p-6 hover:neon-glow transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold gradient-text">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create New Post */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/blog/new">
              <Button variant="hero" className="w-full justify-start">
                <Plus className="w-5 h-5 mr-2" />
                Create New Blog Post
              </Button>
            </Link>
            <Link to="/admin/messages">
              <Button variant="glass" className="w-full justify-start">
                <MessageSquare className="w-5 h-5 mr-2" />
                View Messages {stats.unreadMessages > 0 && `(${stats.unreadMessages} new)`}
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading text-xl font-bold mb-4">Recent Messages</h3>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.slice(0, 3).map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "p-3 rounded-xl bg-muted/50 border border-border/50",
                    !message.is_read && "border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{message.name}</span>
                    {!message.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
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

// Helper function
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default AdminDashboard;
