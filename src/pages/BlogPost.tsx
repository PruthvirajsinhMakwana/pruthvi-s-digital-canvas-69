import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ArrowLeft, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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
          <article className="container mx-auto px-6 max-w-4xl">
            {/* Back Button */}
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            {/* Header */}
            <header className="mb-12">
              {post.blog_categories && (
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {post.blog_categories.name}
                </span>
              )}
              
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Pruthvirajsinh Makwana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <div 
                className="text-foreground leading-relaxed whitespace-pre-wrap"
                style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
              >
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="border-t border-border pt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 glass-card rounded-2xl p-8 text-center neon-border">
              <h3 className="font-heading text-2xl font-bold mb-4">
                Want to work together?
              </h3>
              <p className="text-muted-foreground mb-6">
                I'm available for freelance projects and collaborations.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="xl">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </article>
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default BlogPost;
