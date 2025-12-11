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
    const words = content?.split(' ').length || 0;
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
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            {/* Background Image */}
            {post.featured_image && (
              <div className="absolute inset-0 h-[50vh] lg:h-[60vh]">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
              </div>
            )}
            
            <div className="container mx-auto px-6 relative z-10 pt-12 pb-8">
              {/* Back Button */}
              <ScrollReveal animation="fade-up">
                <Link to="/blog">
                  <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </ScrollReveal>

              {/* Header */}
              <ScrollReveal animation="fade-up" delay={100}>
                <header className="max-w-4xl mx-auto text-center">
                  {post.blog_categories && (
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                      {post.blog_categories.name}
                    </span>
                  )}
                  
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span>Pruthvirajsinh Makwana</span>
                    </div>
                    <span className="hidden sm:block">•</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                    </div>
                    <span className="hidden sm:block">•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{estimateReadTime(post.content || '')} min read</span>
                    </div>
                  </div>
                </header>
              </ScrollReveal>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12">
            <article className="container mx-auto px-6 max-w-3xl">
              {/* Share Button */}
              <ScrollReveal animation="fade-up">
                <div className="flex justify-end mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>
              </ScrollReveal>

              {/* Featured Image (if no hero) */}
              {post.featured_image && (
                <ScrollReveal animation="fade-up">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ScrollReveal>
              )}

              {/* Content */}
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    className="text-foreground leading-relaxed whitespace-pre-wrap"
                    style={{ fontSize: '1.125rem', lineHeight: '1.9' }}
                  >
                    {post.content}
                  </div>
                </div>
              </ScrollReveal>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <ScrollReveal animation="fade-up" delay={150}>
                  <div className="border-t border-border pt-8 mt-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <Tag className="w-5 h-5 text-muted-foreground" />
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Author Card */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="mt-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <span className="text-2xl font-heading font-bold text-primary">PM</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-heading text-lg font-bold mb-1">Pruthvirajsinh Makwana</h3>
                      <p className="text-primary text-sm mb-3">IT Professional & Esports Commentator</p>
                      <p className="text-muted-foreground text-sm">
                        Passionate about web development, digital marketing, and the gaming industry. 
                        Always learning and sharing knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal animation="fade-up" delay={250}>
                <div className="mt-12 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 text-center">
                  <h3 className="font-heading text-2xl font-bold mb-4">
                    Want to work together?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    I'm available for freelance projects, collaborations, and esports events.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </section>
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default BlogPost;