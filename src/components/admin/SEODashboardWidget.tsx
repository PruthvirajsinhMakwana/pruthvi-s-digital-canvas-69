import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, RefreshCw, Globe, FileText, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface GscData {
  connected: boolean;
  site_verified?: boolean;
  last_crawl?: string;
  coverage?: string;
  verdict?: string;
  top_queries?: Array<{ query: string; clicks: number; impressions: number; position: number }>;
  error?: string;
}

interface AutoSeoLog {
  ran_at: string;
  processed: number;
  success: number;
}

export const SEODashboardWidget = () => {
  const [gsc, setGsc] = useState<GscData | null>(null);
  const [sitemap, setSitemap] = useState<{ ok: boolean; urls: number } | null>(null);
  const [autoLog, setAutoLog] = useState<AutoSeoLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    // Sitemap
    try {
      const res = await fetch('/sitemap.xml', { cache: 'no-store' });
      const text = await res.text();
      const urls = (text.match(/<loc>/g) || []).length;
      setSitemap({ ok: res.ok && urls > 0, urls });
    } catch {
      setSitemap({ ok: false, urls: 0 });
    }

    // GSC
    const { data: gscData } = await supabase.functions.invoke('gsc-status');
    setGsc(gscData as GscData);

    // Auto SEO log
    const { data: logData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'auto_seo_log')
      .maybeSingle();
    if (logData?.value) setAutoLog(logData.value as unknown as AutoSeoLog);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const runAutoSeo = async () => {
    setRunning(true);
    toast.info('Running AI SEO optimization on recent blogs...');
    const { data, error } = await supabase.functions.invoke('auto-seo-blogs');
    if (error) toast.error('Failed: ' + error.message);
    else {
      toast.success(`Optimized ${data?.success || 0} posts`);
      await load();
    }
    setRunning(false);
  };

  const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
    <Badge variant={ok ? 'default' : 'destructive'} className="gap-1">
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </Badge>
  );

  return (
    <Card className="p-6 space-y-6 border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> SEO Health Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">Live status, crawl info & automated SEO</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sitemap */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" /> Sitemap
          </div>
          {sitemap ? (
            <>
              <StatusBadge ok={sitemap.ok} label={sitemap.ok ? 'Active' : 'Missing'} />
              <p className="text-2xl font-bold">{sitemap.urls}</p>
              <p className="text-xs text-muted-foreground">indexed URLs</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Loading...</p>
          )}
        </Card>

        {/* GSC */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4" /> Search Console
          </div>
          {gsc ? (
            <>
              <StatusBadge ok={!!gsc.connected && !!gsc.site_verified} label={gsc.site_verified ? 'Verified' : gsc.connected ? 'Connected' : 'Not connected'} />
              {gsc.coverage && <p className="text-xs">Coverage: <span className="font-medium">{gsc.coverage}</span></p>}
              {gsc.last_crawl && (
                <p className="text-xs flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> Crawled {formatDistanceToNow(new Date(gsc.last_crawl), { addSuffix: true })}
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Loading...</p>
          )}
        </Card>

        {/* Auto SEO */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" /> Auto SEO (24h)
          </div>
          {autoLog ? (
            <>
              <p className="text-2xl font-bold">{autoLog.success}<span className="text-sm font-normal text-muted-foreground">/{autoLog.processed}</span></p>
              <p className="text-xs text-muted-foreground">Last run {formatDistanceToNow(new Date(autoLog.ran_at), { addSuffix: true })}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Never run</p>
          )}
          <Button size="sm" className="w-full" onClick={runAutoSeo} disabled={running}>
            {running ? <RefreshCw className="h-3 w-3 mr-2 animate-spin" /> : <Sparkles className="h-3 w-3 mr-2" />}
            Run now
          </Button>
        </Card>
      </div>

      {gsc?.top_queries && gsc.top_queries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Top Search Queries (7d)
          </h3>
          <div className="space-y-1">
            {gsc.top_queries.slice(0, 5).map((q, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded bg-muted/40">
                <span className="font-medium truncate flex-1">{q.query}</span>
                <div className="flex gap-4 text-xs text-muted-foreground tabular-nums">
                  <span>{q.clicks} clicks</span>
                  <span>{q.impressions} impr</span>
                  <span>#{q.position.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
