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

interface SitemapSubmitLog {
  ran_at: string;
  success: boolean;
  status?: number;
  url_count?: number;
  last_submitted?: string;
  last_downloaded?: string;
  is_pending?: boolean;
  error?: string;
}

export const SEODashboardWidget = () => {
  const [gsc, setGsc] = useState<GscData | null>(null);
  const [sitemap, setSitemap] = useState<{ ok: boolean; urls: number } | null>(null);
  const [autoLog, setAutoLog] = useState<AutoSeoLog | null>(null);
  const [submitLog, setSubmitLog] = useState<SitemapSubmitLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    // Sitemap submit log
    const { data: subData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'sitemap_submit_log')
      .maybeSingle();
    if (subData?.value) setSubmitLog(subData.value as unknown as SitemapSubmitLog);

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

  const submitSitemap = async () => {
    setSubmitting(true);
    toast.info('Submitting sitemap to Google Search Console...');
    const { data, error } = await supabase.functions.invoke('submit-sitemap-gsc');
    if (error) toast.error('Failed: ' + error.message);
    else if (data?.success) toast.success('Sitemap submitted to GSC');
    else toast.error('GSC rejected sitemap: ' + (data?.error || 'unknown'));
    await load();
    setSubmitting(false);
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

      {/* Sitemap submission to GSC */}
      <Card className="p-4 space-y-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4" /> Daily Sitemap Submission to GSC
          </div>
          {submitLog && (
            <StatusBadge ok={!!submitLog.success} label={submitLog.success ? 'Submitted' : 'Failed'} />
          )}
        </div>
        {submitLog ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Last run</p>
              <p className="font-medium">{formatDistanceToNow(new Date(submitLog.ran_at), { addSuffix: true })}</p>
            </div>
            <div>
              <p className="text-muted-foreground">URLs</p>
              <p className="font-medium">{submitLog.url_count ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last submitted</p>
              <p className="font-medium">{submitLog.last_submitted ? formatDistanceToNow(new Date(submitLog.last_submitted), { addSuffix: true }) : '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last downloaded</p>
              <p className="font-medium">{submitLog.last_downloaded ? formatDistanceToNow(new Date(submitLog.last_downloaded), { addSuffix: true }) : '—'}</p>
            </div>
            {submitLog.error && (
              <p className="col-span-full text-destructive break-words">Error: {submitLog.error}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No submissions yet. Runs daily at 03:15 UTC.</p>
        )}
        <Button size="sm" variant="outline" onClick={submitSitemap} disabled={submitting}>
          {submitting ? <RefreshCw className="h-3 w-3 mr-2 animate-spin" /> : <Globe className="h-3 w-3 mr-2" />}
          Submit sitemap now
        </Button>
      </Card>

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
