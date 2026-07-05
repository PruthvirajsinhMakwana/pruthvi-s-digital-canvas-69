import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ArrowLeft, Tag, User, Clock, Share2, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/lib/sanitize';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_categories (name, slug)
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          navigate('/blog');
          return;
        }
        
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, navigate]);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    // Strip HTML tags for accurate word count
    const strippedContent = content?.replace(/<[^>]*>/g, '') || '';
    const words = strippedContent.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} - Pruthvirajsinh Makwana</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <link rel="canonical" href={`https://pruthvirajsinh.in/blog/${post.slug}`} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ''} />
        <meta property="og:url" content={`https://pruthvirajsinh.in/blog/${post.slug}`} />
        <meta property="og:image" content={post.featured_image || 'https://pruthvirajsinh.in/favicon.jpg'} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.meta_description || post.excerpt || '',
            image: post.featured_image || 'https://pruthvirajsinh.in/favicon.jpg',
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: {
              '@type': 'Person',
              name: 'Pruthvirajsinh Makwana',
              url: 'https://pruthvirajsinh.in/',
            },
            publisher: {
              '@type': 'Person',
              name: 'Pruthvirajsinh Makwana',
              url: 'https://pruthvirajsinh.in/',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://pruthvirajsinh.in/blog/${post.slug}`,
            },
            keywords: post.meta_keywords || (post.tags || []).join(', '),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Back Button */}
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <ScrollReveal animation="fade-up">
              <Link to="/blog">
                <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          {/* Article Header */}
          <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <ScrollReveal animation="fade-up" delay={50}>
              <header className="mb-8">
                {/* Category */}
                {post.blog_categories && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {post.blog_categories.name}
                  </span>
                )}
                
                {/* Title */}
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
                  {post.title}
                </h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground border-b border-border pb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Pruthvirajsinh Makwana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadTime(post.content || '')} min read</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyLink}
                    className="ml-auto gap-2 h-8"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>
              </header>
            </ScrollReveal>

            {/* Featured Image */}
            {post.featured_image && (
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg border border-border/50">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Content */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  [&>*:first-child]:mt-0
                  
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                  prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/30
                  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-h4:text-lg sm:prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                  
                  prose-p:text-foreground/85 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-base sm:prose-p:text-lg
                  [&_p:empty]:min-h-[1.8em] [&_p:empty]:mb-6
                  [&_p>br]:block [&_p>br]:content-[''] [&_p>br]:mt-[1.8em]
                  
                  prose-a:text-primary prose-a:font-semibold prose-a:no-underline prose-a:border-b-2 prose-a:border-primary/30 hover:prose-a:border-primary hover:prose-a:text-primary/80 prose-a:transition-colors
                  
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-em:italic prose-em:text-foreground/80
                  
                  prose-ul:my-8 prose-ul:pl-0 prose-ul:list-none prose-ul:space-y-3
                  prose-ol:my-8 prose-ol:pl-6 prose-ol:list-decimal prose-ol:space-y-3
                  prose-li:text-foreground/85 prose-li:leading-relaxed prose-li:text-base sm:prose-li:text-lg
                  [&_ul>li]:pl-8 [&_ul>li]:relative
                  [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:w-2 [&_ul>li]:before:h-2 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary/60
                  
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-muted/80 prose-blockquote:to-transparent
                  prose-blockquote:pl-8 prose-blockquote:pr-6 prose-blockquote:py-6 prose-blockquote:my-10 
                  prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground/80
                  prose-blockquote:text-lg prose-blockquote:font-medium
                  
                  prose-code:bg-muted/80 prose-code:px-2.5 prose-code:py-1.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-mono prose-code:text-primary
                  prose-code:before:content-none prose-code:after:content-none
                  
                  prose-pre:bg-[#1e1e2e] prose-pre:p-6 prose-pre:rounded-2xl prose-pre:overflow-x-auto prose-pre:my-10
                  prose-pre:border prose-pre:border-border/30 prose-pre:shadow-lg
                  
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:border prose-img:border-border/30
                  
                  prose-hr:border-border/50 prose-hr:my-14
                  
                  prose-table:my-8 prose-table:w-full
                  prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-border
                  prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-border/50"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }}
              />
            </ScrollReveal>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="border-t border-border pt-8 mt-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Author Card */}
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="mt-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <span className="text-xl font-heading font-bold text-primary">PM</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Written by</p>
                    <h3 className="font-heading text-lg font-bold text-foreground">Pruthvirajsinh Makwana</h3>
                    <p className="text-primary text-sm mb-2">IT Professional & Esports Commentator</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Passionate about web development, digital marketing, and the gaming industry.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="mt-12 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border border-primary/20 rounded-2xl p-8 text-center">
                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-3 text-foreground">
                  Want to work together?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                  I'm available for freelance projects, collaborations, and esports events.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/contact">Get In Touch</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/services">View Services</Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </article>
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default BlogPost;
