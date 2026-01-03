import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
  Globe,
  BarChart3,
  Link2,
  Search,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Site Content', href: '/admin/content', icon: Globe },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'SEO Settings', href: '/admin/seo', icon: Search },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Links Manager', href: '/admin/links', icon: Link2 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      // Verify admin role - defense in depth alongside RLS
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (roleError || !roleData) {
        toast.error('Admin access required');
        await supabase.auth.signOut();
        navigate('/');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none flex flex-col',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground text-sm sm:text-base">
              P
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-semibold text-foreground text-sm">Admin Panel</span>
              <p className="text-xs text-muted-foreground">Pruthvirajsinh</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border space-y-1 sm:space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">View Site</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Bar */}
        <header className="h-14 sm:h-16 border-b border-border flex items-center px-4 sm:px-6 gap-3 sm:gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            {location.pathname !== '/admin' && (
              <button 
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground lg:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="font-heading font-semibold text-base sm:text-lg truncate">
              {navItems.find(item => 
                location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href))
              )?.name || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;