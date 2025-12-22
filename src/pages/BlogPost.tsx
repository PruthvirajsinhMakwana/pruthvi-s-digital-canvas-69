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
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ''} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
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
                  
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
                  prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                  prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/50
                  prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  
                  prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-5
                  
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-em:italic prose-em:text-foreground/80
                  
                  prose-ul:my-6 prose-ul:pl-6 prose-ul:list-disc prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:pl-6 prose-ol:list-decimal prose-ol:space-y-2
                  prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:marker:text-primary
                  
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 
                  prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:my-8 
                  prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground/80
                  
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
                  prose-code:before:content-none prose-code:after:content-none
                  
                  prose-pre:bg-muted prose-pre:p-5 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-8
                  prose-pre:border prose-pre:border-border/50
                  
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-border/50
                  
                  prose-hr:border-border prose-hr:my-10"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
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
