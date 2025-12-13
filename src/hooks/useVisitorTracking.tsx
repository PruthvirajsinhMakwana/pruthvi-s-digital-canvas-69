import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { error } = await supabase.from('page_views').insert({
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, []);
};

export const useVisitorStats = () => {
  const fetchStats = async () => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    // Get total views
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    // Get today's views
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
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

    return {
      totalViews: totalViews || 0,
      todayViews: todayViews || 0,
      weekViews: weekViews || 0,
      monthViews: monthViews || 0,
      pageStats,
    };
  };

  return { fetchStats };
};
