import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a unique visitor ID using localStorage
const getVisitorId = (): string => {
  const storageKey = 'visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        
        const { error } = await supabase.from('page_views').insert({
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          visitor_ip: visitorId, // Using visitor_ip field for unique visitor ID
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

    // Get unique visitors
    const { data: uniqueData } = await supabase
      .from('page_views')
      .select('visitor_ip')
      .not('visitor_ip', 'is', null);
    
    const uniqueVisitors = new Set(uniqueData?.map(v => v.visitor_ip)).size;

    // Get today's unique visitors
    const { data: todayUniqueData } = await supabase
      .from('page_views')
      .select('visitor_ip')
      .gte('created_at', todayStart.toISOString())
      .not('visitor_ip', 'is', null);
    
    const todayUniqueVisitors = new Set(todayUniqueData?.map(v => v.visitor_ip)).size;

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
      uniqueVisitors,
      todayUniqueVisitors,
      pageStats,
    };
  };

  const fetchDailyStats = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('page_views')
      .select('created_at, visitor_ip')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const dailyData: Record<string, { views: number; uniqueVisitors: Set<string> }> = {};
    
    data?.forEach((view) => {
      const date = new Date(view.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyData[date]) {
        dailyData[date] = { views: 0, uniqueVisitors: new Set() };
      }
      dailyData[date].views++;
      if (view.visitor_ip) {
        dailyData[date].uniqueVisitors.add(view.visitor_ip);
      }
    });

    return Object.entries(dailyData).map(([date, stats]) => ({
      date,
      views: stats.views,
      uniqueVisitors: stats.uniqueVisitors.size,
    }));
  };

  const fetchHourlyStats = async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('page_views')
      .select('created_at, visitor_ip')
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: true });

    // Group by hour
    const hourlyData: Record<number, { views: number; uniqueVisitors: Set<string> }> = {};
    
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { views: 0, uniqueVisitors: new Set() };
    }

    data?.forEach((view) => {
      const hour = new Date(view.created_at).getHours();
      hourlyData[hour].views++;
      if (view.visitor_ip) {
        hourlyData[hour].uniqueVisitors.add(view.visitor_ip);
      }
    });

    return Object.entries(hourlyData).map(([hour, stats]) => ({
      hour: `${hour}:00`,
      views: stats.views,
      uniqueVisitors: stats.uniqueVisitors.size,
    }));
  };

  return { fetchStats, fetchDailyStats, fetchHourlyStats };
};
